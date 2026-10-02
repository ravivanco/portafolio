import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useResumeData } from '../hooks/useResumeData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { DenoiseText } from './DenoiseText';
import { Stage } from './Stage';
import fotoPerfil from '../../images/fotoPerfil.webp';

/** Profile, education and the career timeline, beside the helix. */
export const PathSection: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].ui;
  const { PERSONAL_INFO, EXPERIENCES } = useResumeData();


  return (
    <section
      id="section-path"
      aria-labelledby="path-title"
      className="relative mx-auto grid max-w-[1400px] grid-cols-1 border-t border-line pt-16 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pt-28"
    >
      <div className="lg:col-span-5">
        <Stage index={1} className="mx-4 h-[42svh] min-h-[280px] sm:mx-6 lg:sticky lg:top-24 lg:mx-0 lg:h-[calc(100svh-8rem)]" />
      </div>

      <div className="px-4 pb-24 pt-10 sm:px-6 lg:col-span-7 lg:px-0 lg:pt-0">
        <DenoiseText
          id="path-title"
          text={t.path_title}
          className="font-display text-[clamp(1.9rem,7vw,3.5rem)] font-bold uppercase leading-none tracking-[-0.03em] text-ink"
        />

        <div data-reveal className="mt-10 grid grid-cols-[72px_1fr] gap-5 sm:grid-cols-[96px_1fr]">
          <img
            src={fotoPerfil}
            alt={t.portrait_alt}
            width={96}
            height={128}
            loading="lazy"
            className="aspect-[3/4] w-full object-cover object-top grayscale-[35%]"
          />
          <div>
            <h3 className="text-sm font-semibold text-signal">{t.path_profile}</h3>
            <p className="mt-2 max-w-[65ch] text-[15px] leading-relaxed text-muted sm:text-base">{PERSONAL_INFO.bio}</p>
          </div>
        </div>

        <div data-reveal className="mt-10 flex items-start gap-4 border-y border-line py-5">
          <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-signal" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-muted">{t.path_education}</h3>
            <p className="mt-1 text-base font-medium text-ink">{PERSONAL_INFO.degree}</p>
          </div>
          <span className="ml-auto shrink-0 border border-ok px-2 py-1 text-xs font-medium text-ok">
            {t.path_status}
          </span>
        </div>


        <ol className="relative mt-14 space-y-12 border-l border-line pl-6 sm:pl-8">
          {EXPERIENCES.map((exp, idx) => (
            <li key={exp.id} data-reveal style={{ '--d': idx } as React.CSSProperties} className="relative">
              <span aria-hidden="true" className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 border border-signal bg-ground sm:-left-[37px]" />
              <p className="tabular font-mono text-xs tracking-[0.12em] text-faint">
                {exp.period} · {exp.location}
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-snug text-ink sm:text-2xl">{exp.role}</h3>
              <p className="mt-1 font-mono text-sm">
                <span className="text-signal">{exp.company}</span>
                <span className="text-faint"> / {exp.type}</span>
              </p>
              <ul className="mt-4 max-w-[65ch] space-y-2.5 text-[15px] leading-relaxed text-muted">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="grid grid-cols-[14px_1fr]">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-2 bg-signal" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-mono text-xs leading-relaxed text-faint">
                {exp.techUsed.join('  /  ')}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
