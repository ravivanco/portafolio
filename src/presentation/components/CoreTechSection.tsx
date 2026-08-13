import React from 'react';
import { ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../../utils/sound';
import { Smartphone, Server, Database, Brain, Shield, Cpu, Code2, Globe, Award, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  FaReact, FaNodeJs, FaLaravel, FaPython, FaHtml5, FaBootstrap, FaJava, 
  FaEye, FaRobot
} from 'react-icons/fa';
import { 
  SiFlutter, SiExpo, SiAndroidstudio, SiExpress, SiSpringboot, 
  SiJavascript, SiTailwindcss, SiTypescript, SiCplusplus, 
  SiPostgresql, SiMysql, SiMongodb, SiPhpmyadmin, SiN8N, SiGoogle
} from 'react-icons/si';

interface CoreTechSectionProps {
  theme: ThemeMode;
}

export const CoreTechSection: React.FC<CoreTechSectionProps> = ({ theme }) => {
  const { language } = useLanguage();
  const { TECH_CATEGORIES, CERTIFICATIONS, LANGUAGES } = useResumeData();
  const isDark = theme === 'dark';

  const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
    'Desarrollo Móvil': Smartphone,
    'Backend & Web': Server,
    'Frontend / Web': Code2,
    'Lenguajes': Globe,
    'Bases de Datos': Database,
    'IA & Automatización': Brain,
  };

  const skillIcons: Record<string, React.ElementType> = {
    'React Native': FaReact,
    'Flutter': SiFlutter,
    'Expo': SiExpo,
    'Android Studio': SiAndroidstudio,
    'Node.js': FaNodeJs,
    'Express': SiExpress,
    'Laravel': FaLaravel,
    'Spring Boot': SiSpringboot,
    'Python': FaPython,
    'React': FaReact,
    'JavaScript': SiJavascript,
    'HTML5': FaHtml5,
    'Tailwind CSS': SiTailwindcss,
    'Bootstrap': FaBootstrap,
    'Java': FaJava,
    'JavaScript / TS': SiTypescript,
    'C#': Code2,
    'C++': SiCplusplus,
    'PostgreSQL': SiPostgresql,
    'MySQL': SiMysql,
    'MongoDB': SiMongodb,
    'phpMyAdmin': SiPhpmyadmin,
    'Reconocimiento de Imágenes (Vision AI)': FaEye,
    'Motores de Recomendación': FaRobot,
    'Automatización N8N': SiN8N,
    'Integración LLM / Gemini': SiGoogle
  };

  const getSkillColor = (name: string, isDark: boolean) => {
    const colors: Record<string, string> = {
      'React Native': '#61DAFB',
      'Flutter': '#3db5e6',
      'Expo': isDark ? '#FFFFFF' : '#000000',
      'Android Studio': '#3DDC84',
      'Node.js': '#339939',
      'Express': isDark ? '#FFFFFF' : '#000000',
      'Laravel': '#FF2D20',
      'Spring Boot': '#6DB33F',
      'Python': '#3776AB',
      'React': '#61DAFB',
      'JavaScript': '#F7DF1E',
      'HTML5': '#E34F26',
      'Tailwind CSS': '#06B6D4',
      'Bootstrap': '#7952B3',
      'Java': '#007396',
      'JavaScript / TS': '#3178C6',
      'C#': '#239120',
      'C++': '#00599C',
      'PostgreSQL': '#4169E1',
      'MySQL': '#4479A1',
      'MongoDB': '#47A248',
      'phpMyAdmin': '#6C78AF',
      'Reconocimiento de Imágenes (Vision AI)': isDark ? '#c084fc' : '#9333ea',
      'Motores de Recomendación': isDark ? '#34d399' : '#10b981',
      'Automatización N8N': '#FF6D5A',
      'Integración LLM / Gemini': isDark ? '#60a5fa' : '#3b82f6'
    };
    return colors[name] || (isDark ? '#22d3ee' : '#0891b2');
  };

  return (
    <div id="section-core-tech" className="space-y-10 pb-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2 border-b pb-4 border-slate-800/60"
      >
        <div className="flex items-center space-x-3">
          <span className="h-3 w-1 bg-cyan-400 rounded-full animate-pulse" />
          <h1 className="text-2xl sm:text-4xl font-mono font-extrabold tracking-tight">
            <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">TECH </span>
            <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>ARSENAL</span>
          </h1>
        </div>
        <p className="font-mono text-xs sm:text-sm text-cyan-400/80">
          ● SYSTEM STATUS: OPERATIONAL // CAPABILITIES MATRIX ONLINE
        </p>
      </motion.div>

      {/* Main Arsenal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TECH_CATEGORIES.map((cat, idx) => {
          const Icon = categoryIcons[cat.title] || Code2;
          return (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`p-5 rounded-xl border transition-all duration-300 hover:border-cyan-500/60 group ${
                isDark
                  ? 'bg-[#0f172a]/90 border-slate-800 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-800/50">
                <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-mono font-bold text-slate-200">
                  {cat.title}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {cat.skills.map((s) => {
                  const SkillIcon = skillIcons[s.name] || Code2;
                  return (
                    <div
                      key={s.name}
                      onMouseEnter={() => soundFx.playHover()}
                      className={`px-3 py-1.5 rounded-lg border font-mono text-xs flex items-center justify-between space-x-3 transition-all ${
                        isDark
                          ? 'bg-[#0d1322] border-slate-700/80 hover:border-cyan-400 text-slate-200'
                          : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-cyan-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <SkillIcon 
                          className="w-3.5 h-3.5" 
                          style={{ color: getSkillColor(s.name, isDark) }}
                        />
                        <span className="font-semibold">{s.name}</span>
                      </div>
                      {s.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                          {s.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI & Neural Networks Deep Dive Card (Matching screenshot "NEURAL NETWORKS & AI") */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`p-6 rounded-xl border relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#1e1b4b] border-cyan-500/40'
            : 'bg-gradient-to-r from-cyan-50 via-indigo-50 to-purple-50 border-cyan-300'
        }`}
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded bg-fuchsia-950/80 border border-fuchsia-500/50 text-fuchsia-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-mono font-bold text-slate-100">
              NEURAL NETWORKS & AI
            </h2>
            <p className="text-xs font-mono text-fuchsia-400">
              Artificial Intelligence, Computer Vision, and Process Automation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs mt-4">
          <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#080d1a]/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center space-x-2 text-cyan-400 font-bold mb-1">
              <Cpu className="w-4 h-4" />
              <span>Computer Vision</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Image recognition, food classification in DK-Fitt, and pattern processing.
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#080d1a]/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center space-x-2 text-fuchsia-400 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Recommendation Engines</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Generation of personalized nutritional plans adapted to user needs.
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#080d1a]/80 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-1">
              <Globe className="w-4 h-4" />
              <span>N8N Automation</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Automated workflows for delivery, webhooks, and backend microservices with Python.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Languages & Certifications (Decryption Bay) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Idiomas / System Config */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`p-5 rounded-xl border font-mono ${
            isDark ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-xs text-cyan-400 font-bold mb-4 uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>LANGUAGES // SYSTEM CONFIG</span>
          </div>

          <div className="space-y-4">
            {LANGUAGES.map((lang) => (
              <div key={lang.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-200">{lang.name}</span>
                  <span className="text-cyan-400">{lang.level}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      lang.name === 'Español'
                        ? 'w-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : 'w-3/4 bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)]'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Decryption Bay: Certifications */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`p-5 rounded-xl border font-mono ${
            isDark ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center space-x-2 text-xs text-fuchsia-400 font-bold mb-4 uppercase tracking-wider">
            <Shield className="w-4 h-4" />
            <span>DECRYPTION BAY // CERTIFICATIONS</span>
          </div>

          <div className="space-y-3">
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.title}
                className="p-3 rounded-lg border border-slate-800 bg-[#0d1322] flex items-start space-x-3"
              >
                <div className="p-2 rounded bg-fuchsia-950/80 text-fuchsia-400 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{cert.title}</h4>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
