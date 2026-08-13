import React, { useState } from 'react';
import { BlogPost, ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { useLanguage } from '../context/LanguageContext';
import { soundFx } from '../../utils/sound';
import { BookOpen, Search, Clock, Tag, X, Share2, Sparkles, User, Github, Linkedin, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BlogSectionProps {
  theme: ThemeMode;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ theme }) => {
  const { language } = useLanguage();
  const { BLOG_POSTS, PERSONAL_INFO } = useResumeData();
  const isDark = theme === 'dark';
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const categories = ['Todos', 'Mobile', 'AI & ML', 'Backend', 'Cybersecurity'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="section-archive" className="space-y-10 pb-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2 border-b pb-4 border-slate-800/60"
      >
        <div className="flex items-center space-x-3">
          <span className="h-3 w-1 bg-fuchsia-400 rounded-full animate-pulse" />
          <h1 className="text-2xl sm:text-4xl font-mono font-extrabold tracking-tight">
            <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>RESEARCH </span>
            <span className="text-fuchsia-400 drop-shadow-[0_0_12px_rgba(217,70,239,0.5)]">LOGS</span>
          </h1>
        </div>
        <p className={`font-mono text-xs sm:text-sm max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Record of research, technical reflections, and key learnings in mobile development, AI, and software architecture.
        </p>
      </motion.div>

      {/* Search and Category Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="blog-search-input"
            type="text"
            placeholder="Buscar por palabra clave, stack o concepto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-lg border transition-all font-sans text-xs ${
              isDark
                ? 'bg-[#0d1322] border-slate-800 text-slate-200 focus:border-fuchsia-400 focus:outline-none'
                : 'bg-white border-slate-300 text-slate-800 focus:border-fuchsia-600 focus:outline-none'
            }`}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`blog-category-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? isDark
                    ? 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.3)]'
                    : 'bg-fuchsia-600 text-white border-fuchsia-700'
                  : isDark
                    ? 'bg-[#0f172a] border-slate-800 text-slate-400 hover:text-fuchsia-300'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post, idx) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className={`p-6 rounded-xl border flex flex-col justify-between transition-all duration-300 hover:border-fuchsia-500/60 group ${
              isDark
                ? 'bg-[#0f172a]/90 border-slate-800 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)]'
                : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-[11px]">
                <span className="px-2.5 py-0.5 rounded bg-fuchsia-950/80 border border-fuchsia-500/40 text-fuchsia-300 font-bold">
                  {post.category}
                </span>
                <div className="flex items-center space-x-2 text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-100 group-hover:text-fuchsia-300 transition-colors line-clamp-2">
                {post.title}
              </h2>

              <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-3">
                {post.summary}
              </p>
            </div>

            <div className="space-y-4 pt-4 mt-4 border-t border-slate-800/60 font-mono">
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                {post.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <button
                id={`read-article-btn-${post.id}`}
                onClick={() => {
                  soundFx.playClick();
                  setActivePost(post);
                }}
                className="w-full py-2 rounded-lg border border-fuchsia-500/40 bg-fuchsia-950/30 hover:bg-fuchsia-500 hover:text-black text-fuchsia-300 font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>LEER ARTÍCULO COMPLETO</span>
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Article Reader Modal */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 font-mono space-y-6 ${
                isDark ? 'bg-[#0a0f1d] border-fuchsia-500/50 text-slate-200' : 'bg-white text-slate-900 border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-fuchsia-950 border border-fuchsia-400 text-fuchsia-300 font-bold">
                      {activePost.category}
                    </span>
                    <span className="text-slate-500">• {activePost.readTime}</span>
                    <span className="text-slate-500">• {activePost.date}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-fuchsia-300 mt-2">{activePost.title}</h2>
                </div>

                <button
                  id="close-blog-modal-btn"
                  onClick={() => setActivePost(null)}
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Author badge */}
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-800 bg-[#0d1322] text-xs">
                <User className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="font-bold text-cyan-300">{PERSONAL_INFO.fullName}</span>
                  <span className="text-slate-500 block text-[11px]">{PERSONAL_INFO.title}</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="prose prose-invert prose-cyan max-w-none text-xs sm:text-sm font-sans space-y-4 leading-relaxed text-slate-300 whitespace-pre-line">
                {activePost.content}
              </div>

              {/* Tags and Footer Actions */}
              <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} flex items-center justify-between`}>
                <div className="flex items-center space-x-2 font-mono text-xs">
                  <img src={`https://github.com/${PERSONAL_INFO.githubUsername}.png`} alt={PERSONAL_INFO.shortName} className="w-5 h-5 rounded-full border border-slate-600" />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{PERSONAL_INFO.shortName}</span>
                </div>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setActivePost(null);
                  }}
                  className="font-mono text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 uppercase tracking-wider"
                >
                  <span>READ LOG</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
