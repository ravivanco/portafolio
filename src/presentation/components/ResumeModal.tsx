import React, { useEffect, useRef } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import { soundFx } from '../../utils/sound';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Printer, X, Mail, Phone, MapPin, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COPY = {
  es: {
    profile: 'PERFIL PROFESIONAL', experience: 'EXPERIENCIA PROFESIONAL', projects: 'PROYECTOS DESTACADOS',
    skills: 'HABILIDADES TÉCNICAS', certs: 'CERTIFICACIONES E IDIOMAS', print: 'IMPRIMIR / PDF', close: 'CERRAR VISOR',
    langs: 'Español: Nativo · Inglés: Nivel B1',
  },
  en: {
    profile: 'PROFESSIONAL PROFILE', experience: 'PROFESSIONAL EXPERIENCE', projects: 'FEATURED PROJECTS',
    skills: 'TECHNICAL SKILLS', certs: 'CERTIFICATIONS AND LANGUAGES', print: 'PRINT / PDF', close: 'CLOSE VIEWER',
    langs: 'Spanish: Native · English: Level B1',
  },
};

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="border-b border-line pb-1.5 font-mono text-[11px] font-semibold tracking-[0.16em] text-signal">{children}</h2>
);

export const ResumeModal: React.FC<ResumeModalProps> = ({ onClose, isOpen }) => {
  const { language } = useLanguage();
  const k = COPY[language];
  const { PERSONAL_INFO, EXPERIENCES, PROJECTS, TECH_CATEGORIES, CERTIFICATIONS } = useResumeData();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="resume"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-ground/85 sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`CV ${PERSONAL_INFO.fullName}`}
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[94svh] w-full max-w-4xl flex-col border border-line-strong bg-surface"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2 font-mono text-xs">
              <div className="flex min-w-0 items-center gap-2 text-signal">
                <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate font-semibold">CURRICULUM VITAE // {PERSONAL_INFO.fullName}</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  id="print-resume-btn"
                  type="button"
                  onClick={handlePrint}
                  className="flex h-10 items-center gap-2 border border-line px-3 text-muted hover:border-signal hover:text-signal"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{k.print}</span>
                </button>
                <button
                  ref={closeRef}
                  id="close-resume-btn"
                  type="button"
                  aria-label={k.close}
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center border border-line text-muted hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div id="printable-cv" className="space-y-8 p-5 text-sm leading-relaxed sm:p-10">
                <header className="space-y-3 border-b border-line pb-6">
                  <h1 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-ink sm:text-3xl">{PERSONAL_INFO.fullName}</h1>
                  <p className="font-medium text-muted">
                    {PERSONAL_INFO.title} · {PERSONAL_INFO.degree}
                  </p>
                  <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted">
                    <li className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-signal" aria-hidden="true" />{PERSONAL_INFO.location}</li>
                    <li className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-signal" aria-hidden="true" />{PERSONAL_INFO.phone}</li>
                    <li className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-signal" aria-hidden="true" />{PERSONAL_INFO.email}</li>
                    <li className="flex items-center gap-1.5"><Github className="h-3.5 w-3.5 text-signal" aria-hidden="true" />github.com/{PERSONAL_INFO.githubUsername}</li>
                  </ul>
                </header>

                <section className="space-y-2">
                  <H2>{k.profile}</H2>
                  <p className="text-muted">{PERSONAL_INFO.bio}</p>
                </section>

                <section className="space-y-4">
                  <H2>{k.experience}</H2>
                  {EXPERIENCES.map((exp) => (
                    <div key={exp.id} className="space-y-1.5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 font-mono text-xs font-semibold">
                        <span className="text-ink">
                          {exp.role} — <span className="text-signal">{exp.company}</span>
                        </span>
                        <span className="text-faint">{exp.period}</span>
                      </div>
                      <ul className="space-y-1 text-muted">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="grid grid-cols-[14px_1fr]">
                            <span aria-hidden="true" className="mt-[0.7em] h-px w-2 bg-signal" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>

                <section className="space-y-4">
                  <H2>{k.projects}</H2>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                    {PROJECTS.map((p) => (
                      <div key={p.id} className="space-y-1">
                        <div className="flex justify-between gap-3 font-mono text-xs font-semibold">
                          <span className="text-ink">{p.title}</span>
                          <span className="text-faint">{p.date}</span>
                        </div>
                        <p className="text-xs text-muted">{p.subtitle}</p>
                        <p className="font-mono text-[11px] text-faint">Stack: {p.techStack.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <section className="space-y-2">
                    <H2>{k.skills}</H2>
                    <ul className="space-y-1 font-mono text-xs text-muted">
                      {TECH_CATEGORIES.map((cat) => (
                        <li key={cat.title}>
                          <span className="font-semibold text-ink">{cat.title}:</span> {cat.skills.map((s) => s.name).join(', ')}
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section className="space-y-2">
                    <H2>{k.certs}</H2>
                    <ul className="space-y-1 font-mono text-xs text-muted">
                      {CERTIFICATIONS.map((c) => (
                        <li key={c.title}>
                          {c.title} — <span className="text-faint">{c.issuer}</span>
                        </li>
                      ))}
                      <li className="pt-2 text-ink">{k.langs}</li>
                    </ul>
                  </section>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-line p-3">
              <button
                id="cv-modal-close-btn"
                type="button"
                onClick={onClose}
                className="h-10 bg-signal px-5 text-sm font-semibold text-signal-ink hover:opacity-85"
              >
                {k.close}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
