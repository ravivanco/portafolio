import React, { useEffect, useRef } from 'react';
import { LatentField } from '../latent/LatentField';
import portraitSample from '../../images/portrait-sample.png';

interface LatentCanvasProps {
  onUnsupported: () => void;
}

/** Fixed, full-viewport canvas for the latent field. Emits `latent:step` events during the intro. */
export const LatentCanvas: React.FC<LatentCanvasProps> = ({ onUnsupported }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let field: LatentField | null = null;
    // Let the first paint land before compiling shaders and sampling the portrait.
    const id = window.setTimeout(() => {
      field = LatentField.create({
        canvas,
        portraitUrl: portraitSample,
        onStep: (step) => window.dispatchEvent(new CustomEvent('latent:step', { detail: step })),
      });
      if (!field) onUnsupported();
    }, 60);
    return () => {
      window.clearTimeout(id);
      field?.destroy();
    };
  }, [onUnsupported]);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 z-0 h-full w-full pointer-events-none" />;
};
