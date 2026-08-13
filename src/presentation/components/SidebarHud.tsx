import React from 'react';
import { NavSection, ThemeMode } from '../../core/domain/entities/types';
import { soundFx } from '../../utils/sound';
import { useResumeData } from '../hooks/useResumeData';
import { useLanguage } from '../context/LanguageContext';
import {
  Terminal,
  Cpu,
  FolderGit2,
  BookOpen,
  Send,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Smartphone
} from 'lucide-react';

interface SidebarHudProps {
  activeSection: NavSection;
  setActiveSection: (sec: NavSection) => void;
  theme: ThemeMode;
}

export const SidebarHud: React.FC<SidebarHudProps> = ({
  activeSection,
  setActiveSection,
  theme,
}) => {
  const { language } = useLanguage();
  const { PERSONAL_INFO } = useResumeData();
  const isDark = theme === 'dark';

  const hudItems: { id: NavSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'mission', label: 'TERMINAL_BIO', icon: Terminal },
    { id: 'core_tech', label: 'NEURAL_NET', icon: Cpu },
    { id: 'projects', label: 'PROJECT_OS', icon: FolderGit2 },
    { id: 'connect', label: 'PROPOSAL_UPLINK', icon: Send },
  ];

  return (
    <aside
      id="sidebar-hud"
      className={`fixed left-0 top-16 bottom-0 w-16 z-30 hidden lg:flex flex-col justify-between items-center py-6 border-r transition-colors duration-300 ${
        isDark
          ? 'bg-[#060911]/90 border-[#1a2336] text-slate-400'
          : 'bg-slate-100/90 border-slate-200 text-slate-600'
      }`}
    >
      {/* Top HUD Nav Icons */}
      <div className="flex flex-col space-y-5 items-center w-full">
        <div className="w-8 h-[1px] bg-cyan-500/30 mb-2" />

        {hudItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <div key={item.id} className="relative group flex items-center">
              <button
                id={`sidebar-icon-${item.id}`}
                onClick={() => {
                  soundFx.playClick();
                  setActiveSection(item.id);
                }}
                onMouseEnter={() => soundFx.playHover()}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 relative ${
                  isActive
                    ? isDark
                      ? 'bg-cyan-950/80 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-cyan-500 text-white shadow-md'
                    : isDark
                      ? 'hover:bg-slate-800/80 hover:text-cyan-300'
                      : 'hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </button>

              {/* Tooltip */}
              <div className="absolute left-14 hidden group-hover:flex items-center z-50 pointer-events-none">
                <div className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold whitespace-nowrap shadow-xl border ${
                  isDark
                    ? 'bg-[#0f172a] border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-white'
                }`}>
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Social Quick Links */}
      <div className="flex flex-col space-y-3 items-center w-full">
        <div className="w-8 h-[1px] bg-slate-700/50 mb-1" />

        <a
          id="social-github-sidebar"
          href={PERSONAL_INFO.github}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => soundFx.playHover()}
          title="GitHub Profile"
          className="p-2 rounded hover:text-cyan-400 transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>

        <a
          id="social-linkedin-sidebar"
          href={PERSONAL_INFO.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => soundFx.playHover()}
          title="LinkedIn Profile"
          className="p-2 rounded hover:text-cyan-400 transition-colors"
        >
          <Linkedin className="w-4 h-4" />
        </a>

        <a
          id="social-instagram-sidebar"
          href={PERSONAL_INFO.instagram}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => soundFx.playHover()}
          title="Instagram Profile"
          className="p-2 rounded hover:text-fuchsia-400 transition-colors"
        >
          <Instagram className="w-4 h-4" />
        </a>

        <a
          id="social-email-sidebar"
          href={`mailto:${PERSONAL_INFO.email}`}
          onMouseEnter={() => soundFx.playHover()}
          title="Send Email"
          className="p-2 rounded hover:text-emerald-400 transition-colors"
        >
          <Mail className="w-4 h-4" />
        </a>
      </div>
    </aside>
  );
};
