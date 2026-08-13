import React, { useState } from 'react';
import { ThemeMode } from '../../core/domain/entities/types';
import { useResumeData } from '../hooks/useResumeData';
import { soundFx } from '../../utils/sound';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  CheckCircle,
  Copy,
  Building,
  Terminal,
  Globe,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConnectSectionProps {
  theme: ThemeMode;
}

export const ConnectSection: React.FC<ConnectSectionProps> = ({ theme }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const { PERSONAL_INFO } = useResumeData();
  const isDark = theme === 'dark';
  
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  const handleCopyEmail = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) => 
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    soundFx.playTransmit();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append("Technologies", selectedTechs.join(", "));
    formData.append("_captcha", "false"); // Disable recaptcha to keep the custom UI flow

    try {
      const response = await fetch("https://formsubmit.co/ajax/rvivanco199@gmail.com", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        setIsSuccess(true);
        soundFx.playClick();
      } else {
        console.error("Form submission failed");
      }
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="section-connect" className="space-y-10 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-2 border-b pb-4 border-slate-800/60"
      >
        <div className="flex items-center space-x-3">
          <span className="h-3 w-1 bg-emerald-400 rounded-full animate-pulse" />
          <h1 className="text-2xl sm:text-4xl font-mono font-extrabold tracking-tight">
            <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{t.connect.title} </span>
            <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">{t.connect.subtitle}</span>
          </h1>
        </div>
        <p className={`font-mono text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.connect.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className={`p-6 rounded-xl border relative overflow-hidden ${
            isDark ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">
              <Mail className="w-4 h-4" />
              <span>{t.connect.direct_info}</span>
            </div>

            <div className="space-y-6">
              <div className={`p-3 rounded-xl border flex items-center justify-between font-mono ${isDark ? 'border-slate-800 bg-[#0d1322]' : 'border-slate-200 bg-slate-50'}`}>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.connect.email}</p>
                  <a href={`mailto:${PERSONAL_INFO.email}`} className={`font-bold hover:text-cyan-400 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {PERSONAL_INFO.email}
                  </a>
                </div>
                <button
                  onClick={handleCopyEmail}
                  title={t.connect.copy_email}
                  className="p-2.5 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className={`p-3 rounded-xl border font-mono ${isDark ? 'border-slate-800 bg-[#0d1322]' : 'border-slate-200 bg-slate-50'}`}>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.connect.phone}</p>
                <div className={`font-bold flex items-center space-x-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{PERSONAL_INFO.phone}</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border font-mono ${isDark ? 'border-slate-800 bg-[#0d1322]' : 'border-slate-200 bg-slate-50'}`}>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{t.connect.location}</p>
                <div className={`font-bold flex items-center space-x-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>{PERSONAL_INFO.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border ${
            isDark ? 'bg-[#0f172a]/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center space-x-2 text-fuchsia-400 font-mono text-xs font-bold uppercase tracking-wider mb-4">
              <Globe className="w-4 h-4" />
              <span>{t.connect.socials}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <a href={PERSONAL_INFO.github} target="_blank" rel="noreferrer" className={`p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all ${isDark ? 'border-slate-800 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                <Github className="w-4 h-4 mb-1" /> GitHub
              </a>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className={`p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all ${isDark ? 'border-slate-800 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                <Linkedin className="w-4 h-4 mb-1" /> LinkedIn
              </a>
              <a href={PERSONAL_INFO.instagram} target="_blank" rel="noreferrer" className={`p-2.5 rounded-lg border flex flex-col items-center justify-center transition-all ${isDark ? 'border-slate-800 hover:border-slate-600' : 'border-slate-200 hover:border-slate-300'}`}>
                <Instagram className="w-4 h-4 mb-1" /> Insta
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className={`p-6 rounded-2xl border font-mono ${
            isDark ? 'bg-[#0a0f1d] border-emerald-500/40' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <div className="text-center font-mono py-10">
                  <div className="w-16 h-16 rounded-full bg-cyan-950/50 border border-cyan-500 mx-auto flex items-center justify-center text-cyan-400 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {t.connect.success_title}
                  </h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
                    {t.connect.success_desc} <strong>{PERSONAL_INFO.shortName}</strong>. {t.connect.success_thanks}.
                  </p>

                  <div className={`p-4 rounded-lg inline-block border text-left space-y-2 text-xs mx-auto ${
                    isDark ? 'bg-[#060911] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    <div className="flex justify-between space-x-8">
                      <span>{t.connect.type_offer}:</span>
                      <span className={isDark ? 'text-cyan-300 font-bold' : 'text-cyan-700 font-bold'}>PRIORITY_INQUIRY</span>
                    </div>
                    <div className="flex justify-between space-x-8">
                      <span>{t.connect.range}:</span>
                      <span className={isDark ? 'text-cyan-300 font-bold' : 'text-cyan-700 font-bold'}>GLOBAL</span>
                    </div>
                    <div className="flex justify-between space-x-8">
                      <span>{t.connect.stack}:</span>
                      <span className={isDark ? 'text-cyan-300 font-bold' : 'text-cyan-700 font-bold'}>MATCH_CONFIRMED</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 text-xs font-bold"
                    >
                      {t.connect.send_another}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-3 mb-6 border-b border-slate-800/50 pb-4">
                    <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className={`text-lg font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {t.connect.form_title}
                      </h3>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">
                        {t.connect.form_desc}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5 font-mono">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {t.connect.name_label}
                        </label>
                        <input type="text" name="Name" required placeholder={t.connect.name_placeholder} className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${isDark ? 'bg-[#060911] border-slate-800 text-slate-200 placeholder-slate-600 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500'}`} />
                      </div>
                      <div>
                        <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {t.connect.email_label}
                        </label>
                        <input type="email" name="Email" required placeholder={t.connect.email_placeholder} className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${isDark ? 'bg-[#060911] border-slate-800 text-slate-200 placeholder-slate-600 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500'}`} />
                      </div>
                    </div>

                    <div>
                      <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {t.connect.company_label}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="w-4 h-4 text-slate-500" />
                        </div>
                        <input type="text" name="Company" placeholder={t.connect.company_placeholder} className={`w-full pl-10 pr-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${isDark ? 'bg-[#060911] border-slate-800 text-slate-200 placeholder-slate-600 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500'}`} />
                      </div>
                    </div>

                    <div>
                      <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {t.connect.type_label}
                      </label>
                      <select name="Proposal Type" className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none ${isDark ? 'bg-[#060911] border-slate-800 text-slate-200 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-500'}`}>
                        <option value="fulltime">{t.connect.type_fulltime}</option>
                        <option value="freelance">{t.connect.type_freelance}</option>
                        <option value="mobile">{t.connect.type_mobile}</option>
                        <option value="ai">{t.connect.type_ai}</option>
                        <option value="other">{t.connect.type_other}</option>
                      </select>
                    </div>

                    <div>
                      <label className={`text-xs font-bold block mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {t.connect.tech_label}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['React Native', 'Flutter', 'Node.js', 'Python / AI', 'React / Next.js', 'AWS / Nube'].map(tech => (
                          <button
                            key={tech}
                            type="button"
                            onClick={() => {
                              soundFx.playClick();
                              toggleTech(tech);
                            }}
                            className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                              selectedTechs.includes(tech)
                                ? isDark
                                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                                  : 'bg-cyan-100 border-cyan-500 text-cyan-900'
                                : isDark
                                  ? 'bg-[#060911] border-slate-800 text-slate-400 hover:border-cyan-500/50'
                                  : 'bg-slate-50 border-slate-300 text-slate-600 hover:border-cyan-400'
                            }`}
                          >
                            {tech}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {t.connect.details_label}
                      </label>
                      <textarea name="Details" required rows={4} placeholder={t.connect.details_placeholder} className={`w-full px-4 py-3 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none ${isDark ? 'bg-[#060911] border-slate-800 text-slate-200 placeholder-slate-600 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-500'}`} />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl border border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-400 font-bold tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Cpu className="w-5 h-5 animate-spin" />
                          <span>{t.connect.submitting}</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>{t.connect.submit_btn}</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
