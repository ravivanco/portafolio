import React, { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { ThemeMode } from './core/domain/entities/types';
import { Header } from './presentation/components/Header';
import { SidebarHud } from './presentation/components/SidebarHud';
import { MobileDock } from './presentation/components/MobileDock';
import { MissionSection } from './presentation/components/MissionSection';
import { PathSection } from './presentation/components/PathSection';
import { CoreTechSection } from './presentation/components/CoreTechSection';
import { ProjectsSection } from './presentation/components/ProjectsSection';
import { ConnectSection } from './presentation/components/ConnectSection';
import { TerminalDrawer } from './presentation/components/TerminalDrawer';
import { ResumeModal } from './presentation/components/ResumeModal';
import { Footer } from './presentation/components/Footer';
import { LatentCanvas } from './presentation/components/LatentCanvas';
import { useActiveSection, useRevealObserver } from './presentation/hooks/useLatent';
import { useLanguage } from './presentation/context/LanguageContext';
import { translations } from './utils/i18n';

const initialTheme = (): ThemeMode => {
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'light' ? 'light' : 'dark';
};

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [fieldOk, setFieldOk] = useState(true);
  const { language } = useLanguage();
  const activeSection = useActiveSection();
  useRevealObserver([language]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#05070d' : '#eceef3');
    try {
      localStorage.setItem('rv-theme', theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  const onUnsupported = useCallback(() => setFieldOk(false), []);
  const openResume = useCallback(() => setResumeOpen(true), []);
  const closeResume = useCallback(() => setResumeOpen(false), []);
  const closeTerminal = useCallback(() => setTerminalOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-ground text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-signal focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-signal-ink"
        >
          {translations[language].ui.skip}
        </a>

        <div aria-hidden="true" className="hud-grid pointer-events-none fixed inset-0 z-0" />
        {fieldOk && <LatentCanvas onUnsupported={onUnsupported} />}

        <Header
          activeSection={activeSection}
          theme={theme}
          setTheme={setTheme}
          terminalOpen={terminalOpen}
          setTerminalOpen={setTerminalOpen}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onOpenResume={openResume}
        />

        <TerminalDrawer
          isOpen={terminalOpen}
          onClose={closeTerminal}
          theme={theme}
          setTheme={setTheme}
          onOpenResume={openResume}
        />

        <SidebarHud activeSection={activeSection} />

        <main id="main" className="relative z-10 lg:pl-16">
          <MissionSection fieldOk={fieldOk} onOpenResume={openResume} />
          <PathSection />
          <CoreTechSection theme={theme} />
          <ProjectsSection theme={theme} />
          <ConnectSection />
        </main>

        <Footer />
        <MobileDock activeSection={activeSection} />

        <ResumeModal isOpen={resumeOpen} onClose={closeResume} />
      </div>
    </MotionConfig>
  );
}
