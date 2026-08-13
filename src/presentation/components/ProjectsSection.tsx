import React, { useState } from 'react';
import { Project, ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { AiFoodScanner } from './AiFoodScanner';
import { soundFx } from '../../utils/sound';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { FolderGit2, ExternalLink, Github, Sparkles, Code2, Layers, Calendar, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectsSectionProps {
  theme: ThemeMode;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ theme }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { PROJECTS } = useResumeData();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState<'all' | 'mobile' | 'ai' | 'fullstack'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PROJECTS.filter((p) => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  return (
    <div id="section-projects" className="space-y-10 pb-12">
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
            <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">PROJECT_</span>
            <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>OS</span>
          </h1>
        </div>
        <p className={`font-mono text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.projects.description}
        </p>
      </motion.div>

      {/* Embedded DK-Fitt AI Scanner Interactive Demo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <AiFoodScanner theme={theme} />
      </motion.div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs pt-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: t.projects.filters.all },
            { id: 'mobile', label: t.projects.filters.mobile },
            { id: 'ai', label: t.projects.filters.ai },
            { id: 'fullstack', label: t.projects.filters.fullstack },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`project-filter-${tab.id}`}
              onClick={() => {
                soundFx.playClick();
                setFilter(tab.id as typeof filter);
              }}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all whitespace-nowrap ${
                filter === tab.id
                  ? isDark
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-cyan-600 text-white border-cyan-700'
                  : isDark
                    ? 'bg-[#0f172a] border-slate-800 text-slate-400 hover:text-cyan-300'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-slate-500 text-[11px]">
          {t.projects.showing.replace('{count}', filteredProjects.length.toString())}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className={`rounded-xl border flex flex-col justify-between overflow-hidden group transition-all duration-300 ${
              isDark
                ? 'bg-[#0f172a]/90 border-slate-800 hover:border-cyan-500/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              {/* Image Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-950 border-b border-slate-800">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />

                {/* Date Badge */}
                <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-slate-900/90 backdrop-blur-md border border-slate-700 font-mono text-[10px] text-cyan-300">
                  {project.date}
                </div>

                {/* AI Badge if applicable */}
                {project.hasAiDemo && (
                  <div className="absolute top-2 left-2">
                    <span className="flex items-center space-x-1 text-[10px] uppercase font-bold text-fuchsia-300 bg-fuchsia-950/80 px-2 py-0.5 rounded border border-fuchsia-500/50">
                      <Sparkles className="w-3 h-3" />
                      <span>FEATURED PROJECT</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-5 space-y-3 font-mono">
                <div>
                  <h3 className="text-xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-1 line-clamp-2">
                    {project.subtitle}
                  </p>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                  {project.bullets.slice(0, 2).map((b, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-cyan-400 font-mono text-xs">•</span>
                      <span className="line-clamp-2">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Footer Tech Tags & CTA */}
            <div className="p-5 pt-0 space-y-4 font-mono">
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs">
                <button
                  id={`project-details-${project.id}`}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedProject(project);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center space-x-1"
                >
                  <span>{t.general.view_specs}</span>
                </button>

                {project.githubUrl && (
                  <a
                    id={`project-github-${project.id}`}
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    title={t.general.view_code}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 font-mono space-y-6 ${
                isDark ? 'bg-[#0a0f1d] border-cyan-500/50 text-slate-200' : 'bg-white text-slate-900 border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-cyan-400 font-bold tracking-widest uppercase">
                    PROJECT NODE // SPECIFICATIONS
                  </div>
                  <h2 className="text-2xl font-bold text-cyan-300 mt-1">{selectedProject.title}</h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">{selectedProject.subtitle}</p>
                </div>

                <button
                  id="close-project-modal-btn"
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-sans text-sm">
                <div>
                  <h4 className="font-mono text-xs text-cyan-400 font-bold uppercase mb-1">
                    {t.projects.modal.description}:
                  </h4>
                  <p className="text-slate-300 leading-relaxed">{selectedProject.description}</p>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-cyan-400 font-bold uppercase mb-2">
                    {t.projects.modal.features}:
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start space-x-2 text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-mono text-xs text-cyan-400 font-bold uppercase mb-2">
                    {t.projects.modal.tech}:
                  </h4>
                  <div className="flex flex-wrap gap-2 font-mono text-xs">
                    {selectedProject.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800">
                {selectedProject.githubUrl && (
                  <a
                    id="modal-project-github-btn"
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>{t.general.view_code}</span>
                  </a>
                )}
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg border border-cyan-500 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{t.general.view_project}</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
