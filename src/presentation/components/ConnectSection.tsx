import React, { useState } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import { soundFx } from '../../utils/sound';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { AlertTriangle, Check, CheckCircle, ChevronDown, Copy, Github, Instagram, Linkedin, Loader2, MapPin, Phone, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DenoiseText } from './DenoiseText';
import { Stage } from './Stage';

const TECH_BASE = ['React Native', 'Flutter', 'Node.js', 'Python / AI', 'React / Next.js'];

const fieldCls =
  'w-full border border-line bg-ground px-4 py-3 text-[15px] text-ink placeholder:text-faint transition-colors duration-200 focus:border-signal focus:outline-none';
const labelCls = 'mb-2 block text-sm font-medium text-muted';

export const ConnectSection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language];
  const c = t.connect;
  const { PERSONAL_INFO } = useResumeData();

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const TECH_OPTIONS = [...TECH_BASE, t.ui.tech_other];

  const handleCopyEmail = async () => {
    soundFx.playClick();
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) => (prev.includes(tech) ? prev.filter((x) => x !== tech) : [...prev, tech]));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundFx.playTransmit();
    setIsSubmitting(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
    formData.append('Technologies', selectedTechs.join(', '));
    formData.append('_captcha', 'false'); // keep the custom UI flow

    try {
      const response = await fetch('https://formsubmit.co/ajax/rvivanco199@gmail.com', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        setIsSuccess(true);
        setSelectedTechs([]);
        soundFx.playClick();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    { href: PERSONAL_INFO.github, label: 'GitHub', Icon: Github },
    { href: PERSONAL_INFO.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: PERSONAL_INFO.instagram, label: 'Instagram', Icon: Instagram },
  ];

  return (
    <section
      id="section-connect"
      aria-labelledby="connect-title"
      className="relative mx-auto max-w-[1400px] border-t border-line pb-28 pt-16 lg:px-8 lg:pb-32 lg:pt-28"
    >
      <Stage index={4} className="mx-4 h-[40svh] min-h-[260px] sm:mx-6 lg:mx-auto lg:h-[52svh] lg:max-w-3xl" />

      <div className="mx-auto max-w-3xl px-4 pt-10 text-center sm:px-6">
        <DenoiseText
          id="connect-title"
          text={`${c.title} ${c.subtitle}`}
          className="font-display text-[clamp(1.9rem,7vw,3.5rem)] font-bold uppercase leading-none tracking-[-0.03em] text-ink"
        />
        <p className="mx-auto mt-4 max-w-[56ch] text-[15px] leading-relaxed text-muted">{c.description}</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-0">
        <aside data-reveal className="lg:col-span-4">
          <h3 className="text-sm font-semibold text-ink">{c.direct_info}</h3>
          <dl className="mt-5 divide-y divide-line border-y border-line">
            <div className="flex items-center justify-between gap-3 py-4">
              <div className="min-w-0">
                <dt className="text-xs font-medium text-faint">{c.email}</dt>
                <dd className="mt-1 truncate">
                  <a href={`mailto:${PERSONAL_INFO.email}`} className="text-[15px] font-medium text-ink no-underline hover:text-signal">
                    {PERSONAL_INFO.email}
                  </a>
                </dd>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label={c.copy_email}
                className="flex h-10 shrink-0 items-center gap-1.5 border border-line px-3 font-mono text-[11px] text-muted transition-colors duration-200 hover:border-signal hover:text-signal"
              >
                {copied ? <Check className="resolve-in h-3.5 w-3.5 text-ok" /> : <Copy className="h-3.5 w-3.5" />}
                <span aria-live="polite" className={copied ? 'resolve-in' : undefined}>{copied ? t.ui.copied : ''}</span>
              </button>
            </div>
            <div className="py-4">
              <dt className="text-xs font-medium text-faint">{c.phone}</dt>
              <dd className="mt-1 flex items-center gap-2 text-[15px] text-ink">
                <Phone className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
                <a href={`tel:${PERSONAL_INFO.phone.replace(/[^\d+]/g, '')}`} className="no-underline hover:text-signal">
                  {PERSONAL_INFO.phone}
                </a>
              </dd>
            </div>
            <div className="py-4">
              <dt className="text-xs font-medium text-faint">{c.location}</dt>
              <dd className="mt-1 flex items-center gap-2 text-[15px] text-ink">
                <MapPin className="h-3.5 w-3.5 text-signal" aria-hidden="true" />
                {PERSONAL_INFO.location}
              </dd>
            </div>
          </dl>

          <h3 className="mt-10 text-sm font-semibold text-ink">{c.socials}</h3>
          <ul className="mt-4 grid grid-cols-3 gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-16 flex-col items-center justify-center gap-1.5 border border-line text-xs font-medium text-muted no-underline transition-colors duration-200 hover:border-line-strong hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div data-reveal style={{ '--d': 1 } as React.CSSProperties} className="lg:col-span-8">
          <div className="border border-line-strong bg-surface p-5 sm:p-8">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="py-10 text-center"
                  role="status"
                >
                  <CheckCircle className="mx-auto h-10 w-10 text-ok" aria-hidden="true" />
                  <h3 className="mt-6 font-display text-xl font-bold uppercase tracking-[-0.02em] text-ink">{c.success_title}</h3>
                  <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
                    {c.success_desc} <strong className="text-ink">{PERSONAL_INFO.shortName}</strong>. {c.success_thanks}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-sm font-semibold text-signal underline"
                  >
                    {c.send_another}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="form" exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.3 }}>
                  <h3 className="text-lg font-semibold text-ink">{c.form_title}</h3>
                  <p className="mt-1 text-sm text-muted">{c.form_desc}</p>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="f-name" className={labelCls}>{c.name_label}</label>
                        <input id="f-name" type="text" name="Name" required autoComplete="name" placeholder={c.name_placeholder} className={fieldCls} />
                      </div>
                      <div>
                        <label htmlFor="f-email" className={labelCls}>{c.email_label}</label>
                        <input id="f-email" type="email" name="Email" required autoComplete="email" inputMode="email" placeholder={c.email_placeholder} className={fieldCls} />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="f-company" className={labelCls}>{c.company_label}</label>
                      <input id="f-company" type="text" name="Company" autoComplete="organization" placeholder={c.company_placeholder} className={fieldCls} />
                    </div>

                    <div>
                      <label htmlFor="f-type" className={labelCls}>{c.type_label}</label>
                      <div className="relative">
                      <select id="f-type" name="Proposal Type" className={`${fieldCls} appearance-none pr-10`}>
                        <option value="fulltime">{c.type_fulltime}</option>
                        <option value="freelance">{c.type_freelance}</option>
                        <option value="mobile">{c.type_mobile}</option>
                        <option value="ai">{c.type_ai}</option>
                        <option value="other">{c.type_other}</option>
                      </select>
                      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                      </div>
                    </div>

                    <fieldset>
                      <legend className={labelCls}>{c.tech_label}</legend>
                      <div className="flex flex-wrap gap-2">
                        {TECH_OPTIONS.map((tech) => {
                          const on = selectedTechs.includes(tech);
                          return (
                            <button
                              key={tech}
                              type="button"
                              aria-pressed={on}
                              onClick={() => {
                                soundFx.playClick();
                                toggleTech(tech);
                              }}
                              className={`h-10 border px-3 text-sm transition-colors duration-200 ${
                                on ? 'border-signal bg-signal text-signal-ink' : 'border-line text-muted hover:border-line-strong hover:text-ink'
                              }`}
                            >
                              {tech}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div>
                      <label htmlFor="f-details" className={labelCls}>{c.details_label}</label>
                      <textarea id="f-details" name="Details" required rows={5} placeholder={c.details_placeholder} className={`${fieldCls} resize-y`} />
                    </div>

                    {error && (
                      <p role="alert" className="resolve-in flex items-start gap-2 border border-danger/50 p-3 text-sm text-ink">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                        <span>
                          {t.ui.form_error}{' '}
                          <a href={`mailto:${PERSONAL_INFO.email}`} className="text-signal">
                            {PERSONAL_INFO.email}
                          </a>
                        </span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex h-14 w-full items-center justify-center gap-2 bg-signal text-[15px] font-semibold text-signal-ink transition-opacity duration-200 hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span>{c.submitting}</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" aria-hidden="true" />
                          <span>{c.submit_btn}</span>
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
