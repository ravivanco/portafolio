import React, { useEffect, useState } from 'react';
import { ArrowDownRight, FileText, Github, Linkedin } from 'lucide-react';
import { useResumeData } from '../hooks/useResumeData';
import { useGithubStats } from '../hooks/useGithubStats';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { soundFx } from '../../utils/sound';
import { prefersReducedMotion, scrollToSection } from '../hooks/useLatent';
import { Stage } from './Stage';
import { HeroDevice } from './HeroDevice';
import fotoPerfil from '../../images/fotoPerfil.webp';

interface MissionSectionProps {
  fieldOk: boolean;
  onOpenResume: () => void;
}

/** `*word*` in the lede marks the three disciplines; they render in ink. */
const Lede: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split(/\*(.+?)\*/).map((part, i) =>
      i % 2 ? (
        <strong key={i} className="whitespace-nowrap font-semibold text-ink">
          {part}
        </strong>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </>
);

const iconAction =
  'inline-flex h-12 w-12 shrink-0 items-center justify-center border border-line-strong text-muted no-underline transition-colors duration-200 hover:border-signal hover:text-signal active:translate-y-px';

/** Hero: Richard, generated out of noise. */
export const MissionSection: React.FC<MissionSectionProps> = ({ fieldOk, onOpenResume }) => {
  const { language } = useLanguage();
  const t = translations[language].ui;
  const { PERSONAL_INFO } = useResumeData();
  const [step, setStep] = useState(() => (fieldOk && !prefersReducedMotion() ? 50 : 0));

  const live = useGithubStats(PERSONAL_INFO.githubUsername, {
    projects: Number(PERSONAL_INFO.stats.repos.replace(/\D/g, '') || 0),
    followers: Number(PERSONAL_INFO.stats.followers.replace(/\D/g, '') || 0),
  });

  useEffect(() => {
    const on = (e: Event) => setStep((e as CustomEvent<number>).detail);
    window.addEventListener('latent:step', on);
    return () => window.removeEventListener('latent:step', on);
  }, []);

  useEffect(() => {
    if (!fieldOk) setStep(0);
  }, [fieldOk]);

  const [first, ...rest] = PERSONAL_INFO.shortName.split(' ');

  return (
    <section
      id="section-mission"
      aria-labelledby="hero-name"
      className="relative mx-auto flex min-h-[calc(100svh-8rem)] max-w-[1400px] flex-col lg:grid lg:min-h-[calc(100svh-4rem)] lg:grid-cols-12 lg:gap-10 lg:px-8"
    >
      {/* Phones: the portrait and device take whatever height the copy leaves, so the CTAs stay above the dock. */}
      <Stage
        index={0}
        className="order-1 min-h-[150px] flex-1 lg:order-2 lg:col-span-5 lg:col-start-8 lg:my-10 lg:min-h-0"
        anchorClassName="inset-y-0 left-0 w-[60%] lg:w-full"
        label={PERSONAL_INFO.location}
        note={
          <span className="tabular">
            {step > 0 ? `${t.step} ${String(step).padStart(2, '0')}/50` : `${live.projects} ${t.live_repos}`}
          </span>
        }
      >
        {!fieldOk && (
          <img
            src={fotoPerfil}
            alt=""
            className="absolute inset-y-0 left-0 h-full w-[60%] object-contain object-bottom opacity-80 grayscale lg:w-full"
          />
        )}
        {/* Phones: beside the portrait. Desktop: in front of it, breaking out of the frame's lower-left corner. */}
        <HeroDevice className="absolute bottom-8 right-1 top-3 w-[40%] lg:bottom-10 lg:left-0 lg:right-auto lg:top-auto lg:aspect-[3/4] lg:w-[44%] lg:-translate-x-1/3" />
      </Stage>

      <div className="order-2 flex flex-col justify-center px-4 pb-5 pt-4 sm:px-6 sm:pb-10 lg:order-1 lg:col-span-7 lg:px-0 lg:py-16">
        <p className="hero-in font-mono text-[12px] leading-relaxed text-muted sm:text-[13px]" style={{ '--d': 0 } as React.CSSProperties}>
          <span className="text-ok">rv@latent</span>
          <span className="text-faint">:~$ </span>
          <span>{t.hero_prompt}</span>
          <span className="caret-blink ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-signal" />
        </p>

        <h1
          id="hero-name"
          className="hero-in mt-3 font-display text-[clamp(2.6rem,12.5vw,6rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.035em] text-ink sm:mt-5"
          style={{ '--d': 1 } as React.CSSProperties}
        >
          <span className="block">{first}</span>
          <span className="block text-signal">{rest.join(' ')}</span>
        </h1>

        <p
          className="hero-in mt-4 max-w-[34ch] text-base leading-snug text-muted sm:mt-6 sm:text-lg lg:text-xl"
          style={{ '--d': 2 } as React.CSSProperties}
        >
          <Lede text={t.hero_lede} />
        </p>

        <div
          className="hero-in mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-3"
          style={{ '--d': 3 } as React.CSSProperties}
        >
          <button
            id="hero-proposal-btn"
            type="button"
            onClick={() => {
              soundFx.playClick();
              scrollToSection('connect');
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="group inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap bg-signal px-6 text-[15px] font-semibold text-signal-ink transition-opacity duration-200 hover:opacity-85 active:translate-y-px"
          >
            {t.hero_cta}
            <ArrowDownRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
          </button>

          <div className="flex gap-2 sm:gap-3">
            <button
              id="sys-overview-cv-btn"
              type="button"
              onClick={() => {
                soundFx.playClick();
                onOpenResume();
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap border border-line-strong px-6 text-[15px] font-semibold text-ink transition-colors duration-200 hover:border-signal hover:text-signal active:translate-y-px sm:flex-none"
            >
              <FileText className="h-4 w-4" />
              {t.hero_resume}
            </button>
            <a
              id="hero-github-link"
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub: ${PERSONAL_INFO.githubUsername}`}
              title={`github.com/${PERSONAL_INFO.githubUsername}`}
              onMouseEnter={() => soundFx.playHover()}
              className={iconAction}
            >
              <Github className="h-[18px] w-[18px]" />
            </a>
            <a
              id="hero-linkedin-link"
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn: ${PERSONAL_INFO.linkedinUsername}`}
              title={`linkedin.com/in/${PERSONAL_INFO.linkedinUsername}`}
              onMouseEnter={() => soundFx.playHover()}
              className={iconAction}
            >
              <Linkedin className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
