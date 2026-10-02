import React from 'react';
import { Home, GitBranch, Cpu, Smartphone, Send } from 'lucide-react';
import { NavSection } from '../../core/domain/entities/types';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { SECTION_ORDER, scrollToSection } from '../hooks/useLatent';
import { navLabel } from './Header';
import { soundFx } from '../../utils/sound';

const ICONS: Record<NavSection, React.FC<{ className?: string }>> = {
  mission: Home,
  path: GitBranch,
  core_tech: Cpu,
  projects: Smartphone,
  connect: Send,
};

/** Thumb-reach section nav for phones. */
export const MobileDock: React.FC<{ activeSection: NavSection }> = ({ activeSection }) => {
  const { language } = useLanguage();
  const t = translations[language].ui;
  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ground pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {SECTION_ORDER.map((id) => {
          const Icon = ICONS[id];
          const active = activeSection === id;
          return (
            <li key={id}>
              <button
                type="button"
                aria-current={active ? 'true' : undefined}
                onClick={() => {
                  soundFx.playClick();
                  scrollToSection(id);
                }}
                className={`relative flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium tracking-[0.04em] transition-colors duration-200 ${
                  active ? 'text-signal' : 'text-muted'
                }`}
              >
                <span
                  className={`absolute inset-x-4 top-0 h-px bg-signal transition-transform duration-500 ease-out-expo ${
                    active ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
                <Icon className="h-[18px] w-[18px]" />
                <span className="max-w-full truncate px-1">{navLabel(id, t.nav)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
