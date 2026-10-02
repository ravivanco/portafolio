type CapableNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

let cached: boolean | undefined;

/**
 * Whether this device should get the live 3D scene instead of the still.
 * Reduced motion is checked by the caller because it can change at runtime;
 * this covers hardware and data-saver, which can't.
 */
export const canRun3D = (): boolean => {
  if (cached !== undefined) return cached;
  const nav = navigator as CapableNavigator;
  cached = (() => {
    if (nav.connection?.saveData) return false;
    if ((nav.hardwareConcurrency ?? 4) < 4) return false;
    // Chromium only; Safari leaves it undefined and is judged on cores + WebGL2.
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return false;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    } catch {
      return false;
    }
  })();
  return cached;
};
