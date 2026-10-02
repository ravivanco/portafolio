import { useEffect, useState } from 'react';
import { NavSection } from '../../core/domain/entities/types';

export const SECTION_ORDER: NavSection[] = ['mission', 'path', 'core_tech', 'projects', 'connect'];

export const sectionDomId = (s: NavSection) => `section-${s.replace('_', '-')}`;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const scrollToSection = (s: NavSection) => {
  const el = document.getElementById(sectionDomId(s));
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
};

export const useReducedMotion = () => {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
};

/** Tracks which section owns the middle of the viewport. */
export const useActiveSection = () => {
  const [active, setActive] = useState<NavSection>('mission');
  useEffect(() => {
    const els = SECTION_ORDER.map((s) => document.getElementById(sectionDomId(s))).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = SECTION_ORDER.find((s) => sectionDomId(s) === e.target.id);
            if (id) setActive(id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return active;
};

/** Adds .is-in to every [data-reveal] once it enters view. Re-scans on content changes. */
export const useRevealObserver = (deps: unknown[] = []) => {
  useEffect(() => {
    document.documentElement.classList.add('js-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    const scan = () =>
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
