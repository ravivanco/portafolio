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
  InstancedMesh: THREE.InstancedMesh,
});

// A phone whose screen projects a small neural network forward in depth:
// "from the phone app to the model behind it". Pulses (magenta, the model at
// work) travel layer to layer and light up the nodes they reach.
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
/** Bounds the camera fits to, with room for the sway. */
const FIT = { w: 2.1, h: 3.4 };

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

interface DeviceProps {
  palette: Palette;
  onSlow: () => void;
  onReady: () => void;
}

const Device: React.FC<DeviceProps> = ({ palette, onSlow, onReady }) => {
  const group = useRef<THREE.Group>(null);
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
      net: buildNetwork(),
    };
  }, []);

  useEffect(
    () => () => {
      const { net, ...rest } = geo;
      (Object.values(rest) as THREE.BufferGeometry[]).forEach((g) => g.dispose());
      net.lines.dispose();
    },
    [geo],
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
  }, [mats, palette]);

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
    const t = state.clock.elapsedTime;
    const k = Math.min(1, dt * 3);
    const ty = BASE_ROT.y + Math.sin(t * 0.45) * 0.2 + pointer.current.x * 0.3;
    const tx = BASE_ROT.x + Math.sin(t * 0.33) * 0.05 + pointer.current.y * 0.14;
    g.rotation.y += (ty - g.rotation.y) * k;
    g.rotation.x += (tx - g.rotation.x) * k;
    g.position.y = Math.sin(t * 0.9) * 0.04;

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
    <group ref={group} rotation={[BASE_ROT.x, BASE_ROT.y, 0]}>
      <mesh geometry={geo.body} material={mats.body} />
      <lineSegments geometry={geo.bodyEdges} material={mats.edge} />
      <mesh geometry={geo.screen} material={mats.screen} />
      <lineLoop geometry={geo.screenEdge} material={mats.faint} />
      <lineLoop geometry={geo.island} material={mats.edge} />
      <lineLoop geometry={geo.homeBar} material={mats.faint} />
      <lineSegments geometry={geo.net.lines} material={mats.wire} />
      <instancedMesh ref={nodeMesh} args={[geo.node, mats.node, geo.net.nodes.length]} />
      <instancedMesh ref={pulseMesh} args={[geo.pulse, mats.pulse, PULSES]} frustumCulled={false} />
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
