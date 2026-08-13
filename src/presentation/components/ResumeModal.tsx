import React from 'react';
import { ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { soundFx } from '../../utils/sound';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { FileText, Download, Printer, X, Mail, Phone, MapPin, Github, Linkedin, Award, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ theme, onClose, isOpen }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { PERSONAL_INFO, EXPERIENCES, PROJECTS, TECH_CATEGORIES, CERTIFICATIONS, LANGUAGES } = useResumeData();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl border shadow-2xl flex flex-col justify-between ${
          isDark ? 'bg-[#0a0f1d] border-cyan-500/50 text-slate-200' : 'bg-white text-slate-900 border-slate-300'
        }`}
      >
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-800 bg-[#0d1322] flex items-center justify-between sticky top-0 z-20 font-mono text-xs">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold">
            <FileText className="w-4 h-4" />
            <span>CURRICULUM VITAE // RICHARD ALEXIS VIVANCO CHICAIZA</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="print-resume-btn"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded border border-slate-700 bg-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">IMPRIMIR / PDF</span>
            </button>

            <button
              id="close-resume-btn"
              onClick={onClose}
              className="p-1.5 rounded border border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CV Printable Body */}
        <div className="p-6 sm:p-10 space-y-8 font-sans text-xs sm:text-sm leading-relaxed" id="printable-cv">
          {/* Header Block */}
          <div className="border-b pb-6 border-slate-800 space-y-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tracking-tight uppercase">
                {PERSONAL_INFO.fullName}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-300 mt-1">
                {PERSONAL_INFO.title} — {PERSONAL_INFO.degree}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{PERSONAL_INFO.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{PERSONAL_INFO.phone}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-fuchsia-400" />
                <span>{PERSONAL_INFO.email}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Github className="w-3.5 h-3.5 text-slate-300" />
                <span>github.com/ravivanco</span>
              </span>
            </div>
          </div>

          {/* Profile Summary */}
          <div className="space-y-2">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-1">
              PERFIL PROFESIONAL
            </h2>
            <p className="text-slate-300">{PERSONAL_INFO.bio}</p>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-1">
              EXPERIENCIA PROFESIONAL
            </h2>
            <div className="space-y-4">
              {EXPERIENCES.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline font-mono text-xs font-bold">
                    <span className="text-white">{exp.role} — <span className="text-fuchsia-400">{exp.company}</span></span>
                    <span className="text-slate-400">{exp.period}</span>
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    {exp.bullets.map((b, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-cyan-400 font-mono">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="space-y-4">
            <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-1">
              PROYECTOS DESTACADOS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROJECTS.map((p) => (
                <div key={p.id} className="p-3 rounded border border-slate-800 bg-[#0d1322] space-y-1">
                  <div className="flex justify-between font-mono text-xs font-bold text-cyan-300">
                    <span>{p.title}</span>
                    <span className="text-slate-500">{p.date}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">{p.subtitle}</p>
                  <div className="text-[11px] font-mono text-fuchsia-400">
                    Stack: {p.techStack.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                HABILIDADES TÉCNICAS
              </h2>
              <div className="space-y-1 font-mono text-xs text-slate-300">
                <div><span className="text-fuchsia-400 font-bold">Móvil:</span> React Native, Flutter, Expo, Android Studio</div>
                <div><span className="text-fuchsia-400 font-bold">Backend/Web:</span> Node.js, Express, Laravel, Spring Boot, Python</div>
                <div><span className="text-fuchsia-400 font-bold">Frontend:</span> React, JavaScript, HTML, Tailwind CSS, Bootstrap</div>
                <div><span className="text-fuchsia-400 font-bold">Bases de Datos:</span> PostgreSQL, MySQL, phpMyAdmin, MongoDB</div>
                <div><span className="text-fuchsia-400 font-bold">IA & Tools:</span> Computer Vision, N8N, Git, Scrum, JIRA</div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-1">
                CERTIFICACIONES E IDIOMAS
              </h2>
              <div className="space-y-1 font-mono text-xs text-slate-300">
                {CERTIFICATIONS.map((c) => (
                  <div key={c.title}>• {c.title} — <span className="text-slate-400">{c.issuer}</span></div>
                ))}
                <div className="pt-2">
                  <span className="text-fuchsia-400 font-bold">Español:</span> Nativo | <span className="text-fuchsia-400 font-bold">Inglés:</span> Nivel B1
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0d1322] flex justify-end space-x-3 font-mono text-xs">
          <button
            id="cv-modal-close-btn"
            onClick={onClose}
            className="px-5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
          >
            CERRAR VISOR
          </button>
        </div>
      </motion.div>
    </div>
  );
};
