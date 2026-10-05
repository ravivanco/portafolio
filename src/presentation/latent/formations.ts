// Point formations for the latent field. Every formation is N points packed as
// vec4 (x, y, z, shade), normalized so the shape fits a unit radius (y in [-1, 1]).

export type Formation = Float32Array;

export const FORMATION_NAMES = ['portrait', 'helix', 'brain', 'device', 'portal'] as const;
export type FormationName = (typeof FORMATION_NAMES)[number];

const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const gauss = (rnd: () => number) => {
  const u = Math.max(rnd(), 1e-6);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
};

const put = (out: Float32Array, i: number, x: number, y: number, z: number, s: number) => {
  out[i * 4] = x;
  out[i * 4 + 1] = y;
  out[i * 4 + 2] = z;
  out[i * 4 + 3] = s;
};

/** Placeholder while the portrait loads: a soft head-and-shoulders bust. */
export function bust(n: number): Formation {
  const out = new Float32Array(n * 4);
  const rnd = mulberry32(7);
  for (let i = 0; i < n; i++) {
    const head = rnd() < 0.45;
    const a = rnd() * Math.PI * 2;
    if (head) {
      const r = Math.sqrt(rnd());
      put(out, i, Math.cos(a) * r * 0.32, 0.42 + Math.sin(a) * r * 0.42, (1 - r) * 0.2, 0.55);
    } else {
      const x = (rnd() * 2 - 1) * 0.72;
      const y = -0.2 - rnd() * 0.8 - Math.abs(x) * 0.15;
      put(out, i, x, y, 0.15 * (1 - x * x), 0.3);
    }
  }
  return out;
}

/**
 * Sample the portrait photo into points. The photo sits on white, so the
 * background is found by flood fill from the border; points are weighted
 * toward edges (eyes, brows, jaw, lapels) so the face reads with few points.
 */
export function portraitFromImage(img: HTMLImageElement, n: number): Formation | null {
  const W = 150;
  const H = Math.round((img.naturalHeight / img.naturalWidth) * W) || 200;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, W, H);
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, W, H).data;
  } catch {
    return null;
  }

  const lum = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    lum[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255;
  }

  // Flood-fill near-white background from the border.
  const bg = new Uint8Array(W * H);
  const stack: number[] = [];
  const seed = (x: number, y: number) => {
    const k = y * W + x;
    if (!bg[k] && lum[k] > 0.9) {
      bg[k] = 1;
      stack.push(k);
    }
  };
  for (let x = 0; x < W; x++) { seed(x, 0); seed(x, H - 1); }
  for (let y = 0; y < H; y++) { seed(0, y); seed(W - 1, y); }
  while (stack.length) {
    const k = stack.pop()!;
    const x = k % W;
    const y = (k / W) | 0;
    if (x > 0) seed(x - 1, y);
    if (x < W - 1) seed(x + 1, y);
    if (y > 0) seed(x, y - 1);
    if (y < H - 1) seed(x, y + 1);
  }

  const weights = new Float32Array(W * H);
  const grad = new Float32Array(W * H);
  let total = 0;
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const k = y * W + x;
      if (bg[k]) continue;
      const gx = lum[k + 1] - lum[k - 1];
      const gy = lum[k + W] - lum[k - W];
      const g = Math.min(1, Math.sqrt(gx * gx + gy * gy) * 2.2);
      grad[k] = g;
      const head = y < H * 0.48 ? 1.7 : 1;
      const w = (0.34 + g * 2.4) * head;
      weights[k] = w;
      total += w;
    }
  }
  if (total <= 0) return null;

  const cdf = new Float32Array(W * H);
  let acc = 0;
  for (let k = 0; k < W * H; k++) {
    acc += weights[k];
    cdf[k] = acc;
  }

  const out = new Float32Array(n * 4);
  const rnd = mulberry32(42);
  const aspect = W / H;
  for (let i = 0; i < n; i++) {
    const target = rnd() * acc;
    let lo = 0;
    let hi = W * H - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const x = lo % W;
    const y = (lo / W) | 0;
    const nx = ((x + rnd()) / W) * 2 - 1;
    const ny = 1 - ((y + rnd()) / H) * 2;
    const l = lum[lo];
    const g = grad[lo];
    const px = nx * aspect;
    // Rounded relief: the face bulges toward the viewer, brightness adds depth.
    const z = 0.22 * (1 - Math.min(1, px * px * 1.6)) + (l - 0.45) * 0.22 + gauss(rnd) * 0.012;
    const shade = Math.min(1, 0.3 + l * 0.66 + g * 0.55);
    put(out, i, px, ny, z, shade);
  }
  return out;
}

/** Career path: a double helix with three bright knots (one per role). */
export function helix(n: number): Formation {
  const out = new Float32Array(n * 4);
  const rnd = mulberry32(11);
  const turns = 2.25;
  const R = 0.4;
  const knots = [0.62, 0, -0.62];
  for (let i = 0; i < n; i++) {
    const r = rnd();
    if (r < 0.62) {
      const t = rnd();
      const strand = rnd() < 0.5 ? 0 : Math.PI;
      const a = t * turns * Math.PI * 2 + strand;
      const y = 1 - t * 2;
      put(out, i, Math.cos(a) * R + gauss(rnd) * 0.018, y + gauss(rnd) * 0.01, Math.sin(a) * R + gauss(rnd) * 0.018, 0.75);
    } else if (r < 0.8) {
      const t = Math.floor(rnd() * 26) / 26 + 0.5 / 26;
      const a = t * turns * Math.PI * 2;
      const s = rnd() * 2 - 1;
      put(out, i, Math.cos(a) * R * s, 1 - t * 2, Math.sin(a) * R * s, 0.35);
    } else if (r < 0.92) {
      const k = knots[Math.floor(rnd() * knots.length)];
      put(out, i, gauss(rnd) * 0.07, k + gauss(rnd) * 0.05, gauss(rnd) * 0.07, 1);
    } else {
      const a = rnd() * Math.PI * 2;
      const rr = 0.55 + rnd() * 0.5;
      put(out, i, Math.cos(a) * rr, rnd() * 2 - 1, Math.sin(a) * rr, 0.18);
    }
  }
  return out;
}

/** Point roles, read by the field shader: x = kind, y = path progress (-1 = none), z = lane phase, w = seed (negative = reflection). */
export const ROLE_KIND = { other: 0, node: 1, edge: 2, ray: 3 } as const;
/** Centre the rays radiate from (also the brain's centre). */
export const BRAIN_CENTER: [number, number, number] = [0, 0.33, 0];
const FLOOR_Y = -0.24;
const REFLECT = 0.72;

type V3 = [number, number, number];

/**
 * A low-poly brain as a graph: two hemispheres, a cerebellum and a stem,
 * each vertex wired to its nearest neighbours. Pulse lanes are random walks
 * through the graph; every vertex and edge on a lane knows when the pulse
 * reaches it, so the shader can run light along the wires and flash nodes.
 */
const brainGraph = (() => {
  const rnd = mulberry32(23);
  const verts: V3[] = [];
  const group: number[] = [];
  const fib = (count: number, cb: (d: V3) => void) => {
    for (let i = 0; i < count; i++) {
      const y = 1 - ((i + 0.5) / count) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = i * 2.39996;
      cb([Math.cos(a) * r, y, Math.sin(a) * r]);
    }
  };

  // Hemispheres: ellipsoids with a flat medial face, flattened underside,
  // a taller frontal lobe and a little radial jitter for the folds.
  for (const h of [-1, 1]) {
    fib(42, ([dx, dy, dz]) => {
      const j = 1 + (rnd() - 0.5) * 0.08;
      let x = dx * 0.36 * j;
      let y = dy * 0.36 * j;
      const z = dz * 0.62 * j;
      if (dx * h < 0) x *= 0.4;
      if (dy < 0) y *= 0.62;
      if (dz > 0 && dy > 0) y += 0.06 * dz;
      verts.push([h * 0.21 + x, y, z]);
      group.push(h < 0 ? 0 : 1);
    });
  }
  // Cerebellum, tucked under the back.
  fib(12, ([dx, dy, dz]) => {
    verts.push([dx * 0.25, -0.22 + dy * 0.11, -0.4 + dz * 0.14]);
    group.push(2);
  });
  // Stem.
  const stemStart = verts.length;
  for (let k = 0; k < 4; k++) {
    verts.push([0, -0.12 - k * 0.12, -0.18 - k * 0.025]);
    group.push(3);
  }

  const edgeKeys = new Set<string>();
  const edges: [number, number][] = [];
  const link = (a: number, b: number) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (a === b || edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push([a, b]);
  };
  const dist = (a: number, b: number) => Math.hypot(verts[a][0] - verts[b][0], verts[a][1] - verts[b][1], verts[a][2] - verts[b][2]);
  const nearest = (i: number, pool: number[], k: number) =>
    pool.filter((j) => j !== i).sort((a, b) => dist(i, a) - dist(i, b)).slice(0, k);

  for (let g = 0; g < 3; g++) {
    const pool = verts.map((_, i) => i).filter((i) => group[i] === g);
    for (const i of pool) for (const j of nearest(i, pool, 4)) link(i, j);
  }
  // Corpus callosum: the closest medial pairs across the midline.
  const left = verts.map((_, i) => i).filter((i) => group[i] === 0);
  const right = verts.map((_, i) => i).filter((i) => group[i] === 1);
  left
    .map((i) => ({ i, j: nearest(i, right, 1)[0] }))
    .sort((a, b) => dist(a.i, a.j) - dist(b.i, b.j))
    .slice(0, 6)
    .forEach(({ i, j }) => link(i, j));
  for (let k = 0; k < 3; k++) link(stemStart + k, stemStart + k + 1);
  for (const j of [...nearest(stemStart, left, 2), ...nearest(stemStart, right, 2)]) link(stemStart, j);
  const cereb = verts.map((_, i) => i).filter((i) => group[i] === 2);
  link(stemStart + 1, nearest(stemStart + 1, cereb, 1)[0]);

  // Pulse lanes: short random walks, one step per edge.
  const LANES = 12;
  const STEPS = 7;
  const adj = verts.map(() => [] as number[]);
  edges.forEach(([a, b]) => {
    adj[a].push(b);
    adj[b].push(a);
  });
  const nodeLane = new Map<number, { s: number; phase: number }>();
  const edgeLane = new Map<string, { from: number; s0: number; s1: number; phase: number }>();
  for (let l = 0; l < LANES; l++) {
    const phase = rnd();
    let at = Math.floor(rnd() * verts.length);
    const seen = new Set([at]);
    if (!nodeLane.has(at)) nodeLane.set(at, { s: 0, phase });
    for (let step = 0; step < STEPS; step++) {
      const next = adj[at].filter((v) => !seen.has(v));
      if (!next.length) break;
      const to = next[Math.floor(rnd() * next.length)];
      const key = at < to ? `${at}-${to}` : `${to}-${at}`;
      if (!edgeLane.has(key)) edgeLane.set(key, { from: at, s0: step / STEPS, s1: (step + 1) / STEPS, phase });
      if (!nodeLane.has(to)) nodeLane.set(to, { s: (step + 1) / STEPS, phase });
      seen.add(to);
      at = to;
    }
  }

  const lengths = edges.map(([a, b]) => dist(a, b));
  return { verts, edges, lengths, total: lengths.reduce((s, l) => s + l, 0), nodeLane, edgeLane };
})();

export const BRAIN_NODE_COUNT = brainGraph.verts.length;

/** Core tech: a low-poly wireframe brain with light rays and a floor reflection. */
export function brain(n: number): { formation: Formation; roles: Float32Array } {
  const out = new Float32Array(n * 4);
  const roles = new Float32Array(n * 4);
  const rnd = mulberry32(29);
  const { verts, edges, lengths, total, nodeLane, edgeLane } = brainGraph;
  const [cx, cy, cz] = BRAIN_CENTER;

  const RAYS = 28;
  const rays = Array.from({ length: RAYS }, () => {
    const a = rnd() * Math.PI * 2;
    const dy = -0.15 + rnd() * 0.75;
    const k = Math.sqrt(1 - dy * dy);
    const d: V3 = [Math.cos(a) * k, dy, Math.sin(a) * k];
    const r0 = 0.74 + rnd() * 0.08;
    const r1 = Math.min(r0 + 0.2 + rnd() * 0.25, dy > 0 ? (1.05 - cy) / dy : 2);
    return { d, r0, r1, phase: rnd() };
  });

  const role = (i: number, kind: number, s: number, phase: number, seed: number) => {
    roles.set([kind, s, phase, seed], i * 4);
  };

  // One point on the mesh (a node or a wire); mirrored ones form the reflection.
  const meshPoint = (i: number, mirror: boolean) => {
    const sign = mirror ? -1 : 1;
    let x: number;
    let y: number;
    let z: number;
    let shade: number;
    if (rnd() < 0.15) {
      const v = Math.floor(rnd() * verts.length);
      const [vx, vy, vz] = verts[v];
      x = vx + gauss(rnd) * 0.012;
      y = vy + gauss(rnd) * 0.012;
      z = vz + gauss(rnd) * 0.012;
      shade = 1;
      const lane = nodeLane.get(v);
      role(i, ROLE_KIND.node, lane ? lane.s : -1, lane ? lane.phase : 0, sign * (0.05 + rnd() * 0.95));
    } else {
      let pick = rnd() * total;
      let e = 0;
      while (e < edges.length - 1 && pick > lengths[e]) pick -= lengths[e++];
      const [a, b] = edges[e];
      const t = rnd();
      const A = verts[a];
      const B = verts[b];
      x = A[0] + (B[0] - A[0]) * t + gauss(rnd) * 0.002;
      y = A[1] + (B[1] - A[1]) * t + gauss(rnd) * 0.002;
      z = A[2] + (B[2] - A[2]) * t;
      shade = 0.75;
      const lane = edgeLane.get(a < b ? `${a}-${b}` : `${b}-${a}`);
      const along = lane ? (lane.from === a ? t : 1 - t) : 0;
      role(i, ROLE_KIND.edge, lane ? lane.s0 + (lane.s1 - lane.s0) * along : -1, lane ? lane.phase : 0, sign * (0.05 + rnd() * 0.95));
    }
    y += cy;
    if (mirror) {
      // Mirrored across the floor, squashed, and fading with depth.
      const depth = (y - FLOOR_Y) * REFLECT;
      y = FLOOR_Y - depth;
      shade *= 0.55 * Math.max(0, 1 - depth / 0.75);
    }
    put(out, i, x + cx, y, z + cz, shade);
  };

  for (let i = 0; i < n; i++) {
    const r = rnd();
    if (r < 0.64) {
      meshPoint(i, false);
    } else if (r < 0.84) {
      meshPoint(i, true);
    } else if (r < 0.94) {
      const ray = rays[Math.floor(rnd() * RAYS)];
      const t = rnd();
      const rr = ray.r0 + (ray.r1 - ray.r0) * t;
      put(out, i, cx + ray.d[0] * rr, cy + ray.d[1] * rr, cz + ray.d[2] * rr, 0.95 * (1 - t * 0.5));
      role(i, ROLE_KIND.ray, t, ray.phase, 0.5);
    } else if (r < 0.97) {
      // The floor the reflection sits on: a faint ring.
      const a = rnd() * Math.PI * 2;
      const rr = 0.55 + gauss(rnd) * 0.03;
      put(out, i, Math.cos(a) * rr, FLOOR_Y, Math.sin(a) * rr, 0.22);
      role(i, ROLE_KIND.other, -1, 0, 0);
    } else {
      const a = rnd() * Math.PI * 2;
      const rr = 0.5 + rnd() * 0.5;
      put(out, i, Math.cos(a) * rr, rnd() * 2 - 1, Math.sin(a) * rr, 0.12);
      role(i, ROLE_KIND.other, -1, 0, 0);
    }
  }
  return { formation: out, roles };
}

/** Projects: a phone, with an app screen made of points. */
export function device(n: number): Formation {
  const out = new Float32Array(n * 4);
  const rnd = mulberry32(31);
  const hw = 0.48;
  const hh = 0.98;
  const cr = 0.14;
  const perimeterPoint = (): [number, number] => {
    // Walk a rounded rectangle by arc length.
    const straightW = 2 * (hw - cr);
    const straightH = 2 * (hh - cr);
    const arc = (Math.PI / 2) * cr;
    const total = 2 * straightW + 2 * straightH + 4 * arc;
    let d = rnd() * total;
    const segs: Array<[number, (u: number) => [number, number]]> = [
      [straightW, (u) => [-hw + cr + u * straightW, hh]],
      [arc, (u) => [hw - cr + Math.sin(u * Math.PI / 2) * cr, hh - cr + Math.cos(u * Math.PI / 2) * cr]],
      [straightH, (u) => [hw, hh - cr - u * straightH]],
      [arc, (u) => [hw - cr + Math.cos(u * Math.PI / 2) * cr, -hh + cr - Math.sin(u * Math.PI / 2) * cr]],
      [straightW, (u) => [hw - cr - u * straightW, -hh]],
      [arc, (u) => [-hw + cr - Math.sin(u * Math.PI / 2) * cr, -hh + cr - Math.cos(u * Math.PI / 2) * cr]],
      [straightH, (u) => [-hw, -hh + cr + u * straightH]],
      [arc, (u) => [-hw + cr - Math.cos(u * Math.PI / 2) * cr, hh - cr + Math.sin(u * Math.PI / 2) * cr]],
    ];
    for (const [len, fn] of segs) {
      if (d <= len) return fn(d / len);
      d -= len;
    }
    return [hw, 0];
  };
  const inset = 0.07;
  const sx0 = -hw + inset;
  const sx1 = hw - inset;
  for (let i = 0; i < n; i++) {
    const r = rnd();
    if (r < 0.36) {
      const [x, y] = perimeterPoint();
      const z = (rnd() < 0.5 ? 1 : -1) * 0.05;
      put(out, i, x, y, z, 0.95);
    } else if (r < 0.44) {
      const [x, y] = perimeterPoint();
      put(out, i, x, y, (rnd() * 2 - 1) * 0.05, 0.4);
    } else {
      // Screen: status bar, hero image block, three list rows, action button.
      const k = rnd();
      let x = 0;
      let y = 0;
      let s = 0.5;
      if (k < 0.08) {
        x = sx0 + 0.04 + rnd() * (sx1 - sx0 - 0.08); y = 0.86 + gauss(rnd) * 0.006; s = 0.5;
      } else if (k < 0.48) {
        x = sx0 + 0.04 + rnd() * (sx1 - sx0 - 0.08); y = 0.28 + rnd() * 0.48; s = 0.32 + 0.4 * rnd();
      } else if (k < 0.82) {
        const row = Math.floor(rnd() * 3);
        const yy = 0.08 - row * 0.2;
        if (rnd() < 0.3) {
          const a = rnd() * Math.PI * 2;
          x = sx0 + 0.1 + Math.cos(a) * 0.05; y = yy + Math.sin(a) * 0.05; s = 0.85;
        } else {
          x = sx0 + 0.2 + rnd() * (sx1 - sx0 - 0.28); y = yy + (rnd() < 0.5 ? 0.025 : -0.03); s = 0.5;
        }
      } else {
        x = sx0 + 0.06 + rnd() * (sx1 - sx0 - 0.12); y = -0.72 + (rnd() - 0.5) * 0.12; s = 1;
      }
      put(out, i, x, y, 0.06, s);
    }
  }
  return out;
}

/** Connect: a portal ring with arms spiralling into a bright core. */
export function portal(n: number): Formation {
  const out = new Float32Array(n * 4);
  const rnd = mulberry32(53);
  for (let i = 0; i < n; i++) {
    const r = rnd();
    if (r < 0.42) {
      const a = rnd() * Math.PI * 2;
      const tube = rnd() * Math.PI * 2;
      const R = 0.82 + Math.cos(tube) * 0.045;
      put(out, i, Math.cos(a) * R, Math.sin(a) * R, Math.sin(tube) * 0.045, 0.9);
    } else if (r < 0.9) {
      const arm = Math.floor(rnd() * 3);
      const t = rnd();
      const a = t * Math.PI * 3.2 + (arm * Math.PI * 2) / 3;
      const rad = 0.8 * Math.pow(1 - t, 0.8);
      put(out, i, Math.cos(a) * rad + gauss(rnd) * 0.015, Math.sin(a) * rad + gauss(rnd) * 0.015, -t * 0.9, 0.3 + t * 0.6);
    } else {
      put(out, i, gauss(rnd) * 0.06, gauss(rnd) * 0.06, -0.9 + gauss(rnd) * 0.05, 1);
    }
  }
  return out;
}

/** Per-point seeds: xy = screen dispersion target, z = size jitter, w = stagger. */
export function seeds(n: number): Float32Array {
  const out = new Float32Array(n * 4);
  const rnd = mulberry32(97);
  for (let i = 0; i < n; i++) {
    out[i * 4] = rnd() * 2 - 1;
    out[i * 4 + 1] = rnd() * 2 - 1;
    out[i * 4 + 2] = rnd();
    out[i * 4 + 3] = rnd();
  }
  return out;
}
