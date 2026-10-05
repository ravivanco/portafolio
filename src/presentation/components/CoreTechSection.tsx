import React from 'react';
import { ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { soundFx } from '../../utils/sound';
import { Award, Code2, Eye, Sparkles, Workflow } from 'lucide-react';
import { FaReact, FaNodeJs, FaLaravel, FaPython, FaHtml5, FaBootstrap, FaJava, FaEye, FaRobot } from 'react-icons/fa';
import {
  SiFlutter, SiExpo, SiAndroidstudio, SiExpress, SiSpringboot, SiJavascript, SiTailwindcss, SiTypescript,
  SiCplusplus, SiPostgresql, SiMysql, SiMongodb, SiPhpmyadmin, SiN8N, SiGoogle,
} from 'react-icons/si';
import { DenoiseText } from './DenoiseText';
import { Stage } from './Stage';
import { BRAIN_NODE_COUNT } from '../latent/formations';

const skillIcons: Record<string, React.ElementType> = {
  'React Native': FaReact,
  Flutter: SiFlutter,
  Expo: SiExpo,
  'Android Studio': SiAndroidstudio,
  'Node.js': FaNodeJs,
  Express: SiExpress,
  Laravel: FaLaravel,
  'Spring Boot': SiSpringboot,
  Python: FaPython,
  React: FaReact,
  JavaScript: SiJavascript,
  HTML5: FaHtml5,
  'Tailwind CSS': SiTailwindcss,
  Bootstrap: FaBootstrap,
  Java: FaJava,
  'JavaScript / TS': SiTypescript,
  'C#': Code2,
  'C++': SiCplusplus,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  phpMyAdmin: SiPhpmyadmin,
  'Image Recognition (Vision AI)': FaEye,
  'Recommendation Engines': FaRobot,
  'N8N Automation': SiN8N,
  'LLM / Gemini Integration': SiGoogle,
};

const AI_ICONS = [Eye, Sparkles, Workflow];

export const CoreTechSection: React.FC<{ theme: ThemeMode }> = () => {
  const { language } = useLanguage();
  const t = translations[language].ui;
  const { TECH_CATEGORIES, CERTIFICATIONS, LANGUAGES } = useResumeData();

  return (
    <section
      id="section-core-tech"
      aria-labelledby="tech-title"
      className="relative mx-auto grid max-w-[1400px] grid-cols-1 border-t border-line pt-16 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pt-28"
    >
      <div className="lg:order-2 lg:col-span-5">
        <Stage
          index={2}
          className="mx-4 h-[42svh] min-h-[280px] sm:mx-6 lg:sticky lg:top-24 lg:mx-0 lg:h-[calc(100svh-8rem)]"
          note={`mesh / ${BRAIN_NODE_COUNT} nodes`}
        />
      </div>

      <div className="px-4 pb-24 pt-10 sm:px-6 lg:order-1 lg:col-span-7 lg:px-0 lg:pt-0">
        <DenoiseText
          id="tech-title"
          text={t.tech_title}
          className="font-display text-[clamp(1.9rem,7vw,3.5rem)] font-bold uppercase leading-none tracking-[-0.03em] text-ink"
        />
        <p className="mt-4 flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-signal">
          <span className="pulse-dot h-1.5 w-1.5 bg-signal" />
          {t.tech_status}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
          {TECH_CATEGORIES.map((cat, idx) => (
            <div key={cat.title} data-reveal style={{ '--d': idx % 2 } as React.CSSProperties} className="border-t border-line py-6">
              <h3 className="text-base font-semibold text-ink">{cat.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {cat.skills.map((s) => {
                  const Icon = skillIcons[s.name] || Code2;
                  return (
                    <li
                      key={s.name}
                      onMouseEnter={() => soundFx.playHover()}
                      className="flex items-center gap-3 text-[15px] text-muted"
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-faint" aria-hidden="true" />
                      <span className={s.badge ? 'text-ink' : undefined}>{s.name}</span>
                      {s.badge && (
                        <>
                          <span aria-hidden="true" className="h-px flex-1 bg-line" />
                          <span className="text-[10px] uppercase tracking-[0.14em] text-signal">{t.advanced}</span>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div data-reveal className="relative mt-16 border border-dream/40 p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold uppercase tracking-[-0.02em] text-ink sm:text-2xl">{t.tech_ai_title}</h3>
          <p className="mt-2 text-sm text-muted">{t.tech_ai_lede}</p>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            {t.tech_ai.map((item, i) => {
              const Icon = AI_ICONS[i];
              return (
                <div key={item.title}>
                  <Icon className="h-5 w-5 text-dream" aria-hidden="true" />
                  <h4 className="mt-3 text-[15px] font-semibold text-ink">{item.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div data-reveal>
            <h3 className="text-sm font-semibold text-ink">{t.tech_languages}</h3>
            <ul className="mt-5 space-y-5">
              {LANGUAGES.map((lang) => (
                <li key={lang.name} className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                  <span className="text-[15px] font-medium text-ink">{lang.name}</span>
                  <span className="font-mono text-xs text-muted">{lang.level}</span>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal style={{ '--d': 1 } as React.CSSProperties}>
            <h3 className="text-sm font-semibold text-ink">{t.tech_certs}</h3>
            <ul className="mt-5 space-y-5">
              {CERTIFICATIONS.map((cert) => (
                <li key={cert.title} className="grid grid-cols-[20px_1fr] gap-3">
                  <Award className="mt-0.5 h-4 w-4 text-signal" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-ink">{cert.title}</p>
                    <p className="mt-0.5 font-mono text-xs text-faint">
                      {cert.issuer}
                      {cert.year ? ` · ${cert.year}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
