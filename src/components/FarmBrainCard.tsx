import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Volume2, 
  ShieldAlert,
  Droplets,
  Sprout,
  Clock,
  Square
} from 'lucide-react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { speakText, stopSpeech, buildDecisionBriefText } from '../services/speechService';

interface FarmBrainCardProps {
  farmState: FarmState;
  language: Language;
  onExploreField?: (fieldId: string) => void;
  onGoToScenarioLab?: () => void;
}

export const FarmBrainCard: React.FC<FarmBrainCardProps> = ({
  farmState,
  language,
  onExploreField,
  onGoToScenarioLab,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = translations[language];

  // Find top priority field
  const sorted = [...farmState.fields].sort((a, b) => b.priorityScore - a.priorityScore);
  const topField = sorted[0];

  const handleVoicePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      const brief = buildDecisionBriefText(farmState, language);
      speakText(
        brief,
        language,
        () => setIsPlaying(true),
        () => setIsPlaying(false)
      );
    }
  };

  if (!topField) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-eco-950 via-eco-900 to-slate-900 text-white shadow-xl border border-eco-700/50 p-6 sm:p-8">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-aqua-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-emerald-600/10 blur-3xl pointer-events-none" />

      {/* Header bar of Farm Brain */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-eco-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-aqua-400 to-emerald-500 flex items-center justify-center text-eco-950 shadow-md">
            <Brain className="w-5 h-5 text-eco-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-extrabold tracking-wider text-xs uppercase text-aqua-300 ${language === 'ta' ? 'font-tamil' : ''}`}>
                {t.farmBrainTitle}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-aqua-400/20 text-aqua-300 border border-aqua-400/40">
                {t.aiDecision}
              </span>
            </div>
            <p className="text-xs text-eco-200/90 font-medium">
              Autonomous water allocation intelligence • Root-zone decision model
            </p>
          </div>
        </div>

        {/* Confidence Badge & Audio Play */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-eco-900/90 border border-eco-700/70 px-3.5 py-1.5 rounded-xl shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-aqua-400 mr-2" />
            <span className={`text-[11px] text-eco-200 mr-1.5 ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.decisionConfidence}:
            </span>
            <span className="text-xs font-extrabold text-aqua-300 font-mono">
              {topField.confidence}%
            </span>
          </div>

          <button
            onClick={handleVoicePlay}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs ${
              isPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-aqua-500/20 hover:bg-aqua-500/30 text-aqua-200 border border-aqua-400/50'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span className={language === 'ta' ? 'font-tamil' : ''}>{t.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-aqua-300" />
                <span className={language === 'ta' ? 'font-tamil' : ''}>{t.hearDecision}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Focus Body */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
        {/* Left: Decision Summary (Visually Dominant) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className={language === 'ta' ? 'font-tamil' : ''}>
              {t.prioritizeField}: {topField.name} ({topField.crop})
            </span>
            <span className="text-amber-400/60">•</span>
            <span className="font-mono">{topField.priorityScore}/100 Priority</span>
          </div>

          {/* Dominant Allocation Recommendation */}
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Allocate{' '}
              <span className="text-aqua-300 font-mono underline decoration-aqua-400/50 decoration-2 underline-offset-6">
                {topField.allocation.toLocaleString()} L
              </span>{' '}
              to preserve {topField.growthStage}
            </h3>
            <p className="text-xs sm:text-sm text-eco-100/90 leading-relaxed max-w-2xl mt-2.5">
              AquaTwin’s marginal water benefit model determined this field yields 
              <strong className="text-white font-semibold"> maximum stress mitigation per litre</strong>. 
              Root moisture is depleted to <span className="font-bold text-rose-300 font-mono">{topField.soilMoisture}%</span> with 
              critical stress predicted in +12 hours under current thermal evapotranspiration.
            </p>
          </div>

          {/* Quick Action CTA buttons */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => onExploreField?.(topField.id)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-aqua-500 hover:bg-aqua-400 text-eco-950 font-bold text-xs transition-all shadow-md active:scale-98"
            >
              <span>Inspect Telemetry & Why</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onGoToScenarioLab}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-eco-900/90 hover:bg-eco-800 text-eco-100 font-semibold text-xs border border-eco-700/80 transition-all active:scale-98"
            >
              <span>Test Drought/Rain Scenarios</span>
            </button>
          </div>
        </div>

        {/* Right: Key Decision Factors (Explainable AI checklist) */}
        <div className="lg:col-span-5 bg-eco-950/80 rounded-2xl p-5 border border-eco-700/70 shadow-inner">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-eco-800/80">
            <span className={`text-xs font-extrabold text-aqua-300 uppercase tracking-wider ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.whyThisDecision}
            </span>
            <span className="text-[11px] font-mono text-eco-300 font-medium">
              Marginal Benefit: <strong className="text-emerald-400 font-bold">{topField.marginalBenefit}/100</strong>
            </span>
          </div>

          <ul className="space-y-2.5">
            {topField.reasons.slice(0, 4).map((reason, idx) => (
              <li key={idx} className="flex items-start text-xs text-eco-100 leading-normal">
                <CheckCircle2 className="w-4 h-4 text-aqua-400 mr-2.5 mt-0.5 shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
            <li className="flex items-start text-xs text-eco-100 leading-normal pt-1 border-t border-eco-800/60">
              <ShieldAlert className="w-4 h-4 text-emerald-400 mr-2.5 mt-0.5 shrink-0" />
              <span>
                Resilience Reserve of{' '}
                <strong className="text-white font-mono font-bold">
                  {farmState.waterBudget.reserveWater.toLocaleString()} L
                </strong>{' '}
                simultaneously locked to guard against forecast failure.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
