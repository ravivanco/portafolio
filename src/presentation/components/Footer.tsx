import React from 'react';
import { ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { soundFx } from '../../utils/sound';
import { Github, Linkedin, Instagram, Mail, Shield } from 'lucide-react';

interface FooterProps {
  theme: ThemeMode;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { PERSONAL_INFO } = useResumeData();
  const isDark = theme === 'dark';

  return (
    <footer
      id="main-footer"
      className={`border-t font-mono text-xs transition-colors duration-300 ${
        isDark
          ? 'bg-[#060911] border-[#182234] text-slate-400'
          : 'bg-slate-100 border-slate-300 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Brand info */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded border font-bold ${isDark ? 'bg-cyan-950 border-cyan-500/40 text-cyan-400' : 'bg-cyan-100 border-cyan-400 text-cyan-800'}`}>
              RV
            </div>
            <div>
              <div className={`font-bold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                SYSTEM_CORE // {PERSONAL_INFO.shortName}
              </div>
              <div className="text-[11px] text-slate-500">
                {PERSONAL_INFO.degree}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              id="footer-github"
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundFx.playHover()}
              className={`p-2 rounded transition-colors ${isDark ? 'hover:bg-slate-800 hover:text-cyan-400 text-slate-400' : 'hover:bg-slate-200 hover:text-cyan-600 text-slate-600'}`}
              title="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>

            <a
              id="footer-linkedin"
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundFx.playHover()}
              className={`p-2 rounded transition-colors ${isDark ? 'hover:bg-slate-800 hover:text-blue-400 text-slate-400' : 'hover:bg-slate-200 hover:text-blue-600 text-slate-600'}`}
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>

            <a
              id="footer-instagram"
              href={PERSONAL_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundFx.playHover()}
              className={`p-2 rounded transition-colors ${isDark ? 'hover:bg-slate-800 hover:text-fuchsia-400 text-slate-400' : 'hover:bg-slate-200 hover:text-fuchsia-600 text-slate-600'}`}
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <a
              id="footer-email"
              href={`mailto:${PERSONAL_INFO.email}`}
              onMouseEnter={() => soundFx.playHover()}
              className={`p-2 rounded transition-colors ${isDark ? 'hover:bg-slate-800 hover:text-emerald-400 text-slate-400' : 'hover:bg-slate-200 hover:text-emerald-600 text-slate-600'}`}
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-4 border-t ${isDark ? 'border-slate-800/60' : 'border-slate-300'}`}>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-4">
            <Shield className="w-4 h-4" />
            <span>SYSTEM_INTEGRITY // LEGAL</span>
          </div>
          <p className={`font-mono text-[10px] leading-relaxed mb-4 ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
            © {new Date().getFullYear()} {PERSONAL_INFO.fullName}. All rights reserved. The source code and architecture of this portfolio are protected intellectual property.
          </p>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className={`font-mono text-[10px] font-bold ${
              isDark ? 'text-emerald-400' : 'text-emerald-600'
            }`}>
              SECURE_CONNECTION_ESTABLISHED
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
