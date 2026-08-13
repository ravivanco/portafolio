import React, { useState } from 'react';
import { ThemeMode } from '../../core/domain/entities/types';
import { soundFx } from '../../utils/sound';
import { Camera, Sparkles, CheckCircle2, RotateCcw, Activity, Apple, Utensils, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AiFoodScannerProps {
  theme: ThemeMode;
}

interface MealSample {
  id: string;
  name: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: number;
  tags: string[];
  recommendation: string;
}

const SAMPLE_MEALS: MealSample[] = [
  {
    id: 'meal-1',
    name: 'Tostada de Aguacate y Huevo Pochado',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    calories: 380,
    protein: 16,
    carbs: 28,
    fats: 22,
    confidence: 96.8,
    tags: ['Aguacate', 'Huevo', 'Pan Integral', 'Semillas de Chía'],
    recommendation: 'Excelente balance de grasas saludables (Omega-3) y carbohidratos complejos. Ideal para desayuno premovilidad.'
  },
  {
    id: 'meal-2',
    name: 'Bowl de Salmón a la Parrilla y Quinua',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    calories: 520,
    protein: 42,
    carbs: 45,
    fats: 18,
    confidence: 98.4,
    tags: ['Salmón', 'Quinua Real', 'Aguacate', 'Edamame'],
    recommendation: 'Óptimo para recuperación post-entrenamiento por su alto perfil proteico y carbohidratos de bajo índice glucémico.'
  },
  {
    id: 'meal-3',
    name: 'Smoothie Proteico de Frutos Rojos',
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    calories: 290,
    protein: 26,
    carbs: 34,
    fats: 5,
    confidence: 94.2,
    tags: ['Whey Protein', 'Arándanos', 'Leche de Almendras', 'Espinaca'],
    recommendation: 'Batido rico en antioxidantes y rápida absorción de aminoácidos para síntesis muscular.'
  }
];

export const AiFoodScanner: React.FC<AiFoodScannerProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [selectedMeal, setSelectedMeal] = useState<MealSample>(SAMPLE_MEALS[0]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const handleStartScan = (meal: MealSample) => {
    soundFx.playTransmit();
    setSelectedMeal(meal);
    setScanning(true);
    setScanned(false);
    setScanProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setScanning(false);
        setScanned(true);
        soundFx.playClick();
      }
    }, 150);
  };

  return (
    <div className={`p-6 rounded-2xl border font-mono transition-all ${
      isDark
        ? 'bg-[#0a0f1d] border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
        : 'bg-slate-900 text-white border-slate-700 shadow-xl'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-cyan-500/30">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-400 text-cyan-300">
            <Camera className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest">
              DEMO INTERACTIVA // PROJECT DK-FITT
            </div>
            <h3 className="text-lg font-bold text-white">
              Escáner Nutricional con IA Vision
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-500/40 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>MOTOR IA CONECTADO</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Camera Screen */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs text-slate-400 font-bold mb-2">
            1. SELECCIONA O SIMULA FOTO DE ALIMENTO:
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_MEALS.map((meal) => (
              <button
                key={meal.id}
                id={`meal-select-${meal.id}`}
                onClick={() => handleStartScan(meal)}
                className={`p-1.5 rounded-lg border text-left transition-all ${
                  selectedMeal.id === meal.id
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-600'
                }`}
              >
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-16 object-cover rounded mb-1"
                />
                <div className="text-[10px] text-slate-300 truncate font-sans font-semibold">
                  {meal.name}
                </div>
              </button>
            ))}
          </div>

          {/* Scanner Viewport */}
          <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/50 bg-black aspect-video flex items-center justify-center group">
            <img
              src={selectedMeal.imageUrl}
              alt={selectedMeal.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-300 ${
                scanning ? 'brightness-50 filter contrast-125' : ''
              }`}
            />

            {/* Bounding box simulation when scanned */}
            {scanned && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-6 border-2 border-dashed border-cyan-400 rounded-lg pointer-events-none flex flex-col justify-between p-2 shadow-[0_0_20px_rgba(6,182,212,0.8)]"
              >
                <div className="flex justify-between items-center text-[10px] bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400 w-max">
                  <span>DETECTADO: {selectedMeal.name}</span>
                  <span className="ml-2 font-bold text-emerald-400">
                    {selectedMeal.confidence}% CONF
                  </span>
                </div>
                <div className="text-right text-[10px] bg-slate-900/90 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/50 w-max self-end">
                  {selectedMeal.calories} kcal
                </div>
              </motion.div>
            )}

            {/* Scanning line animation */}
            {scanning && (
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-cyan-400/40 to-transparent animate-pulse flex flex-col justify-between p-4">
                <div className="h-1 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] w-full animate-bounce" />
                <div className="text-center bg-slate-900/90 text-cyan-300 px-3 py-1.5 rounded border border-cyan-500 text-xs font-bold self-center">
                  PROCESANDO IMAGEN CON VISIÓN IA... {scanProgress}%
                </div>
              </div>
            )}

            {!scanning && !scanned && (
              <button
                id="scan-meal-btn"
                onClick={() => handleStartScan(selectedMeal)}
                className="absolute inset-0 bg-black/50 hover:bg-black/30 backdrop-blur-[2px] transition-all flex flex-col items-center justify-center space-y-2 group"
              >
                <div className="p-3 rounded-full bg-cyan-500 text-black group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-cyan-300 bg-slate-900 px-3 py-1 rounded border border-cyan-500">
                  INICIAR ESCANEO NUTRIONAL
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Right Nutrition Metrics & Recommendation Output */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="text-xs text-slate-400 font-bold">
            2. RESULTADOS DE ANÁLISIS NUTRICIONAL:
          </div>

          <AnimatePresence mode="wait">
            {scanned ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 flex-1"
              >
                {/* Total Calories Banner */}
                <div className="p-4 rounded-xl border border-cyan-500/40 bg-cyan-950/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-cyan-400 font-bold">ENERGÍA ESTIMADA</div>
                    <div className="text-2xl font-extrabold text-cyan-300">
                      {selectedMeal.calories} <span className="text-sm text-slate-400">kcal</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-emerald-400 font-bold">CONFIANZA IA:</span>
                    <div className="text-sm font-extrabold text-white">{selectedMeal.confidence}%</div>
                  </div>
                </div>

                {/* Macro Distribution Bars */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900">
                    <div className="text-fuchsia-400 font-bold">PROTEÍNAS</div>
                    <div className="text-base font-extrabold text-white">{selectedMeal.protein}g</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900">
                    <div className="text-amber-400 font-bold">CARBOS</div>
                    <div className="text-base font-extrabold text-white">{selectedMeal.carbs}g</div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-800 bg-slate-900">
                    <div className="text-emerald-400 font-bold">GRASAS</div>
                    <div className="text-base font-extrabold text-white">{selectedMeal.fats}g</div>
                  </div>
                </div>

                {/* Ingredients Detected */}
                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 font-bold">INGREDIENTES IDENTIFICADOS:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMeal.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[11px]"
                      >
                        ✓ {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gemini Recommendation Box */}
                <div className="p-3.5 rounded-lg border border-fuchsia-500/40 bg-fuchsia-950/20 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-fuchsia-300 font-bold">
                    <Sparkles className="w-4 h-4 text-fuchsia-400" />
                    <span>RECOMENDACIÓN NUTRICIONISTA IA:</span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {selectedMeal.recommendation}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center text-center space-y-3 flex-1">
                <Utensils className="w-10 h-10 text-slate-600" />
                <p className="text-xs text-slate-400 max-w-xs">
                  Haz clic en &quot;Iniciar Escaneo&quot; para simular la detección visual de DK-Fitt y consultar métricas de macronutrientes.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
