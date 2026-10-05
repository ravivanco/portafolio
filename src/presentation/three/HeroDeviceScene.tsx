import React, { useEffect, useInsertionEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot, extend, useFrame, useThree, type ReconcilerRoot } from '@react-three/fiber';
import * as THREE from 'three';

// <Canvas> registers the whole THREE namespace, which defeats tree-shaking
// (about 250 KB gzip). Mounting through createRoot with only the classes this
// scene uses keeps the chunk to what three.js actually needs to render it.
extend({
  Group: THREE.Group,
  Mesh: THREE.Mesh,
  LineSegments: THREE.LineSegments,
  LineLoop: THREE.LineLoop,
  Line: THREE.Line,
  Points: THREE.Points,
  InstancedMesh: THREE.InstancedMesh,
});

// A phone whose screen projects a small neural network forward in depth:
// "from the phone app to the model behind it". Pulses (magenta, the model at
// work) travel layer to layer and light up the nodes they reach.
// The phone turns a full 360 inside three electron orbits, and a swarm of
// square nanobots circles it, then lands on the screen row by row, top to
// bottom: the app assembled the same way the page re-renders.
// Lazy-loaded; everything here stays out of the main bundle.

const PHONE = { w: 1.5, h: 3.0, d: 0.14, r: 0.24 };
const SCREEN = { w: 1.32, h: 2.82, r: 0.16 };
const LAYERS = [
  { n: 4, y: -0.95, z: 0.09, spread: 0.84 },
  { n: 5, y: -0.3, z: 0.3, spread: 1.0 },
  { n: 4, y: 0.35, z: 0.52, spread: 0.84 },
  { n: 2, y: 0.95, z: 0.72, spread: 0.4 },
];
const PULSES = 7;
const BASE_ROT = { x: -0.1, y: -0.4 };
/** Bounds the camera fits to: the orbits, which reach past the phone. */
const FIT = { w: 2.55, h: 3.55 };
/** Seconds per full turn of the phone. */
const TURN = 24;

/** Orbits are nearly edge-on circles: `tilt` flattens each to an ellipse, `roll` sets its axis. */
const ORBIT = { r: 1.38, tilt: 1.08, segments: 96 };
const ELECTRONS = [
  { roll: Math.PI / 2, period: 3.4, phase: 0 },
  { roll: (60 * Math.PI) / 180, period: 4.3, phase: 2.1 },
  { roll: (120 * Math.PI) / 180, period: 5.1, phase: 4.2 },
];
const TAIL = { points: 18, arc: 1.1 };

/** Screen grid the nanobots assemble into. */
const GRID = { cols: 9, rows: 19, w: 1.08, h: 2.46 };
/** Seconds per assemble/disperse cycle. */
const BUILD = 10;

type Palette = { ink: string; signal: string; dream: string; surface: string; ground: string };

const readPalette = (): Palette => {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return { ink: v('--ink'), signal: v('--signal'), dream: v('--dream'), surface: v('--surface'), ground: v('--ground') };
};

/** Re-reads the CSS tokens whenever the theme attribute flips. */
const usePalette = () => {
  const [palette, setPalette] = useState(readPalette);
  useEffect(() => {
    const mo = new MutationObserver(() => setPalette(readPalette()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);
  return palette;
};

const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

const outline = (shape: THREE.Shape, z: number) => {
  const g = new THREE.BufferGeometry().setFromPoints(shape.getPoints(8).map((p) => new THREE.Vector3(p.x, p.y, z)));
  return g;
};

const buildNetwork = () => {
  const nodes: THREE.Vector3[] = [];
  const layerOf: number[] = [];
  const starts: number[] = [];
  LAYERS.forEach((l, li) => {
    starts.push(nodes.length);
    for (let i = 0; i < l.n; i++) {
      const x = l.n === 1 ? 0 : -l.spread / 2 + (l.spread * i) / (l.n - 1);
      nodes.push(new THREE.Vector3(x, l.y, l.z));
      layerOf.push(li);
    }
  });
  const edges: [number, number][] = [];
  for (let li = 0; li < LAYERS.length - 1; li++) {
    for (let a = 0; a < LAYERS[li].n; a++) {
      for (let b = 0; b < LAYERS[li + 1].n; b++) edges.push([starts[li] + a, starts[li + 1] + b]);
    }
  }
  const outgoing = nodes.map((_, i) => edges.map((e, k) => (e[0] === i ? k : -1)).filter((k) => k >= 0));
  const firstLayerEdges = edges.map((e, k) => (layerOf[e[0]] === 0 ? k : -1)).filter((k) => k >= 0);

  const linePos = new Float32Array(edges.length * 6);
  edges.forEach(([a, b], k) => {
    nodes[a].toArray(linePos, k * 6);
    nodes[b].toArray(linePos, k * 6 + 3);
  });
  const lines = new THREE.BufferGeometry();
  lines.setAttribute('position', new THREE.BufferAttribute(linePos, 3));

  return { nodes, edges, outgoing, firstLayerEdges, lines };
};

const pick = <T,>(arr: T[]) => arr[(Math.random() * arr.length) | 0];

// Nanobots run entirely on the GPU: each one's orbit and its screen cell are
// attributes, and the vertex shader places it from the clock alone.
const BOT_VERT = `
attribute vec4 aOrbit;
attribute vec4 aCell;
uniform float uTime;
uniform float uSize;
uniform float uScreenZ;
varying float vBuild;

void main() {
  float a = aOrbit.z + uTime * aOrbit.w;
  vec3 orbit = vec3(cos(a) * aOrbit.x, aOrbit.y + sin(uTime * 0.8 + aOrbit.z * 3.0) * 0.06, sin(a) * aOrbit.x);
  float w = fract(uTime / ${BUILD.toFixed(1)} - aCell.z * 0.22);
  float build = aCell.w * smoothstep(0.04, 0.26, w) * (1.0 - smoothstep(0.6, 0.8, w));
  vec3 p = mix(orbit, vec3(aCell.xy, uScreenZ), build);
  p.z += sin(build * 3.14159) * 0.45;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (9.0 / -mv.z) * (1.0 + build * 0.5);
  vBuild = build;
}
`;

const BOT_FRAG = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vBuild;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * mix(0.5, 1.0, vBuild));
}
`;

const buildBots = (n: number) => {
  const orbit = new Float32Array(n * 4);
  const cell = new Float32Array(n * 4);
  const cells = Array.from({ length: GRID.cols * GRID.rows }, (_, i) => i).sort(() => Math.random() - 0.5);
  const cw = GRID.w / GRID.cols;
  const ch = GRID.h / GRID.rows;
  for (let i = 0; i < n; i++) {
    const dir = Math.random() < 0.5 ? -1 : 1;
    orbit.set([0.98 + Math.random() * 0.5, (Math.random() * 2 - 1) * 1.45, Math.random() * Math.PI * 2, dir * (0.25 + Math.random() * 0.35)], i * 4);
    // Two in three bots build; the rest keep circling.
    const c = cells[i];
    if (c !== undefined && i % 3 !== 2) {
      const col = c % GRID.cols;
      const row = (c / GRID.cols) | 0;
      // Delay by row so the screen fills from the top, like a scan.
      cell.set([-GRID.w / 2 + cw * (col + 0.5), GRID.h / 2 - ch * (row + 0.5), row / GRID.rows, 1], i * 4);
    }
  }
  const g = new THREE.BufferGeometry();
  // Positions come from the shader; this attribute only sizes the draw.
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute('aOrbit', new THREE.BufferAttribute(orbit, 4));
  g.setAttribute('aCell', new THREE.BufferAttribute(cell, 4));
  return g;
};

const ringGeometry = () =>
  new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: ORBIT.segments }, (_, i) => {
      const a = (i / ORBIT.segments) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * ORBIT.r, Math.sin(a) * ORBIT.r, 0);
    }),
  );

const tailGeometry = () => {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TAIL.points * 3), 3));
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(TAIL.points * 4), 4));
  return g;
};

interface DeviceProps {
  palette: Palette;
  onSlow: () => void;
  onReady: () => void;
}

const Device: React.FC<DeviceProps> = ({ palette, onSlow, onReady }) => {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const atom = useRef<THREE.Group>(null);
  const electronMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const clock = useRef(0);
  const nodeMesh = useRef<THREE.InstancedMesh>(null);
  const pulseMesh = useRef<THREE.InstancedMesh>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const geo = useMemo(() => {
    const body = new THREE.ExtrudeGeometry(roundedRect(PHONE.w, PHONE.h, PHONE.r), {
      depth: PHONE.d,
      bevelEnabled: false,
      curveSegments: 8,
    });
    body.translate(0, 0, -PHONE.d / 2);
    const screenShape = roundedRect(SCREEN.w, SCREEN.h, SCREEN.r);
    return {
      body,
      bodyEdges: new THREE.EdgesGeometry(body, 40),
      screen: new THREE.ShapeGeometry(screenShape, 8).translate(0, 0, PHONE.d / 2 + 0.002),
      screenEdge: outline(screenShape, PHONE.d / 2 + 0.004),
      island: outline(roundedRect(0.34, 0.09, 0.045), PHONE.d / 2 + 0.004).translate(0, 1.24, 0),
      homeBar: outline(roundedRect(0.42, 0.02, 0.01), PHONE.d / 2 + 0.004).translate(0, -1.3, 0),
      node: new THREE.IcosahedronGeometry(0.045, 1),
      pulse: new THREE.IcosahedronGeometry(0.03, 1),
      electron: new THREE.IcosahedronGeometry(0.05, 1),
      ring: ringGeometry(),
      bots: buildBots(window.innerWidth < 768 ? 120 : 170),
      net: buildNetwork(),
    };
  }, []);

  const tails = useMemo(() => ELECTRONS.map(tailGeometry), []);

  useEffect(
    () => () => {
      const { net, ...rest } = geo;
      (Object.values(rest) as THREE.BufferGeometry[]).forEach((g) => g.dispose());
      net.lines.dispose();
      tails.forEach((g) => g.dispose());
    },
    [geo, tails],
  );

  const mats = useMemo(
    () => ({
      body: new THREE.MeshBasicMaterial(),
      screen: new THREE.MeshBasicMaterial(),
      edge: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.7, depthWrite: false }),
      faint: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.25, depthWrite: false }),
      wire: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.32, depthWrite: false }),
      node: new THREE.MeshBasicMaterial(),
      pulse: new THREE.MeshBasicMaterial(),
      orbit: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.26, depthWrite: false }),
      electron: new THREE.MeshBasicMaterial(),
      tail: new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }),
      bots: new THREE.ShaderMaterial({
        vertexShader: BOT_VERT,
        fragmentShader: BOT_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 2.4 * Math.min(window.devicePixelRatio || 1, 1.5) },
          uScreenZ: { value: PHONE.d / 2 + 0.012 },
          uColor: { value: new THREE.Color() },
          uOpacity: { value: 0.9 },
        },
      }),
    }),
    [],
  );

  useEffect(() => () => (Object.values(mats) as THREE.Material[]).forEach((m) => m.dispose()), [mats]);

  useEffect(() => {
    mats.body.color.set(palette.surface);
    mats.screen.color.set(palette.ground);
    mats.edge.color.set(palette.ink);
    mats.faint.color.set(palette.ink);
    mats.wire.color.set(palette.signal);
    mats.node.color.set(palette.signal);
    mats.pulse.color.set(palette.dream);
    mats.orbit.color.set(palette.ink);
    mats.electron.color.set(palette.signal);
    (mats.bots.uniforms.uColor.value as THREE.Color).set(palette.signal);
    // Tails fade from the electron's colour to nothing.
    const c = new THREE.Color(palette.signal);
    tails.forEach((g) => {
      const col = g.getAttribute('color') as THREE.BufferAttribute;
      for (let j = 0; j < TAIL.points; j++) col.setXYZW(j, c.r, c.g, c.b, Math.pow(1 - j / (TAIL.points - 1), 1.6) * 0.9);
      col.needsUpdate = true;
    });
  }, [mats, palette, tails]);

  // Fine pointers tilt the device a little; touch devices just get the idle sway.
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const on = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);

  const sim = useMemo(() => {
    const { net } = geo;
    return {
      heat: new Float32Array(net.nodes.length),
      edge: Array.from({ length: PULSES }, () => pick(net.firstLayerEdges)),
      t: Array.from({ length: PULSES }, (_, i) => -i * 0.35),
      speed: Array.from({ length: PULSES }, () => 0.9 + Math.random() * 0.5),
    };
  }, [geo]);

  const tmp = useMemo(() => ({ m: new THREE.Matrix4(), v: new THREE.Vector3(), s: new THREE.Vector3(), q: new THREE.Quaternion() }), []);
  const perf = useRef({ warm: 0, frames: 0, time: 0, done: false, ready: false });

  useFrame((state, rawDt) => {
    const g = group.current;
    const nm = nodeMesh.current;
    const pm = pulseMesh.current;
    if (!g || !nm || !pm) return;

    // Watchdog: if the first ~90 frames after warm-up average under 30fps, hand back to the still.
    const p = perf.current;
    if (!p.done && rawDt < 0.5) {
      if (p.warm < 1) {
        p.warm += rawDt;
      } else {
        p.frames += 1;
        p.time += rawDt;
        if (p.frames >= 90) {
          p.done = true;
          if (p.time / p.frames > 1 / 30) onSlow();
        }
      }
    }

    const dt = Math.min(rawDt, 1 / 20);
    // Own clock, advanced only while rendering, so a paused scene resumes where it left off.
    clock.current += dt;
    const t = clock.current;
    const k = Math.min(1, dt * 3);
    // The rig takes the pointer and a slow nod; the turn itself lives on `spin`.
    const ty = pointer.current.x * 0.3;
    const tx = BASE_ROT.x + Math.sin(t * 0.33) * 0.05 + pointer.current.y * 0.14;
    g.rotation.y += (ty - g.rotation.y) * k;
    g.rotation.x += (tx - g.rotation.x) * k;
    g.position.y = Math.sin(t * 0.9) * 0.04;

    if (spin.current) spin.current.rotation.y = BASE_ROT.y + (t / TURN) * Math.PI * 2;
    // The orbits sway instead of following the turn, so the phone visibly passes through them.
    if (atom.current) atom.current.rotation.y = Math.sin(t * 0.21) * 0.32;

    ELECTRONS.forEach((e, i) => {
      const head = e.phase + (t / e.period) * Math.PI * 2;
      electronMeshes.current[i]?.position.set(Math.cos(head) * ORBIT.r, Math.sin(head) * ORBIT.r, 0);
      const pos = tails[i].getAttribute('position') as THREE.BufferAttribute;
      for (let j = 0; j < TAIL.points; j++) {
        const a = head - (j / (TAIL.points - 1)) * TAIL.arc;
        pos.setXYZ(j, Math.cos(a) * ORBIT.r, Math.sin(a) * ORBIT.r, 0);
      }
      pos.needsUpdate = true;
    });
    mats.bots.uniforms.uTime.value = t;

    const { net } = geo;
    for (let i = 0; i < PULSES; i++) {
      sim.t[i] += dt * sim.speed[i];
      if (sim.t[i] >= 1) {
        const reached = net.edges[sim.edge[i]][1];
        sim.heat[reached] = 1;
        const next = net.outgoing[reached];
        sim.edge[i] = next.length ? pick(next) : pick(net.firstLayerEdges);
        sim.t[i] = next.length ? 0 : -0.6;
      }
      const [a, b] = net.edges[sim.edge[i]];
      const u = Math.max(0, sim.t[i]);
      tmp.v.lerpVectors(net.nodes[a], net.nodes[b], u);
      tmp.s.setScalar(sim.t[i] < 0 ? 0 : 1);
      pm.setMatrixAt(i, tmp.m.compose(tmp.v, tmp.q, tmp.s));
    }
    pm.instanceMatrix.needsUpdate = true;

    for (let i = 0; i < net.nodes.length; i++) {
      sim.heat[i] = Math.max(0, sim.heat[i] - dt * 1.6);
      tmp.s.setScalar(1 + sim.heat[i] * 0.6);
      nm.setMatrixAt(i, tmp.m.compose(net.nodes[i], tmp.q, tmp.s));
    }
    nm.instanceMatrix.needsUpdate = true;

    if (!p.ready) {
      p.ready = true;
      onReady();
    }
  });

  return (
    <group ref={group} rotation={[BASE_ROT.x, 0, 0]}>
      <group ref={spin} rotation={[0, BASE_ROT.y, 0]}>
        <mesh geometry={geo.body} material={mats.body} />
        <lineSegments geometry={geo.bodyEdges} material={mats.edge} />
        <mesh geometry={geo.screen} material={mats.screen} />
        <lineLoop geometry={geo.screenEdge} material={mats.faint} />
        <lineLoop geometry={geo.island} material={mats.edge} />
        <lineLoop geometry={geo.homeBar} material={mats.faint} />
        <lineSegments geometry={geo.net.lines} material={mats.wire} />
        <instancedMesh ref={nodeMesh} args={[geo.node, mats.node, geo.net.nodes.length]} />
        <instancedMesh ref={pulseMesh} args={[geo.pulse, mats.pulse, PULSES]} frustumCulled={false} />
        <points geometry={geo.bots} material={mats.bots} frustumCulled={false} />
      </group>
      <group ref={atom}>
        {ELECTRONS.map((e, i) => (
          <group key={i} rotation={[0, 0, e.roll]}>
            <group rotation={[ORBIT.tilt, 0, 0]}>
              <lineLoop geometry={geo.ring} material={mats.orbit} />
              <line geometry={tails[i]} material={mats.tail} frustumCulled={false} />
              <mesh
                ref={(m) => {
                  electronMeshes.current[i] = m;
                }}
                geometry={geo.electron}
                material={mats.electron}
              />
            </group>
          </group>
        ))}
      </group>
    </group>
  );
};

/** Keeps the device framed whatever the canvas aspect (tall on phones, squarer on desktop). */
const FitCamera: React.FC = () => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useLayoutEffect(() => {
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const aspect = size.width / Math.max(1, size.height);
    const z = Math.max(FIT.h / 2 / tan, FIT.w / 2 / (tan * aspect)) + 0.6;
    camera.position.set(0, 0.05, z);
    camera.lookAt(0, 0.05, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
};

export interface HeroDeviceSceneProps {
  /** false pauses the render loop (offscreen) */
  active: boolean;
  /** WebGL failed or the device can't hold 30fps */
  onFail: () => void;
  onReady: () => void;
}

type Size = { width: number; height: number; top: number; left: number };

export default function HeroDeviceScene({ active, onFail, onReady }: HeroDeviceSceneProps) {
  const palette = usePalette();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<ReconcilerRoot<HTMLCanvasElement> | null>(null);
  const [size, setSize] = useState<Size | null>(null);
  const [, rerun] = useState(0);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => setSize({ width: el.clientWidth, height: el.clientHeight, top: 0, left: 0 });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Same lifecycle as R3F's <Canvas>: insertion-effect cleanups survive StrictMode's
  // effect replay, so the root (and its WebGL context) is only released on real removal.
  useInsertionEffect(
    () => () => {
      root.current?.unmount();
      root.current = null;
    },
    [],
  );

  useLayoutEffect(() => {
    const el = canvas.current;
    if (!el || !size || !size.width || !size.height) return;
    if (!root.current) root.current = createRoot(el);
    const r = root.current;
    r.configure({
      flat: true,
      frameloop: active ? 'always' : 'never',
      dpr: [1, 1.5],
      gl: { alpha: true, antialias: true, powerPreference: 'low-power', stencil: false },
      camera: { fov: 30, near: 0.1, far: 40, position: [0, 0, 9] },
      size,
    }).catch(onFail);
    if (r.ready.status === 'fulfilled') {
      r.render(
        <>
          <FitCamera />
          <Device palette={palette} onSlow={onFail} onReady={onReady} />
        </>,
      );
    } else if (r.ready.status === 'pending') {
      r.ready.then(() => rerun((n) => n + 1), onFail);
    }
  });

  return (
    <div ref={wrap} className="h-full w-full">
      <canvas ref={canvas} className="block" />
    </div>
  );
}
