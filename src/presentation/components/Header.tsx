import React from 'react';
import { NavSection, ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { soundFx } from '../../utils/sound';
import { Terminal, Sun, Moon, Volume2, VolumeX, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';

interface HeaderProps {
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  terminalOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onOpenResume: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  theme,
  setTheme,
  terminalOpen,
  setTerminalOpen,
  soundEnabled,
  setSoundEnabled,
  onOpenResume,
}) => {
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].nav;
  const { PERSONAL_INFO } = useResumeData();

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'mission', label: t.mission },
    { id: 'core_tech', label: t.core_tech },
    { id: 'projects', label: t.projects },
    { id: 'connect', label: t.connect },
  ];

  const isDark = theme === 'dark';

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-300 ${
        isDark
          ? 'bg-[#090d16]/90 border-[#1e293b] text-cyan-400'
          : 'bg-slate-50/90 border-slate-200 text-slate-800'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <button
            id="brand-logo-btn"
            onClick={() => {
              soundFx.playClick();
              setActiveSection('mission');
            }}
            className="group flex items-center space-x-2 text-left focus:outline-none"
          >
            <div className={`w-8 h-8 rounded border flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
              isDark 
                ? 'border-cyan-500 bg-cyan-950/50 text-cyan-300 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.6)]' 
                : 'border-slate-800 bg-slate-900 text-cyan-400 group-hover:bg-slate-800'
            }`}>
              RV
            </div>
            <div>
              <span className={`font-mono font-bold tracking-wider text-sm sm:text-base block ${
                isDark ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-slate-900'
              }`}>
                {PERSONAL_INFO.shortName.replace(' ', '_')}
              </span>
              <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="tracking-widest uppercase">{t.sys_operational}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center Nav Links */}
        <nav id="header-nav" className="hidden md:flex items-center space-x-1 lg:space-x-2 font-mono text-xs">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => {
                  soundFx.playClick();
                  setActiveSection(item.id);
                }}
                onMouseEnter={() => soundFx.playHover()}
                className={`px-3 py-1.5 rounded transition-all duration-200 font-semibold tracking-wider relative ${
                  isActive
                    ? isDark
                      ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                      : 'text-cyan-900 bg-cyan-100 border border-cyan-400 shadow-sm'
                    : isDark
                      ? 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* CLI Terminal Toggle */}
          <button
            id="toggle-terminal-btn"
            onClick={() => {
              soundFx.playClick();
              setTerminalOpen(!terminalOpen);
            }}
            onMouseEnter={() => soundFx.playHover()}
            title="Toggle Interactive CLI Terminal"
            className={`p-2 rounded border transition-all duration-200 text-xs font-mono flex items-center space-x-1.5 ${
              terminalOpen
                ? 'bg-fuchsia-950/70 border-fuchsia-500 text-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.3)]'
                : isDark
                  ? 'bg-slate-900/80 border-slate-700 text-slate-300 hover:border-cyan-500 hover:text-cyan-300'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden sm:inline">CLI</span>
          </button>

          {/* Theme Switcher */}
          <button
            id="toggle-theme-btn"
            onClick={() => {
              soundFx.playClick();
              setTheme(isDark ? 'light' : 'dark');
            }}
            onMouseEnter={() => soundFx.playHover()}
            title={`Switch to ${isDark ? 'Light HUD' : 'Dark Cyber'} mode`}
            className={`p-2 rounded border transition-all duration-200 ${
              isDark
                ? 'bg-slate-900/80 border-slate-700 text-amber-400 hover:border-amber-400'
                : 'bg-white border-slate-300 text-indigo-600 hover:border-indigo-600'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundFx.setEnabled(next);
              if (next) soundFx.playClick();
            }}
            onMouseEnter={() => soundFx.playHover()}
            title={soundEnabled ? 'Disable Audio FX' : 'Enable Audio FX'}
            className={`p-2 rounded border transition-all duration-200 hidden sm:flex ${
              soundEnabled
                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-400'
                : isDark
                  ? 'bg-slate-900/80 border-slate-800 text-slate-500'
                  : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Resume PDF button */}
          <button
            id="resume-modal-btn"
            onClick={() => {
              soundFx.playClick();
              onOpenResume();
            }}
            onMouseEnter={() => soundFx.playHover()}
            className="px-3 py-1.5 rounded border border-cyan-500 bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-400 font-mono text-xs font-bold transition-all duration-200 shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.resume}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Subbar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/50 py-2 px-2 font-mono text-[11px] overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => {
              soundFx.playClick();
              setActiveSection(item.id);
            }}
            className={`px-2.5 py-1 rounded whitespace-nowrap font-medium ${
              activeSection === item.id
                ? isDark
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'bg-cyan-100 text-cyan-900 border border-cyan-400'
                : isDark
                  ? 'text-slate-400'
                  : 'text-slate-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
