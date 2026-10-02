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
    <div className="relative overflow-hidden rounded-2xl bg-white/92 backdrop-blur-md border-2 border-water-500/40 shadow-md shadow-sky-900/5 p-6 sm:p-7 text-slate-900">
      {/* Header bar of Central Allocation Dispatch */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-sky-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-water-600 text-white flex items-center justify-center shadow-xs">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-black tracking-wider text-xs uppercase text-water-700 font-display ${language === 'ta' ? 'font-tamil' : ''}`}>
                {t.farmBrainTitle}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-water-900 border border-sky-300/80">
                {t.aiDecision}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Autonomous Hydraulic Dispatch • Root-zone dynamic model
            </p>
          </div>
        </div>

        {/* Confidence Badge & Audio Play */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg shadow-xs">
            <Clock className="w-3.5 h-3.5 text-water-600 mr-1.5" />
            <span className={`text-xs text-slate-700 font-medium mr-1.5 ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.decisionConfidence}:
            </span>
            <span className="text-xs font-black text-sky-950 font-mono tabular-nums">
              {topField.confidence}%
            </span>
          </div>

          <button
            onClick={handleVoicePlay}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
              isPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-white hover:bg-sky-50 text-slate-800 border border-sky-300'
            }`}
          >
            {isPlaying ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span className={language === 'ta' ? 'font-tamil' : ''}>{t.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-water-600" />
                <span className={language === 'ta' ? 'font-tamil' : ''}>{t.hearDecision}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Focus Body */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mt-5 items-center">
        {/* Left: Decision Summary */}
        <div className="lg:col-span-7 space-y-3.5">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-amber-50 text-amber-950 text-xs font-bold border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className={language === 'ta' ? 'font-tamil' : ''}>
              {t.prioritizeField}: {topField.name} ({topField.crop})
            </span>
            <span className="text-amber-400">•</span>
            <span className="font-mono text-amber-900 font-extrabold">{topField.priorityScore}/100 Priority</span>
          </div>

          {/* Dominant Allocation Recommendation */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-sky-950 font-display leading-snug">
              Allocate{' '}
              <span className="text-water-600 font-mono tabular-nums">
                {topField.allocation.toLocaleString()} L
              </span>{' '}
              to preserve {topField.growthStage}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl mt-2 font-normal">
              AquaTwin’s marginal water benefit model determined this field yields 
              <strong className="text-slate-900 font-bold"> maximum stress mitigation per litre</strong>. 
              Root moisture is depleted to <span className="font-extrabold text-rose-600 font-mono tabular-nums">{topField.soilMoisture}%</span> with 
              critical stress predicted in +12 hours under current thermal evapotranspiration.
            </p>
          </div>

          {/* Action Buttons: Clear Primary vs Secondary Hierarchy */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={onGoToScenarioLab}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-water-600 hover:bg-water-500 text-white font-bold text-xs transition-all shadow-xs active:scale-98"
            >
              <span>ADAPT FARM (Scenario Lab)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onExploreField?.(topField.id)}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-lg bg-white/90 hover:bg-sky-50 text-slate-800 font-bold text-xs border border-sky-300 transition-all active:scale-98 shadow-xs"
            >
              <span>Inspect Telemetry & Dossier</span>
            </button>
          </div>
        </div>

        {/* Right: Key Decision Factors */}
        <div className="lg:col-span-5 bg-sky-50/75 rounded-xl p-4.5 border border-sky-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-sky-200/70">
            <span className={`text-xs font-black text-sky-950 uppercase tracking-wider font-display ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.whyThisDecision}
            </span>
            <span className="text-xs font-mono text-slate-700">
              Benefit: <strong className="text-water-700 font-black">{topField.marginalBenefit}/100</strong>
            </span>
          </div>

          <ul className="space-y-2">
            {topField.reasons.slice(0, 4).map((reason, idx) => (
              <li key={idx} className="flex items-start text-xs text-slate-800 font-medium leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-water-600 mr-2 mt-0.5 shrink-0" />
                <span>{reason}</span>
              </li>
            ))}
            <li className="flex items-start text-xs text-slate-800 font-medium leading-relaxed pt-1.5 border-t border-sky-200/70">
              <ShieldAlert className="w-3.5 h-3.5 text-water-600 mr-2 mt-0.5 shrink-0" />
              <span>
                Resilience Reserve of{' '}
                <strong className="text-sky-950 font-mono font-black tabular-nums">
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
