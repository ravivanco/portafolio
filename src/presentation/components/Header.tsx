import React from 'react';
import { NavSection, ThemeMode } from '../../core/domain/entities/types';
import { soundFx } from '../../utils/sound';
import { Terminal, Sun, Moon, Volume2, VolumeX, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { SECTION_ORDER, scrollToSection } from '../hooks/useLatent';

interface HeaderProps {
  activeSection: NavSection;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  terminalOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenResume: () => void;
}

export const navLabel = (s: NavSection, nav: { about: string; path: string; tech: string; projects: string; connect: string }) =>
  ({ mission: nav.about, path: nav.path, core_tech: nav.tech, projects: nav.projects, connect: nav.connect })[s];

const iconBox =
  'h-10 w-10 items-center justify-center border border-line text-muted transition-colors duration-200 hover:border-line-strong hover:text-ink';
const iconBtn = `inline-flex ${iconBox}`;

export const LanguageSwitch: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language].ui;
  return (
    <div role="group" aria-label={t.lang_label} className="flex h-10 border border-line text-xs font-semibold">
      {(['es', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={language === l}
          onClick={() => {
            soundFx.playClick();
            setLanguage(l);
          }}
          className={`w-9 uppercase transition-colors duration-200 ${
            language === l ? 'bg-signal text-signal-ink font-semibold' : 'text-muted hover:text-ink'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  theme,
  setTheme,
  terminalOpen,
  setTerminalOpen,
  soundEnabled,
  setSoundEnabled,
  onOpenResume,
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const isDark = theme === 'dark';

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full border-b border-line bg-ground">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 lg:pl-24 lg:pr-8">
        <button
          id="brand-logo-btn"
          type="button"
          onClick={() => {
            soundFx.playClick();
            scrollToSection('mission');
          }}
          className="group flex min-w-0 items-center gap-3 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-signal font-display text-[11px] font-bold text-signal">
            RV
          </span>
          <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate font-mono text-[13px] font-semibold tracking-wider text-ink">RICHARD_VIVANCO</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ok">
              <span className="pulse-dot h-1.5 w-1.5 bg-ok" />
              {t.nav.sys_operational}
            </span>
          </span>
        </button>

        <nav aria-label="Primary" className="hidden items-center gap-1 text-[13px] font-medium lg:flex">
          {SECTION_ORDER.map((id) => {
            const active = activeSection === id;
            return (
              <a
                key={id}
                href={`#section-${id.replace('_', '-')}`}
                aria-current={active ? 'true' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  soundFx.playClick();
                  scrollToSection(id);
                }}
                onMouseEnter={() => soundFx.playHover()}
                className={`relative px-3 py-2 tracking-[0.06em] no-underline transition-colors duration-200 ${
                  active ? 'text-signal' : 'text-muted hover:text-ink'
                }`}
              >
                {navLabel(id, t.ui.nav)}
                <span
                  className={`absolute inset-x-3 -bottom-[13px] h-px bg-signal transition-transform duration-500 ease-out-expo ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitch />

          <button
            id="toggle-terminal-btn"
            type="button"
            aria-label={t.ui.open_terminal}
            aria-expanded={terminalOpen}
            onClick={() => {
              soundFx.playClick();
              setTerminalOpen(!terminalOpen);
            }}
            className={`${iconBtn} ${terminalOpen ? '!border-signal !text-signal' : ''}`}
          >
            <Terminal className="h-4 w-4" />
          </button>

          <button
            id="toggle-theme-btn"
            type="button"
            aria-label={t.ui.theme_toggle}
            onClick={() => {
              soundFx.playClick();
              setTheme(isDark ? 'light' : 'dark');
            }}
            className={iconBtn}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            id="toggle-sound-btn"
            type="button"
            aria-label={t.ui.sound_toggle}
            aria-pressed={soundEnabled}
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundFx.setEnabled(next);
              if (next) soundFx.playClick();
            }}
            className={`${iconBox} hidden md:inline-flex`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            id="resume-modal-btn"
            type="button"
            aria-label={t.ui.open_resume}
            onClick={() => {
              soundFx.playClick();
              onOpenResume();
            }}
            className="inline-flex h-10 items-center gap-2 bg-signal px-3 text-sm font-semibold text-signal-ink transition-opacity duration-200 hover:opacity-85"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{t.nav.resume}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
