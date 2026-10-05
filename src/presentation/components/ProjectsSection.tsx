import React, { useEffect, useRef, useState } from 'react';
import { Project, ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { AiFoodScanner } from './AiFoodScanner';
import { soundFx } from '../../utils/sound';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { ArrowUpRight, CheckCircle, ExternalLink, Github, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DenoiseText } from './DenoiseText';
import { Stage } from './Stage';

type Filter = 'all' | 'mobile' | 'ai' | 'fullstack';

/** A project surfacing out of latent space; tilts toward a fine pointer. */
const Shard: React.FC<{ project: Project; index: number; feature?: boolean; stagger?: boolean; onOpen: () => void }> = ({
  project,
  index,
  feature = false,
  stagger = false,
  onOpen,
}) => {
  const flip = !feature && index % 2 === 1;
  const { language } = useLanguage();
  const t = translations[language];
  const frame = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !frame.current) return;
    const r = frame.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    frame.current.style.setProperty('--ry', `${x * 7}deg`);
    frame.current.style.setProperty('--rx', `${-y * 6}deg`);
  };
  const onLeave = () => {
    frame.current?.style.setProperty('--ry', '0deg');
    frame.current?.style.setProperty('--rx', '0deg');
  };

  return (
    <article
      data-reveal="shard"
      style={stagger ? ({ '--d': Math.min(index, 3) } as React.CSSProperties) : undefined}
      className={`border-t border-line pt-6 ${feature ? '' : 'md:grid md:grid-cols-12 md:items-start md:gap-8'}`}
    >
      <div className={feature ? '' : `md:col-span-5 ${flip ? 'md:order-2' : ''}`}>
      <div ref={frame} onPointerMove={onMove} onPointerLeave={onLeave} className="shard-frame relative">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${t.ui.project_open}: ${project.title}`}
          className="group block w-full overflow-hidden border border-line bg-ground"
        >
          <img
            src={project.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="aspect-[16/9] w-full object-cover object-top opacity-90 transition-[opacity,transform] duration-700 ease-out-expo group-hover:scale-[1.02] group-hover:opacity-100"
          />
        </button>
        {project.hasAiDemo && (
          <span className="absolute left-3 top-3 bg-signal px-2 py-1 text-xs font-semibold text-signal-ink">
            {t.ui.project_featured}
          </span>
        )}
      </div>
      </div>

      <div className={feature ? '' : `md:col-span-7 ${flip ? 'md:order-1' : ''}`}>
      <div className={`mt-5 flex items-baseline justify-between gap-4 ${feature ? '' : 'md:mt-0'}`}>
        <h3 className={`font-display font-bold uppercase tracking-[-0.02em] text-ink ${feature ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>{project.title}</h3>
        <span className="tabular shrink-0 font-mono text-xs text-faint">{project.date}</span>
      </div>
      <p className="mt-1.5 text-sm text-signal">{project.subtitle}</p>
      <ul className="mt-4 max-w-[65ch] space-y-2 text-[15px] leading-relaxed text-muted">
        {project.bullets.slice(0, 2).map((b, i) => (
          <li key={i} className="grid grid-cols-[14px_1fr]">
            <span aria-hidden="true" className="mt-[0.7em] h-px w-2 bg-signal" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-mono text-xs leading-relaxed text-faint">{project.techStack.join('  /  ')}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          id={`project-details-${project.id}`}
          type="button"
          onClick={onOpen}
          className="group inline-flex h-10 items-center gap-2 border border-line-strong px-3 text-sm font-semibold text-ink transition-colors duration-200 hover:border-signal hover:text-signal"
        >
          {t.ui.project_open}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
        {project.githubUrl && (
          <a
            id={`project-github-${project.id}`}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 px-3 text-sm text-muted no-underline transition-colors duration-200 hover:text-ink"
          >
            <Github className="h-3.5 w-3.5" />
            {t.general.view_code}
          </a>
        )}
      </div>
      </div>
    </article>
  );
};

export const ProjectsSection: React.FC<{ theme: ThemeMode }> = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const { PROJECTS } = useResumeData();
  const [filter, setFilter] = useState<Filter>('all');
  // After the first filter change, shards re-surface as one staggered list instead of one by one on scroll.
  const [resampled, setResampled] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const filtered = PROJECTS.filter((p) => filter === 'all' || p.category === filter);

  useEffect(() => {
    if (!selected) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: t.projects.filters.all },
    { id: 'mobile', label: t.projects.filters.mobile },
    { id: 'ai', label: t.projects.filters.ai },
    { id: 'fullstack', label: t.projects.filters.fullstack },
  ];

  return (
    <section
      id="section-projects"
      aria-labelledby="projects-title"
      className="relative mx-auto grid max-w-[1400px] grid-cols-1 border-t border-line pt-16 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pt-28"
    >
      <div className="lg:col-span-4">
        <Stage index={3} className="mx-4 h-[46svh] min-h-[320px] sm:mx-6 lg:sticky lg:top-24 lg:mx-0 lg:h-[calc(100svh-8rem)]" />
      </div>

      <div className="px-4 pb-24 pt-10 sm:px-6 lg:col-span-8 lg:px-0 lg:pt-0">
        <DenoiseText
          id="projects-title"
          text={t.ui.projects_title}
          className="font-display text-[clamp(1.9rem,7vw,3.5rem)] font-bold uppercase leading-none tracking-[-0.03em] text-ink"
        />
        <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-muted">{t.projects.description}</p>

        <div data-reveal className="mt-10">
          <AiFoodScanner />
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Filter" className="-mx-4 flex overflow-x-auto px-4 text-sm font-medium sm:mx-0 sm:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`project-filter-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={filter === tab.id}
                onClick={() => {
                  if (tab.id === filter) return;
                  soundFx.playClick();
                  setResampled(true);
                  setFilter(tab.id);
                }}
                className={`relative h-10 shrink-0 whitespace-nowrap border-b border-line px-3 transition-colors duration-200 ${
                  filter === tab.id ? 'text-signal' : 'text-muted hover:text-ink'
                }`}
              >
                {tab.label}
                {filter === tab.id && (
                  <motion.span
                    layoutId="project-filter-bar"
                    aria-hidden="true"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 -bottom-px h-px bg-signal"
                  />
                )}
              </button>
            ))}
          </div>
          <p className="tabular font-mono text-[11px] text-faint">
            {t.projects.showing.replace('{count}', String(filtered.length))}
          </p>
        </div>

        {/* A filter change dissolves the old list, then the new one surfaces through the shard reveal. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
            className="mt-8 space-y-14"
          >
            {filtered.map((project, idx) => (
              <Shard
                key={project.id}
                project={project}
                index={idx}
                feature={!!project.hasAiDemo}
                stagger={resampled}
                onOpen={() => {
                  soundFx.playClick();
                  setSelected(project);
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            key="project-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-ground/85 sm:items-center sm:p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 16, filter: 'blur(6px)', transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92svh] w-full max-w-2xl overflow-y-auto border border-line-strong bg-surface"
            >
              <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-surface p-5">
                <div>
                  <h2 id="project-modal-title" className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-ink">
                    {selected.title}
                  </h2>
                  <p className="mt-1 text-sm text-signal">{selected.subtitle}</p>
                  <p className="tabular mt-1 font-mono text-xs text-faint">{selected.date}</p>
                </div>
                <button
                  ref={closeRef}
                  id="close-project-modal-btn"
                  type="button"
                  aria-label={t.general.close}
                  onClick={() => setSelected(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-muted hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-6 p-5 text-[15px] leading-relaxed">
                <img src={selected.imageUrl} alt="" referrerPolicy="no-referrer" className="aspect-[16/9] w-full border border-line object-cover object-top" />
                <div>
                  <h3 className="font-mono text-[11px] tracking-[0.14em] text-faint">{t.projects.modal.description}</h3>
                  <p className="mt-2 text-muted">{selected.description}</p>
                </div>
                <div>
                  <h3 className="font-mono text-[11px] tracking-[0.14em] text-faint">{t.projects.modal.features}</h3>
                  <ul className="mt-3 space-y-2.5">
                    {selected.bullets.map((b, i) => (
                      <li key={i} className="grid grid-cols-[22px_1fr] text-muted">
                        <CheckCircle className="mt-1 h-4 w-4 text-ok" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-mono text-[11px] tracking-[0.14em] text-faint">{t.projects.modal.tech}</h3>
                  <p className="mt-2 font-mono text-sm text-ink">{selected.techStack.join('  /  ')}</p>
                </div>
              </div>

              {(selected.githubUrl || selected.demoUrl) && (
                <div className="flex flex-col gap-2 border-t border-line p-5 text-sm sm:flex-row">
                  {selected.githubUrl && (
                    <a
                      id="modal-project-github-btn"
                      href={selected.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 bg-signal text-sm font-semibold text-signal-ink no-underline hover:opacity-85"
                    >
                      <Github className="h-4 w-4" />
                      {t.general.view_code}
                    </a>
                  )}
                  {selected.demoUrl && (
                    <a
                      href={selected.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 border border-line-strong text-ink no-underline hover:border-signal hover:text-signal"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t.general.view_project}
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
