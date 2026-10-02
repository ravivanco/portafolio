import React, { useState, useRef, useEffect } from 'react';
import { NavSection, ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { soundFx } from '../../utils/sound';
import { useLanguage } from '../context/LanguageContext';
import { scrollToSection } from '../hooks/useLatent';
import { Terminal as TerminalIcon, X, CornerDownLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  onOpenResume: () => void;
}

interface CommandLog {
  cmd: string;
  res: React.ReactNode;
}

const COPY = {
  es: {
    boot: 'RICHARD_VIVANCO v3.0.0 [OS_MODE: LATENT_HUD]',
    hint: 'para ver los comandos del sistema.',
    type: 'Escribe',
    available: 'Comandos disponibles:',
    help: {
      bio: 'Perfil profesional completo',
      skills: 'Matriz de habilidades técnicas',
      experience: 'Trayectoria laboral y prácticas',
      projects: 'Lista de proyectos',
      contact: 'Información de contacto directo',
      goto: 'Ir a una sección (home, path, tech, projects, contact)',
      lang: 'Cambiar idioma (es / en)',
      theme: 'Alternar tema (dark / light)',
      cv: 'Abrir visor de Hoja de Vida',
      clear: 'Limpiar consola',
    },
    arsenal: 'ARSENAL TECNOLÓGICO:',
    nodes: 'NODOS DE PROYECTO:',
    link: 'INFORMACIÓN DE ENLACE:',
    theme: 'Tema cambiado a',
    lang: 'Idioma cambiado a',
    cv: 'Desplegando visor de Hoja de Vida...',
    nav: 'Navegando a',
    unknown: 'Comando no reconocido:',
    seeHelp: 'Escribe help para ver la lista.',
    placeholder: "Escribe 'help'...",
    title: 'SYSTEM_TERMINAL // CLI INTERACTIVA',
    close: 'Cerrar terminal',
  },
  en: {
    boot: 'RICHARD_VIVANCO v3.0.0 [OS_MODE: LATENT_HUD]',
    hint: 'to inspect system commands.',
    type: 'Type',
    available: 'Available commands:',
    help: {
      bio: 'Full professional profile',
      skills: 'Technical skills matrix',
      experience: 'Work history and internships',
      projects: 'Project list',
      contact: 'Direct contact information',
      goto: 'Jump to a section (home, path, tech, projects, contact)',
      lang: 'Switch language (es / en)',
      theme: 'Toggle theme (dark / light)',
      cv: 'Open the resume viewer',
      clear: 'Clear the console',
    },
    arsenal: 'TECH ARSENAL:',
    nodes: 'PROJECT NODES:',
    link: 'CONTACT LINK:',
    theme: 'Theme switched to',
    lang: 'Language switched to',
    cv: 'Deploying resume viewer...',
    nav: 'Navigating to',
    unknown: 'Command not recognized:',
    seeHelp: 'Type help for the list.',
    placeholder: "Type 'help'...",
    title: 'SYSTEM_TERMINAL // INTERACTIVE CLI',
    close: 'Close terminal',
  },
};

const GOTO: Record<string, NavSection> = {
  home: 'mission', about: 'mission', inicio: 'mission',
  path: 'path', career: 'path', trayectoria: 'path',
  tech: 'core_tech', skills: 'core_tech',
  projects: 'projects', proyectos: 'projects',
  contact: 'connect', contacto: 'connect', connect: 'connect',
};

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({ isOpen, onClose, theme, setTheme, onOpenResume }) => {
  const { language, setLanguage } = useLanguage();
  const k = COPY[language];
  const { PERSONAL_INFO, EXPERIENCES, PROJECTS, TECH_CATEGORIES } = useResumeData();

  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => inputRef.current?.focus(), 100);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(id);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [logs]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim().toLowerCase();
    if (!raw) return;
    const [cmd, arg] = raw.split(/\s+/);

    soundFx.playClick();
    setInputVal('');

    let res: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        res = (
          <div className="space-y-1 text-muted">
            <div className="font-semibold text-signal">{k.available}</div>
            {(
              [
                ['bio', k.help.bio], ['skills', k.help.skills], ['experience', k.help.experience],
                ['projects', k.help.projects], ['contact', k.help.contact], ['goto <section>', k.help.goto],
                ['lang <es|en>', k.help.lang], ['theme', k.help.theme], ['download-cv', k.help.cv], ['clear', k.help.clear],
              ] as const
            ).map(([c, d]) => (
              <div key={c} className="grid grid-cols-[150px_1fr] gap-2">
                <span className="text-signal">{c}</span>
                <span>{d}</span>
              </div>
            ))}
          </div>
        );
        break;
      case 'bio':
      case 'profile':
        res = (
          <div className="space-y-1">
            <div className="font-semibold text-signal">{PERSONAL_INFO.fullName}</div>
            <div className="text-signal">{PERSONAL_INFO.title}</div>
            <div className="text-faint">{PERSONAL_INFO.degree}</div>
            <p className="mt-1 max-w-[80ch] font-sans text-[13px] leading-relaxed text-muted">{PERSONAL_INFO.bio}</p>
          </div>
        );
        break;
      case 'skills':
      case 'tech':
        res = (
          <div className="space-y-1.5">
            <div className="font-semibold text-signal">{k.arsenal}</div>
            {TECH_CATEGORIES.map((cat) => (
              <div key={cat.title}>
                <span className="text-signal">{cat.title}:</span> <span className="text-muted">{cat.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        );
        break;
      case 'experience':
        res = (
          <div className="space-y-2">
            <div className="font-semibold text-signal">CAREER FLIGHT_PATH:</div>
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="border-l border-signal pl-2">
                <div className="text-ink">{exp.role} @ {exp.company} ({exp.period})</div>
                <div className="text-faint">{exp.bullets[0]}</div>
              </div>
            ))}
          </div>
        );
        break;
      case 'projects':
        res = (
          <div className="space-y-1">
            <div className="font-semibold text-signal">{k.nodes}</div>
            {PROJECTS.map((p) => (
              <div key={p.id} className="flex flex-wrap justify-between gap-x-4">
                <span className="text-ok">{p.title} ({p.date})</span>
                <span className="text-faint">{p.techStack.join(', ')}</span>
              </div>
            ))}
          </div>
        );
        break;
      case 'contact':
        res = (
          <div className="space-y-0.5 text-muted">
            <div className="font-semibold text-ok">{k.link}</div>
            <div>Email: {PERSONAL_INFO.email}</div>
            <div>Tel/WhatsApp: {PERSONAL_INFO.phone}</div>
            <div>GitHub: {PERSONAL_INFO.github}</div>
            <div>LinkedIn: {PERSONAL_INFO.linkedin}</div>
            <div>Instagram: {PERSONAL_INFO.instagram}</div>
          </div>
        );
        break;
      case 'goto':
      case 'cd': {
        const target = arg ? GOTO[arg] : undefined;
        if (target) {
          scrollToSection(target);
          res = <div className="text-signal">{k.nav} {arg}</div>;
        } else {
          res = <div className="text-danger">{k.help.goto}</div>;
        }
        break;
      }
      case 'lang':
      case 'es':
      case 'en': {
        const next = cmd === 'es' || cmd === 'en' ? cmd : arg === 'es' || arg === 'en' ? arg : language === 'es' ? 'en' : 'es';
        setLanguage(next);
        res = <div className="text-warn">{COPY[next].lang} {next.toUpperCase()}</div>;
        break;
      }
      case 'theme': {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        res = <div className="text-warn">{k.theme} {nextTheme.toUpperCase()}</div>;
        break;
      }
      case 'download-cv':
      case 'cv':
        onOpenResume();
        res = <div className="text-signal">{k.cv}</div>;
        break;
      case 'clear':
        setLogs([]);
        return;
      default:
        res = (
          <div className="text-danger">
            {k.unknown} &apos;{raw}&apos;. {k.seeHelp}
          </div>
        );
    }

    setLogs((prev) => [...prev, { cmd: raw, res }]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="terminal"
          role="dialog"
          aria-label={k.title}
          initial={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 top-16 z-50 flex max-h-[70svh] flex-col border-b border-signal/50 bg-ground font-mono text-xs lg:left-16"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-2 text-signal">
            <div className="flex items-center gap-2">
              <TerminalIcon className="h-4 w-4" aria-hidden="true" />
              <span className="font-semibold tracking-wider">{k.title}</span>
            </div>
            <button
              id="close-terminal-btn"
              type="button"
              aria-label={k.close}
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center text-muted hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            <div className="space-y-1 text-signal">
              <div>{k.boot}</div>
              <div className="text-muted">
                {k.type} <span className="font-semibold text-signal">&apos;help&apos;</span> {k.hint}
              </div>
            </div>
            {logs.map((log, i) => (
              <div key={i} className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ok">rv@latent:~$</span>
                  <span className="text-ink">{log.cmd}</span>
                </div>
                <div className="border-l border-line pl-4">{log.res}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleRunCommand} className="flex items-center gap-2 border-t border-line p-3">
            <span className="hidden font-semibold text-ok sm:inline">rv@latent:~$</span>
            <span className="font-semibold text-ok sm:hidden">$</span>
            <input
              ref={inputRef}
              id="cli-input-field"
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Command"
              placeholder={k.placeholder}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-[16px] text-signal placeholder:text-faint focus:outline-none sm:text-xs"
            />
            <button type="submit" aria-label="Run" className="flex h-10 w-10 items-center justify-center border border-line text-signal">
              <CornerDownLeft className="h-3.5 w-3.5" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
