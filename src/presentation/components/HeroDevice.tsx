import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useLatent';
import { canRun3D } from '../three/capability';
import stillDark from '../../images/hero-device-dark.webp';
import stillLight from '../../images/hero-device-light.webp';

const HeroDeviceScene = lazy(() => import('../three/HeroDeviceScene'));

type BoundaryProps = { onError: () => void; children: React.ReactNode };

/** A WebGL or chunk-load failure drops back to the still instead of breaking the hero. */
class SceneBoundary extends React.Component<BoundaryProps, { failed: boolean }> {
  declare readonly props: BoundaryProps;
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Hero 3D device. Capable devices get the live React Three Fiber scene, loaded
 * once the browser is idle; reduced motion, low-end hardware, data saver, a
 * WebGL error or a slow first second all keep the pre-rendered still.
 */
export const HeroDevice: React.FC<{ className?: string }> = ({ className = '' }) => {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [wantLive, setWantLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  const live = wantLive && !reduced && !failed;

  useEffect(() => {
    if (reduced || failed || !canRun3D()) return;
    // Wait for idle so three.js never competes with first paint or the portrait intro.
    const w = window as IdleWindow;
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setWantLive(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setWantLive(true), 1200);
    return () => window.clearTimeout(id);
  }, [reduced, failed]);

  // Stop rendering when the hero scrolls away.
  useEffect(() => {
    const el = ref.current;
    if (!el || !live) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: '80px' });
    io.observe(el);
    return () => io.disconnect();
  }, [live]);

  useEffect(() => {
    if (!live) setReady(false);
  }, [live]);

  const fail = useCallback(() => setFailed(true), []);
  const markReady = useCallback(() => setReady(true), []);

  const stillClass = `absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
    live && ready ? 'opacity-0' : 'opacity-100'
  }`;

  return (
    <div ref={ref} data-device3d className={`pointer-events-none ${className}`}>
      <img src={stillDark} alt="" width={480} height={640} decoding="async" className={`${stillClass} hidden dark:block`} />
      <img src={stillLight} alt="" width={480} height={640} decoding="async" className={`${stillClass} dark:hidden`} />
      {live && (
        <SceneBoundary onError={fail}>
          <Suspense fallback={null}>
            <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}>
              <HeroDeviceScene active={onScreen} onFail={fail} onReady={markReady} />
            </div>
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  );
};
