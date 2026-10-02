// Point formations for the latent field. Every formation is N points packed as
// vec4 (x, y, z, shade), normalized so the shape fits a unit radius (y in [-1, 1]).

export type Formation = Float32Array;

export const FORMATION_NAMES = ['portrait', 'helix', 'neural_lattice', 'device', 'portal'] as const;
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

/** Core tech: a four-layer neural network drawn as nodes and weighted edges. */
export function neuralLattice(n: number): Formation {
  const out = new Float32Array(n * 4);
  const rnd = mulberry32(23);
  const layerX = [-0.92, -0.31, 0.31, 0.92];
  const counts = [5, 8, 8, 3];
  const nodes: [number, number, number][][] = layerX.map((x, li) => {
    const c = counts[li];
    return Array.from({ length: c }, (_, j) => {
      const y = c === 1 ? 0 : ((j / (c - 1)) * 2 - 1) * (0.25 + c * 0.08);
      const z = Math.sin(j * 1.7 + li) * 0.18;
      return [x, y, z];
    });
  });
  for (let i = 0; i < n; i++) {
    if (rnd() < 0.26) {
      const L = nodes[Math.floor(rnd() * nodes.length)];
      const [x, y, z] = L[Math.floor(rnd() * L.length)];
      put(out, i, x + gauss(rnd) * 0.03, y + gauss(rnd) * 0.03, z + gauss(rnd) * 0.03, 1);
    } else {
      const li = Math.floor(rnd() * (nodes.length - 1));
      const a = nodes[li][Math.floor(rnd() * nodes[li].length)];
      const b = nodes[li + 1][Math.floor(rnd() * nodes[li + 1].length)];
      const t = rnd();
      put(
        out, i,
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t + gauss(rnd) * 0.004,
        a[2] + (b[2] - a[2]) * t,
        0.42 + 0.22 * Math.sin(t * Math.PI),
      );
    }
  }
  return out;
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
