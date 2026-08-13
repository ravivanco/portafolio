import React from 'react';
import { NavSection, ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { useGithubStats } from '../hooks/useGithubStats';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { soundFx } from '../../utils/sound';
import {
  Code2,
  GitCommit,
  Layers,
  FolderCheck,
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  Instagram,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Download,
  Terminal,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import fotoPerfil from '../../images/fotoPerfil.png';

interface MissionSectionProps {
  theme: ThemeMode;
  setActiveSection: (sec: NavSection) => void;
  onOpenResume: () => void;
}

export const MissionSection: React.FC<MissionSectionProps> = ({
  theme,
  setActiveSection,
  onOpenResume,
}) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { PERSONAL_INFO, EXPERIENCES } = useResumeData();
  const isDark = theme === 'dark';

  const liveStats = useGithubStats(PERSONAL_INFO.githubUsername, {
    projects: Number(PERSONAL_INFO.stats.projects.toString().replace(/\D/g, '') || 0),
    followers: Number(PERSONAL_INFO.stats.followers.toString().replace(/\D/g, '') || 0),
  });

  return (
    <div id="section-mission" className="space-y-10 pb-12">
      {/* Top Banner Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2 border-b pb-4 border-slate-800/60"
      >
        <div className="flex items-center space-x-3">
          <span className="h-3 w-1 bg-cyan-400 rounded-full animate-pulse" />
          <h1 className="text-2xl sm:text-4xl font-mono font-extrabold tracking-tight">
            <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>ABOUT-ME </span>
            <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">PROFILE</span>
          </h1>
        </div>
        <p className={`font-mono text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.general.view_specs}: {PERSONAL_INFO.title}-
        </p>
      </motion.div>

      {/* Hero / Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Live Feed Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`lg:col-span-5 rounded-xl border p-5 flex flex-col justify-between relative overflow-hidden group ${
            isDark
              ? 'bg-[#0d1322] border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              : 'bg-white border-slate-200 shadow-md'
          }`}
        >
          {/* Cyber scanlines overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

          {/* Top Live Feed Badge */}
          <div className="flex items-center justify-between mb-4 relative z-10 font-mono text-xs">
            <div className="flex items-center space-x-2 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-500/40 text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold tracking-wider">LIVE FEED // IDENTITY CONFIRMED</span>
            </div>
            <span className="text-slate-500 text-[10px]">LOC: QUITO_EC</span>
          </div>

          {/* Avatar Image Frame */}
          <div className="relative rounded-lg overflow-hidden border border-cyan-500/30 mb-4 group-hover:border-cyan-400 transition-colors">
            <img
              src={fotoPerfil}
              alt="Richard Vivanco"
              referrerPolicy="no-referrer"
              className="w-full aspect-[3/4] object-cover object-center filter contrast-105 brightness-95 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-transparent to-transparent opacity-90" />
            
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 font-mono">
              <h2 className="text-lg font-bold text-cyan-300 tracking-wider uppercase">
                {PERSONAL_INFO.shortName}
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                {PERSONAL_INFO.title}
              </p>
              <div className="flex items-center space-x-2 mt-2 text-[11px] text-cyan-400">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
            </div>
          </div>

          {/* Contact quick links */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono relative z-10">
            <a
              id="hero-github-link"
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded border flex items-center justify-center space-x-1.5 transition-colors ${
                isDark
                  ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-cyan-400 hover:text-cyan-300'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>github.com/ravivanco</span>
            </a>
            <a
              id="hero-linkedin-link"
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded border flex items-center justify-center space-x-1.5 transition-colors ${
                isDark
                  ? 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-cyan-400 hover:text-cyan-300'
                  : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-400" />
              <span>richard-vivanco</span>
            </a>
          </div>
        </motion.div>

        {/* Right Info & Bio Block */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7 flex flex-col justify-between space-y-6"
        >
          {/* Sys Overview Card */}
          <div className={`p-6 rounded-xl border relative ${
            isDark ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center space-x-2 font-mono text-xs text-cyan-400 font-bold mb-3 uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>BIO</span>
            </div>
            <p className={`text-sm sm:text-base leading-relaxed ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {PERSONAL_INFO.bio}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center space-x-2 text-fuchsia-400 font-semibold">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
                <span>&quot;{PERSONAL_INFO.motto}&quot;</span>
              </div>
              <button
                id="sys-overview-cv-btn"
                onClick={() => {
                  soundFx.playClick();
                  onOpenResume();
                }}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-bold flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD RESUME</span>
              </button>
            </div>
          </div>

          {/* Stats Bar Grid (4 key metrics matching screenshots) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-3.5 rounded-lg border text-center font-mono ${
              isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <GitCommit className="w-5 h-5 mx-auto text-cyan-400 mb-1" />
              <div className="text-xl sm:text-2xl font-extrabold text-cyan-300">
                {PERSONAL_INFO.stats.commits}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                COMMITS
              </div>
            </div>

            <div className={`p-3.5 rounded-lg border text-center font-mono ${
              isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Layers className="w-5 h-5 mx-auto text-fuchsia-400 mb-1" />
              <div className="text-xl sm:text-2xl font-extrabold text-fuchsia-300">
                {PERSONAL_INFO.stats.contributions}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                CONTRIBUTIONS
              </div>
            </div>

            <div className={`p-3.5 rounded-lg border text-center font-mono ${
              isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <FolderCheck className="w-5 h-5 mx-auto text-emerald-400 mb-1" />
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-300">
                {liveStats.projects}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                PROJECTS
              </div>
            </div>

            <div className={`p-3.5 rounded-lg border text-center font-mono ${
              isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Users className="w-5 h-5 mx-auto text-indigo-400 mb-1" />
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-300">
                {liveStats.followers}
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                FOLLOWERS
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 font-mono">
            <button
              id="initiate-core-tech-btn"
              onClick={() => {
                soundFx.playClick();
                setActiveSection('core_tech');
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-cyan-400 bg-cyan-500/10 hover:bg-cyan-400 hover:text-black text-cyan-300 font-bold transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center space-x-2"
            >
              <span>INITIATE_CORE_TECH</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="view-project-log-btn"
              onClick={() => {
                soundFx.playClick();
                setActiveSection('projects');
              }}
              onMouseEnter={() => soundFx.playHover()}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg border font-bold transition-all duration-300 flex items-center justify-center space-x-2 ${
                isDark
                  ? 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-cyan-400 hover:text-white'
                  : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              <span>VIEW_PROJECT_LOG</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Education & Degree Spotlight */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={`p-5 rounded-xl border font-mono ${
          isDark
            ? 'bg-gradient-to-r from-[#0d1322] via-[#111827] to-[#0f172a] border-cyan-500/30'
            : 'bg-gradient-to-r from-cyan-50 via-slate-50 to-indigo-50 border-cyan-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-cyan-400 font-bold tracking-wider">ACADEMIC FORMATION // DEGREE</div>
              <h3 className="text-lg font-bold text-slate-100 mt-0.5">
                Software Engineering (Graduate)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                UNIVERSIDAD DE LAS FUERZAS ARMADAS ESPE-L — Ecuador
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold">
              STATUS: GRADUATE
            </span>
          </div>
        </div>
      </motion.div>

      {/* Career Flight Path Timeline (Matching screenshot "CAREER FLIGHT_PATH") */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6 pt-4"
      >
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <span className="h-3 w-1 bg-fuchsia-400 rounded-full" />
          <h2 className="text-xl font-mono font-bold text-slate-200">
            CAREER <span className="text-fuchsia-400">FLIGHT_PATH</span>
          </h2>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-800">
          {EXPERIENCES.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Timeline Dot Indicator */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 group-hover:scale-125 group-hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.6)]" />

              {/* Experience Card */}
              <div className={`p-5 rounded-xl border transition-all duration-300 ${
                isDark
                  ? 'bg-[#0f172a]/80 border-slate-800 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                  : 'bg-white border-slate-200 shadow-sm group-hover:border-slate-400'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-mono font-bold text-cyan-300">
                      {exp.role}
                    </h3>
                    <div className="text-xs font-mono text-fuchsia-400 font-semibold">
                      {exp.company} <span className="text-slate-500">| {exp.type}</span>
                    </div>
                  </div>
                  <div className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700 self-start sm:self-auto">
                    {exp.period}
                  </div>
                </div>

                <ul className="space-y-2 mb-4 text-xs sm:text-sm text-slate-300">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-cyan-400 font-mono mt-0.5">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {exp.techUsed.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
