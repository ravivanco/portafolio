import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../hooks/useLatent';

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+<>/\\=_';

interface DenoiseTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  id?: string;
  /** ms for the whole string to resolve */
  duration?: number;
}

/**
 * Text that resolves out of glyph noise when it enters view, like a sampler
 * stepping from t=1 to t=0. Screen readers always get the real text.
 */
export const DenoiseText: React.FC<DenoiseTextProps> = ({ text, as = 'h2', className, id, duration = 900 }) => {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    setShown(text);
    started.current = false;
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let raf = 0;
    const run = () => {
      const t0 = performance.now();
      const chars = [...text];
      const tick = (now: number) => {
        const u = Math.min(1, (now - t0) / duration);
        const out = chars
          .map((c, i) => {
            if (c === ' ') return ' ';
            const threshold = (i / chars.length) * 0.7;
            return u >= threshold + 0.3 * Math.random() ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          })
          .join('');
        setShown(u >= 1 ? text : out);
        if (u < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, duration]);

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </Tag>
  );
};
