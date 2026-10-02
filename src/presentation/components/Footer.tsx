import React from 'react';
import { useResumeData } from '../hooks/useResumeData';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { soundFx } from '../../utils/sound';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].ui;
  const { PERSONAL_INFO } = useResumeData();

  const links = [
    { id: 'footer-github', href: PERSONAL_INFO.github, label: 'GitHub', Icon: Github },
    { id: 'footer-linkedin', href: PERSONAL_INFO.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { id: 'footer-instagram', href: PERSONAL_INFO.instagram, label: 'Instagram', Icon: Instagram },
    { id: 'footer-email', href: `mailto:${PERSONAL_INFO.email}`, label: 'Email', Icon: Mail },
  ];

  return (
    <footer id="main-footer" className="relative z-10 border-t border-line bg-ground pb-24 lg:pb-0 lg:pl-16">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-signal font-display text-[11px] font-bold text-signal">RV</span>
            <div>
              <p className="font-mono text-[13px] font-semibold tracking-wider text-ink">SYSTEM_CORE // {PERSONAL_INFO.shortName}</p>
              <p className="mt-0.5 text-xs text-faint">{PERSONAL_INFO.degree}</p>
              <p className="mt-1 text-xs text-muted">&ldquo;{PERSONAL_INFO.motto}&rdquo;</p>
            </div>
          </div>
          <ul className="flex gap-1">
            {links.map(({ id, href, label, Icon }) => (
              <li key={id}>
                <a
                  id={id}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  onMouseEnter={() => soundFx.playHover()}
                  className="flex h-10 w-10 items-center justify-center text-muted transition-colors duration-200 hover:text-signal"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-line pt-6 text-xs text-faint md:flex-row">
          <p className="max-w-[80ch]">
            © {new Date().getFullYear()} {PERSONAL_INFO.fullName}. {t.footer_legal}
          </p>
          <p className="flex items-center gap-2 font-mono text-[11px] text-ok">
            <span className="pulse-dot h-1.5 w-1.5 bg-ok" />
            SECURE_CONNECTION_ESTABLISHED
          </p>
        </div>
      </div>
    </footer>
  );
};
