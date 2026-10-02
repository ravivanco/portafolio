import { bust, device, helix, neuralLattice, portal, portraitFromImage, seeds, Formation } from './formations';

// One persistent point field behind the page. Each section owns a "stage"
// element ([data-stage="i"]); the field anchors formation i to stage i and,
// as the next stage scrolls in, dissolves into noise and re-forms there.

const VERT = `
attribute vec4 aFrom;
attribute vec4 aTo;
attribute vec4 aSeed;
uniform float uMix;
uniform float uNoise;
uniform float uTime;
uniform float uDrift;
uniform float uRot;
uniform vec2 uTilt;
uniform vec2 uRes;
uniform vec4 uFromBox;
uniform vec4 uToBox;
uniform float uSize;
varying float vShade;
varying float vDream;

mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }

void main() {
  float r = aSeed.w;
  float lt = smoothstep(r * 0.35, r * 0.35 + 0.65, uMix);
  vec3 p = mix(aFrom.xyz, aTo.xyz, lt);
  float shade = mix(aFrom.w, aTo.w, lt);

  p += uDrift * 0.01 * vec3(sin(uTime * 0.7 + r * 40.0), cos(uTime * 0.6 + r * 31.0), sin(uTime * 0.5 + r * 17.0));
  p = rotY(uRot + uTilt.x) * rotX(uTilt.y) * p;

  float persp = 3.2 / (3.2 - p.z);
  vec4 box = mix(uFromBox, uToBox, lt);
  vec2 px = box.xy + vec2(p.x, -p.y) * persp * box.z;

  float n = clamp(uNoise * (0.55 + 0.9 * r), 0.0, 1.0);
  n = n * n * (3.0 - 2.0 * n);
  vec2 wander = vec2(sin(uTime * 0.31 + r * 9.0), cos(uTime * 0.27 + r * 7.0)) * 24.0 * uDrift;
  vec2 dust = (aSeed.xy * 0.5 + 0.5) * uRes + wander;
  px = mix(px, dust, n);

  vec2 ndc = px / uRes * 2.0 - 1.0;
  gl_Position = vec4(ndc.x, -ndc.y, 0.0, 1.0);
  gl_PointSize = uSize * persp * (1.0 + n * 3.2 * aSeed.z * aSeed.z * aSeed.z);
  vShade = shade;
  vDream = n;
}
`;

const FRAG = `
precision mediump float;
uniform vec3 uSignal;
uniform vec3 uDreamC;
uniform float uAlpha;
varying float vShade;
varying float vDream;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = dot(c, c);
  if (d > 0.25) discard;
  float a = smoothstep(0.25, 0.02, d);
  vec3 col = mix(uSignal, uDreamC, clamp(vDream * 1.4, 0.0, 1.0));
  gl_FragColor = vec4(col, a * uAlpha * mix(vShade, 0.5, vDream));
}
`;

export interface LatentFieldOptions {
  canvas: HTMLCanvasElement;
  portraitUrl: string;
  onStep?: (step: number) => void;
}

const INTRO_STEPS = 50;
const INTRO_MS = 2600;

export class LatentField {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private buffers: WebGLBuffer[] = [];
  private seedBuffer: WebGLBuffer;
  private loc: Record<string, number> = {};
  private uni: Record<string, WebGLUniformLocation | null> = {};
  private n: number;
  private dpr: number;
  private raf = 0;
  private start = performance.now();
  private reduced: boolean;
  private mq: MediaQueryList;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private colors = { signal: [0.24, 0.9, 1], dream: [1, 0.31, 0.85] };
  private lightTheme = false;
  private themeObserver: MutationObserver;
  private visible = true;
  private cleared = false;
  private lastStep = -1;
  private opts: LatentFieldOptions;

  static create(opts: LatentFieldOptions): LatentField | null {
    const gl = opts.canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: 'low-power' });
    if (!gl) return null;
    try {
      return new LatentField(gl, opts);
    } catch {
      return null;
    }
  }

  private constructor(gl: WebGLRenderingContext, opts: LatentFieldOptions) {
    this.gl = gl;
    this.opts = opts;
    this.mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = this.mq.matches;

    const small = window.innerWidth < 768;
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    this.n = small ? (cores <= 4 || memory <= 2 ? 3000 : 5200) : 9000;
    this.dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);

    this.program = this.link(VERT, FRAG);
    gl.useProgram(this.program);
    for (const a of ['aFrom', 'aTo', 'aSeed']) this.loc[a] = gl.getAttribLocation(this.program, a);
    for (const u of ['uMix', 'uNoise', 'uTime', 'uDrift', 'uRot', 'uTilt', 'uRes', 'uFromBox', 'uToBox', 'uSize', 'uSignal', 'uDreamC', 'uAlpha']) {
      this.uni[u] = gl.getUniformLocation(this.program, u);
    }

    const formations: Formation[] = [bust(this.n), helix(this.n), neuralLattice(this.n), device(this.n), portal(this.n)];
    this.buffers = formations.map((f) => this.upload(f));
    this.seedBuffer = this.upload(seeds(this.n));

    this.readTheme();
    this.themeObserver = new MutationObserver(() => this.readTheme());
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const p = portraitFromImage(img, this.n);
      if (p) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, p);
      }
      this.start = performance.now();
    };
    img.src = opts.portraitUrl;

    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.mq.addEventListener('change', this.onMotionPref);
    this.raf = requestAnimationFrame(this.frame);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointer);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.mq.removeEventListener('change', this.onMotionPref);
    this.themeObserver.disconnect();
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  private link(vs: string, fs: string) {
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
      return s;
    };
    const p = gl.createProgram()!;
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link');
    return p;
  }

  private upload(data: Float32Array) {
    const gl = this.gl;
    const b = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  }

  private bind(attr: string, buffer: WebGLBuffer) {
    const gl = this.gl;
    const l = this.loc[attr];
    if (l < 0) return;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(l);
    gl.vertexAttribPointer(l, 4, gl.FLOAT, false, 0, 0);
  }

  private readTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    const parse = (v: string, fallback: number[]) => {
      const parts = v.trim().split(/\s+/).map(Number);
      return parts.length === 3 && parts.every((x) => !Number.isNaN(x)) ? parts.map((x) => x / 255) : fallback;
    };
    this.colors.signal = parse(cs.getPropertyValue('--field-signal'), this.colors.signal);
    this.colors.dream = parse(cs.getPropertyValue('--field-dream'), this.colors.dream);
    this.lightTheme = document.documentElement.getAttribute('data-theme') === 'light';
  };

  private resize = () => {
    const c = this.opts.canvas;
    const w = Math.round(window.innerWidth * this.dpr);
    const h = Math.round(window.innerHeight * this.dpr);
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
  };

  private onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    this.pointer.tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
    this.pointer.ty = (e.clientY / window.innerHeight - 0.5) * 0.3;
  };

  private onVisibility = () => {
    this.visible = document.visibilityState === 'visible';
    if (this.visible) {
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(this.frame);
    }
  };

  private onMotionPref = () => {
    this.reduced = this.mq.matches;
  };

  /** Stage rect -> (cx, cy, radius) in device pixels, plus on-screen flag. */
  private box(el: Element | undefined): [number, number, number, number] {
    if (!el) return [0, 0, 0, 0];
    const r = el.getBoundingClientRect();
    const d = this.dpr;
    const radius = Math.min(r.width, r.height - 36) * 0.43;
    const onScreen = r.bottom > -40 && r.top < window.innerHeight + 40 ? 1 : 0;
    return [(r.left + r.width / 2) * d, (r.top + r.height / 2 - 14) * d, radius * d, onScreen];
  }

  private frame = (now: number) => {
    if (!this.visible) return;
    this.raf = requestAnimationFrame(this.frame);
    const gl = this.gl;
    const stages = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]')).sort(
      (a, b) => Number(a.dataset.stage) - Number(b.dataset.stage),
    );
    if (!stages.length) return;

    // Which pair of stages are we between, and how far?
    const vh = window.innerHeight;
    let from = 0;
    let to = 0;
    let t = 0;
    for (let k = 1; k < stages.length; k++) {
      const top = stages[k].getBoundingClientRect().top;
      const tk = Math.min(1, Math.max(0, (vh * 0.95 - top) / (vh * 0.7)));
      if (tk > 0) {
        from = k - 1;
        to = k;
        t = tk;
      }
    }
    if (this.reduced) t = t > 0.5 ? 1 : 0;

    const fromBox = this.box(stages[from]);
    const toBox = this.box(stages[to]);
    const idle = t === 0 || t === 1;
    const anyOnScreen = (t < 1 && fromBox[3]) || (t > 0 && toBox[3]);

    const elapsed = now - this.start;
    let intro = 0;
    if (!this.reduced && elapsed < INTRO_MS) {
      const u = elapsed / INTRO_MS;
      intro = 1 - (1 - Math.pow(1 - u, 3));
    }
    const step = Math.round(intro * INTRO_STEPS);
    if (step !== this.lastStep) {
      this.lastStep = step;
      this.opts.onStep?.(step);
    }

    if (idle && !anyOnScreen && intro === 0) {
      if (!this.cleared) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.cleared = true;
      }
      return;
    }
    this.cleared = false;

    const time = now / 1000;
    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.06;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.06;

    const noise = Math.max(intro, this.reduced ? 0 : Math.pow(Math.sin(Math.PI * t), 1.15));
    const sway = this.reduced ? -0.22 : Math.sin(time * 0.22) * 0.38;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    if (this.lightTheme) gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    else gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    gl.useProgram(this.program);
    this.bind('aFrom', this.buffers[from] ?? this.buffers[0]);
    this.bind('aTo', this.buffers[to] ?? this.buffers[0]);
    this.bind('aSeed', this.seedBuffer);

    gl.uniform1f(this.uni.uMix, t);
    gl.uniform1f(this.uni.uNoise, noise);
    gl.uniform1f(this.uni.uTime, this.reduced ? 0 : time);
    gl.uniform1f(this.uni.uDrift, this.reduced ? 0 : 1);
    gl.uniform1f(this.uni.uRot, sway);
    gl.uniform2f(this.uni.uTilt, this.reduced ? 0 : this.pointer.x, this.reduced ? 0.08 : this.pointer.y + 0.08);
    gl.uniform2f(this.uni.uRes, gl.canvas.width, gl.canvas.height);
    gl.uniform4f(this.uni.uFromBox, fromBox[0], fromBox[1], fromBox[2], 0);
    gl.uniform4f(this.uni.uToBox, toBox[0], toBox[1], toBox[2], 0);
    gl.uniform1f(this.uni.uSize, (window.innerWidth < 768 ? 2.1 : 2.4) * this.dpr);
    gl.uniform3fv(this.uni.uSignal, this.colors.signal);
    gl.uniform3fv(this.uni.uDreamC, this.colors.dream);
    gl.uniform1f(this.uni.uAlpha, this.lightTheme ? 0.85 : 0.9);

    gl.drawArrays(gl.POINTS, 0, this.n);
  };
}
