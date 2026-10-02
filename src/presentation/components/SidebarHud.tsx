import React from 'react';
import { NavSection } from '../../core/domain/entities/types';
import { soundFx } from '../../utils/sound';
import { useResumeData } from '../hooks/useResumeData';
import { SECTION_ORDER, scrollToSection } from '../hooks/useLatent';
import { FORMATION_NAMES } from '../latent/formations';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

/** Desktop rail: the sampler's timeline. Each tick is a section and its formation. */
export const SidebarHud: React.FC<{ activeSection: NavSection }> = ({ activeSection }) => {
  const { PERSONAL_INFO } = useResumeData();
  const activeIdx = SECTION_ORDER.indexOf(activeSection);

  const social = [
    { href: PERSONAL_INFO.github, label: 'GitHub', Icon: Github },
    { href: PERSONAL_INFO.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: PERSONAL_INFO.instagram, label: 'Instagram', Icon: Instagram },
    { href: `mailto:${PERSONAL_INFO.email}`, label: 'Email', Icon: Mail },
  ];

  return (
    <aside
      id="sidebar-hud"
      className="fixed bottom-0 left-0 top-16 z-30 hidden w-16 flex-col items-center justify-between border-r border-line bg-ground/90 py-8 lg:flex"
    >
      <nav aria-label="Formations" className="relative flex flex-col items-center gap-7">
        <span aria-hidden="true" className="absolute bottom-1 top-1 w-px bg-line" />
        <span
          aria-hidden="true"
          className="absolute top-1 w-px bg-signal transition-[height] duration-700 ease-out-expo"
          style={{ height: `calc(${(activeIdx / (SECTION_ORDER.length - 1)) * 100}% - 0.25rem)` }}
        />
        {SECTION_ORDER.map((id, i) => {
          const active = i === activeIdx;
          return (
            <button
              key={id}
              type="button"
              aria-label={FORMATION_NAMES[i]}
              aria-current={active ? 'true' : undefined}
              onClick={() => {
                soundFx.playClick();
                scrollToSection(id);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="group relative flex h-5 w-5 items-center justify-center"
            >
              <span
                className={`block h-2 w-2 border transition-colors duration-300 ${
                  i <= activeIdx ? 'border-signal bg-signal' : 'border-line-strong bg-ground'
                }`}
              />
              <span
                className="pointer-events-none absolute left-8 whitespace-nowrap border border-line bg-surface px-2 py-1 font-mono text-[11px] text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {FORMATION_NAMES[i]}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-1">
        {social.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={label}
            onMouseEnter={() => soundFx.playHover()}
            className="flex h-10 w-10 items-center justify-center text-muted transition-colors duration-200 hover:text-signal"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </aside>
  );
};
