import React, { useState, useRef, useEffect } from 'react';
import { NavSection, ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { soundFx } from '../../utils/sound';
import { useLanguage } from '../context/LanguageContext';
import { Terminal as TerminalIcon, X, CornerDownLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  setActiveSection: (s: NavSection) => void;
  onOpenResume: () => void;
}

interface CommandLog {
  cmd: string;
  res: React.ReactNode;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  setTheme,
  setActiveSection,
  onOpenResume,
}) => {
  const { language } = useLanguage();
  const { PERSONAL_INFO, EXPERIENCES, PROJECTS, TECH_CATEGORIES } = useResumeData();
  
  const [inputVal, setInputVal] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      cmd: 'sys_init',
      res: (
        <div className="text-cyan-400 space-y-1">
          <div>RICHARD_VIVANCO v2.6.0 [OS_MODE: CYBER_HUD]</div>
          <div>Type <span className="text-fuchsia-400 font-bold">&apos;help&apos;</span> to inspect system commands.</div>
        </div>
      ),
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    soundFx.playClick();
    setInputVal('');

    let responseNode: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        responseNode = (
          <div className="space-y-1 text-slate-300">
            <div className="text-cyan-400 font-bold">Comandos disponibles:</div>
            <div>• <span className="text-fuchsia-400">bio</span> / <span className="text-fuchsia-400">profile</span> : Perfil profesional completo</div>
            <div>• <span className="text-fuchsia-400">skills</span> / <span className="text-fuchsia-400">tech</span> : Matriz de habilidades técnicas</div>
            <div>• <span className="text-fuchsia-400">experience</span> : Trayectoria laboral y prácticas</div>
            <div>• <span className="text-fuchsia-400">projects</span> : Lista de proyectos (DK-Fitt, NutriSportiff, etc.)</div>
            <div>• <span className="text-fuchsia-400">contact</span> : Información de contacto directo</div>
            <div>• <span className="text-fuchsia-400">theme</span> : Alternar tema HUD (Light/Dark)</div>
            <div>• <span className="text-fuchsia-400">download-cv</span> : Abrir visualizador de Hoja de Vida</div>
            <div>• <span className="text-fuchsia-400">clear</span> : Limpiar pantalla de consola</div>
          </div>
        );
        break;

      case 'bio':
      case 'profile':
        responseNode = (
          <div className="space-y-1 text-slate-300">
            <div className="text-cyan-400 font-bold">{PERSONAL_INFO.fullName}</div>
            <div className="text-fuchsia-300">{PERSONAL_INFO.title}</div>
            <div className="text-xs text-slate-400">{PERSONAL_INFO.degree}</div>
            <p className="mt-1 text-slate-300 leading-relaxed font-sans">{PERSONAL_INFO.bio}</p>
          </div>
        );
        break;

      case 'skills':
      case 'tech':
        responseNode = (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">ARSENAL TECNOLÓGICO:</div>
            {TECH_CATEGORIES.map((cat) => (
              <div key={cat.title} className="text-xs">
                <span className="text-fuchsia-400 font-bold">{cat.title}:</span>{' '}
                {cat.skills.map((s) => s.name).join(', ')}
              </div>
            ))}
          </div>
        );
        break;

      case 'experience':
        responseNode = (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">CAREER FLIGHT PATH:</div>
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="text-xs border-l-2 border-cyan-500 pl-2 space-y-0.5">
                <div className="font-bold text-white">{exp.role} @ {exp.company} ({exp.period})</div>
                <div className="text-slate-400">{exp.bullets[0]}</div>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        responseNode = (
          <div className="space-y-2">
            <div className="text-cyan-400 font-bold">NODOS PROJECTS:</div>
            {PROJECTS.map((p) => (
              <div key={p.id} className="text-xs flex items-center justify-between">
                <span className="font-bold text-emerald-300">{p.title} ({p.date})</span>
                <span className="text-slate-500">{p.techStack.join(', ')}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        responseNode = (
          <div className="space-y-1 text-xs">
            <div className="text-emerald-400 font-bold">INFORMACIÓN DE ENLACE:</div>
            <div>• Email: {PERSONAL_INFO.email}</div>
            <div>• Tel/WhatsApp: {PERSONAL_INFO.phone}</div>
            <div>• GitHub: {PERSONAL_INFO.github}</div>
            <div>• LinkedIn: {PERSONAL_INFO.linkedin}</div>
            <div>• Instagram: {PERSONAL_INFO.instagram}</div>
          </div>
        );
        break;

      case 'theme':
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        responseNode = <div className="text-amber-300">HUD Theme cambiado a: {nextTheme.toUpperCase()}</div>;
        break;

      case 'download-cv':
        onOpenResume();
        responseNode = <div className="text-cyan-300">Desplegando visor de Hoja de Vida en pantalla...</div>;
        break;

      case 'clear':
        setLogs([]);
        return;

      default:
        responseNode = (
          <div className="text-red-400">
            Comando no reconocido: &apos;{cmd}&apos;. Escribe <span className="underline font-bold">help</span> para ver la lista de comandos.
          </div>
        );
        break;
    }

    setLogs((prev) => [...prev, { cmd, res: responseNode }]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-16 left-0 right-0 z-50 bg-[#060a12]/95 border-b border-cyan-500/50 backdrop-blur-xl shadow-[0_10px_30px_rgba(6,182,212,0.25)] font-mono text-xs max-h-[60vh] flex flex-col justify-between"
      >
        {/* Terminal Header */}
        <div className="px-4 py-2 border-b border-slate-800 bg-[#090e1a] flex items-center justify-between text-cyan-400">
          <div className="flex items-center space-x-2">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="font-bold tracking-wider">SYSTEM_TERMINAL // CLI INTERACTIVE</span>
          </div>

          <button
            id="close-terminal-btn"
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logs viewport */}
        <div className="p-4 overflow-y-auto space-y-3 font-mono text-xs max-h-[45vh]">
          {logs.map((log, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center space-x-2 text-slate-400">
                <span className="text-emerald-400 font-bold">rv_terminal@richard-vivanco:~$</span>
                <span className="text-white font-bold">{log.cmd}</span>
              </div>
              <div className="pl-4 border-l border-slate-800">{log.res}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Command Input Bar */}
        <form onSubmit={handleRunCommand} className="p-3 border-t border-slate-800 bg-[#080c16] flex items-center space-x-2">
          <span className="text-emerald-400 font-bold">rv_terminal@richard-vivanco:~$</span>
          <input
            ref={inputRef}
            id="cli-input-field"
            type="text"
            placeholder="Escribe 'help'..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent text-cyan-300 focus:outline-none font-mono text-xs"
          />
          <button type="submit" className="p-1 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-300">
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};
