import React, { useEffect, useRef, useState } from 'react';
import { soundFx } from '../../utils/sound';
import { Camera, RotateCcw, Sparkles, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../../utils/i18n';
import { Language } from '../../core/domain/entities/types';

interface MealSample {
  id: string;
  name: Record<Language, string>;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: number;
  tags: Record<Language, string[]>;
  recommendation: Record<Language, string>;
}

const SAMPLE_MEALS: MealSample[] = [
  {
    id: 'meal-1',
    name: { es: 'Tostada de Aguacate y Huevo Pochado', en: 'Avocado Toast with Poached Egg' },
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=70',
    calories: 380,
    protein: 16,
    carbs: 28,
    fats: 22,
    confidence: 96.8,
    tags: {
      es: ['Aguacate', 'Huevo', 'Pan Integral', 'Semillas de Chía'],
      en: ['Avocado', 'Egg', 'Whole-grain Bread', 'Chia Seeds'],
    },
    recommendation: {
      es: 'Excelente balance de grasas saludables (Omega-3) y carbohidratos complejos. Ideal para desayuno premovilidad.',
      en: 'Excellent balance of healthy fats (Omega-3) and complex carbohydrates. Ideal as a pre-activity breakfast.',
    },
  },
  {
    id: 'meal-2',
    name: { es: 'Bowl de Salmón a la Parrilla y Quinua', en: 'Grilled Salmon and Quinoa Bowl' },
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=70',
    calories: 520,
    protein: 42,
    carbs: 45,
    fats: 18,
    confidence: 98.4,
    tags: {
      es: ['Salmón', 'Quinua Real', 'Aguacate', 'Edamame'],
      en: ['Salmon', 'Royal Quinoa', 'Avocado', 'Edamame'],
    },
    recommendation: {
      es: 'Óptimo para recuperación post-entrenamiento por su alto perfil proteico y carbohidratos de bajo índice glucémico.',
      en: 'Optimal for post-workout recovery thanks to its high protein profile and low-glycemic carbohydrates.',
    },
  },
  {
    id: 'meal-3',
    name: { es: 'Smoothie Proteico de Frutos Rojos', en: 'Berry Protein Smoothie' },
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=70',
    calories: 290,
    protein: 26,
    carbs: 34,
    fats: 5,
    confidence: 94.2,
    tags: {
      es: ['Whey Protein', 'Arándanos', 'Leche de Almendras', 'Espinaca'],
      en: ['Whey Protein', 'Blueberries', 'Almond Milk', 'Spinach'],
    },
    recommendation: {
      es: 'Batido rico en antioxidantes y rápida absorción de aminoácidos para síntesis muscular.',
      en: 'A shake rich in antioxidants with fast amino-acid absorption for muscle synthesis.',
    },
  },
];

export const AiFoodScanner: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].scanner;
  const [selected, setSelected] = useState<MealSample>(SAMPLE_MEALS[0]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [progress, setProgress] = useState(0);
  const timer = useRef<number>();

  useEffect(() => () => window.clearInterval(timer.current), []);

  const startScan = (meal: MealSample) => {
    window.clearInterval(timer.current);
    soundFx.playTransmit();
    setSelected(meal);
    setScanning(true);
    setScanned(false);
    setProgress(0);
    let p = 0;
    timer.current = window.setInterval(() => {
      p = Math.min(100, p + 9);
      setProgress(p);
      if (p >= 100) {
        window.clearInterval(timer.current);
        setScanning(false);
        setScanned(true);
        soundFx.playClick();
      }
    }, 110);
  };

  const macros = [
    { label: t.protein, value: selected.protein, color: 'bg-signal' },
    { label: t.carbs, value: selected.carbs, color: 'bg-warn' },
    { label: t.fats, value: selected.fats, color: 'bg-ok' },
  ];
  const macroMax = Math.max(...macros.map((m) => m.value));

  return (
    <div className="border border-line-strong bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <Camera className="h-4 w-4 text-signal" aria-hidden="true" />
          <h3 className="text-base font-semibold text-ink">{t.title}</h3>
        </div>
        <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-ok">
          <span className="pulse-dot h-1.5 w-1.5 bg-ok" />
          {t.engine}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-line p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <div className="relative aspect-[4/3] overflow-hidden bg-ground">
            <img
              key={selected.id}
              src={selected.imageUrl}
              alt={selected.name[language]}
              referrerPolicy="no-referrer"
              className={`h-full w-full object-cover transition-[filter] duration-500 ${scanning ? 'brightness-50 contrast-125 saturate-50' : ''}`}
            />

            {scanning && (
              <div className="absolute inset-0 overflow-hidden" role="status" aria-live="polite">
                <div className="scan-sweep absolute inset-x-0 top-0 h-1/3 border-b border-signal bg-gradient-to-b from-transparent to-signal/25" />
                <p className="tabular absolute bottom-3 left-3 bg-ground/90 px-2 py-1 font-mono text-[11px] text-signal">
                  {t.processing}… {progress}%
                </p>
              </div>
            )}

            {scanned && (
              <motion.div
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="ticks pointer-events-none absolute inset-5 flex flex-col justify-between border border-dashed border-signal/70 p-2"
              >
                <span className="w-max max-w-full truncate bg-ground/90 px-2 py-0.5 font-mono text-[10px] text-signal">
                  {t.detected}: {selected.name[language]} <span className="text-ok">{selected.confidence}% {t.conf}</span>
                </span>
                <span className="tabular w-max self-end bg-ground/90 px-2 py-0.5 font-mono text-[10px] text-ink">
                  {selected.calories} kcal
                </span>
              </motion.div>
            )}

            {!scanning && !scanned && (
              <button
                id="scan-meal-btn"
                type="button"
                onClick={() => startScan(selected)}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ground/55 transition-colors duration-300 hover:bg-ground/35"
              >
                <span className="flex h-12 w-12 items-center justify-center bg-signal text-signal-ink">
                  <Camera className="h-5 w-5" />
                </span>
                <span className="bg-ground px-3 py-1.5 text-sm font-semibold text-signal">{t.start}</span>
              </button>
            )}
          </div>

          <p className="mt-4 font-mono text-[11px] tracking-[0.12em] text-faint">{t.pick}</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {SAMPLE_MEALS.map((meal) => (
              <button
                key={meal.id}
                id={`meal-select-${meal.id}`}
                type="button"
                aria-pressed={selected.id === meal.id}
                onClick={() => startScan(meal)}
                className={`border p-1 text-left transition-colors duration-200 ${
                  selected.id === meal.id ? 'border-signal' : 'border-line hover:border-line-strong'
                }`}
              >
                <img src={meal.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" className="h-14 w-full object-cover sm:h-16" />
                <span className="mt-1 block truncate px-0.5 text-[11px] font-medium text-muted">{meal.name[language]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-[320px] flex-col p-4 sm:p-5">
          <p className="font-mono text-[11px] tracking-[0.12em] text-faint">{t.results}</p>
          <AnimatePresence mode="wait">
            {scanned ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3 flex flex-1 flex-col gap-5"
              >
                <div className="flex items-end justify-between border-b border-line pb-4">
                  <div>
                    <p className="font-mono text-[11px] text-muted">{t.energy}</p>
                    <p className="tabular font-display text-3xl font-bold text-ink">
                      {selected.calories} <span className="text-sm font-medium text-muted">kcal</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-[11px] text-muted">{t.confidence}</p>
                    <p className="tabular font-mono text-lg text-ok">{selected.confidence}%</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {macros.map((m) => (
                    <li key={m.label} className="grid grid-cols-[88px_1fr_44px] items-center gap-3 font-mono text-xs">
                      <span className="text-muted">{m.label}</span>
                      <span className="h-[3px] bg-line">
                        <span className={`block h-full ${m.color}`} style={{ width: `${(m.value / macroMax) * 100}%` }} />
                      </span>
                      <span className="tabular text-right text-ink">{m.value}g</span>
                    </li>
                  ))}
                </ul>

                <div>
                  <p className="font-mono text-[11px] text-muted">{t.ingredients}</p>
                  <p className="mt-1.5 text-sm text-ink">{selected.tags[language].join(' · ')}</p>
                </div>

                <div className="border-t border-dream/40 pt-4">
                  <p className="flex items-center gap-2 font-mono text-[11px] text-dream">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.advice}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{selected.recommendation[language]}</p>
                </div>

                <button
                  type="button"
                  onClick={() => startScan(selected)}
                  className="mt-auto inline-flex h-10 w-max items-center gap-2 border border-line px-3 text-sm text-muted transition-colors duration-200 hover:border-signal hover:text-signal"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  {t.rescan}
                </button>
              </motion.div>
            ) : (
              <div key="empty" className="mt-3 flex flex-1 flex-col items-center justify-center gap-3 border border-dashed border-line p-6 text-center">
                <Utensils className="h-8 w-8 text-faint" aria-hidden="true" />
                <p className="max-w-xs text-sm text-muted">{t.empty}</p>
              </div>
            )}
          </AnimatePresence>
          <p className="mt-4 font-mono text-[10px] text-faint">{t.demo_note}</p>
        </div>
      </div>
    </div>
  );
};
