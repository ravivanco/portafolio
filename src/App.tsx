import React, { useState, useEffect } from 'react';
import { NavSection, ThemeMode } from './core/domain/entities/types';
import { Header } from './presentation/components/Header';
import { SidebarHud } from './presentation/components/SidebarHud';
import { MissionSection } from './presentation/components/MissionSection';
import { CoreTechSection } from './presentation/components/CoreTechSection';
import { ProjectsSection } from './presentation/components/ProjectsSection';
import { ConnectSection } from './presentation/components/ConnectSection';
import { TerminalDrawer } from './presentation/components/TerminalDrawer';
import { ResumeModal } from './presentation/components/ResumeModal';
import { Footer } from './presentation/components/Footer';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('mission');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Sync theme class to document html body
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#070a12';
      document.body.style.color = '#f8fafc';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDark ? 'bg-[#070a12] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background Cyber Grid Lines Effect */}
      <div className={`fixed inset-0 pointer-events-none opacity-20 ${
        isDark
          ? 'bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]'
          : 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]'
      }`} />

      {/* Main Header Navbar */}
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        theme={theme}
        setTheme={setTheme}
        terminalOpen={terminalOpen}
        setTerminalOpen={setTerminalOpen}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* CLI Terminal Drawer */}
      <TerminalDrawer
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        theme={theme}
        setTheme={setTheme}
        setActiveSection={setActiveSection}
        onOpenResume={() => setResumeOpen(true)}
      />

      {/* Left Sidebar HUD Navigation */}
      <SidebarHud
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        theme={theme}
      />

      {/* Main Layout Container */}
      <main className="flex-1 lg:pl-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'mission' && (
                <MissionSection
                  theme={theme}
                  setActiveSection={setActiveSection}
                  onOpenResume={() => setResumeOpen(true)}
                />
              )}

              {activeSection === 'core_tech' && (
                <CoreTechSection theme={theme} />
              )}

              {activeSection === 'projects' && (
                <ProjectsSection theme={theme} />
              )}

              {activeSection === 'connect' && (
                <ConnectSection theme={theme} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Resume Viewer Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        theme={theme}
      />

      {/* Footer */}
      <Footer theme={theme} />
    </div>
  );
}
