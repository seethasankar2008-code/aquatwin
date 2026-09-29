import React from 'react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { MetricRibbon } from '../components/MetricRibbon';
import { FarmBrainCard } from '../components/FarmBrainCard';
import { DigitalTwinGrid } from '../components/DigitalTwinGrid';
import { FarmFutureTrajectory } from '../components/FarmFutureTrajectory';
import { AiInsightsFeed } from '../components/AiInsightsFeed';
import { WhatChangedCard } from '../components/WhatChangedCard';
import { InsightEvent } from '../types/farm';
import { Sparkles, SlidersHorizontal, ArrowRight, Sprout } from 'lucide-react';

interface CommandCenterPageProps {
  farmState: FarmState;
  language: Language;
  insights: InsightEvent[];
  onSelectField: (fieldId: string) => void;
  onNavigateToScenarioLab: () => void;
  onOpenFarmSetup?: () => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({
  farmState,
  language,
  insights,
  onSelectField,
  onNavigateToScenarioLab,
  onOpenFarmSetup,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Mission Statement Ribbon */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-eco-950 via-eco-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-eco-700/60">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-aqua-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-aqua-500/20 text-aqua-300 border border-aqua-400/40 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-aqua-400" />
              <span>HACK4VALUES • HARMONY WITH NATURE (ECO-CENTRIC AGRICULTURE)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              AquaTwin{' '}
              <span className={`text-aqua-300 font-serif italic text-xl sm:text-2xl font-normal block sm:inline ${language === 'ta' ? 'font-tamil not-italic' : ''}`}>
                — {t.tagline}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-eco-100/90 max-w-2xl mt-2 leading-relaxed font-normal">
              {t.subTagline}. Given limited agricultural water and uncertain meteorological forecasts, AquaTwin continuously answers: 
              <strong className="text-white font-semibold"> where should every available litre go?</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {onOpenFarmSetup && (
              <button
                onClick={onOpenFarmSetup}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm border border-white/20 shadow-md transition-all active:scale-98"
                title="Configure custom farm and fields"
              >
                <Sprout className="w-4 h-4 text-aqua-300" />
                <span>{farmState.farmProfile ? 'Reconfigure Farm' : '+ Setup My Farm'}</span>
              </button>
            )}
            <button
              onClick={onNavigateToScenarioLab}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-aqua-500 hover:bg-aqua-400 text-eco-950 font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-98"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Launch Scenario Lab</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
            <div className="px-4 py-2.5 bg-eco-950/70 rounded-2xl border border-eco-700/70 text-[11px] text-eco-200 text-center shadow-inner">
              <span className="font-mono font-extrabold text-white text-sm block">
                {farmState.waterBudget.availableWater.toLocaleString()} L
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-tight">Available Water Pool</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 6 Key Metrics Ribbon */}
      <MetricRibbon farmState={farmState} language={language} />

      {/* What Changed Panel (if state adapted from baseline) */}
      {farmState.activeScenario !== 'BASELINE' && (
        <WhatChangedCard farmState={farmState} language={language} />
      )}

      {/* FARM BRAIN (Primary focal point) */}
      <FarmBrainCard
        farmState={farmState}
        language={language}
        onExploreField={onSelectField}
        onGoToScenarioLab={onNavigateToScenarioLab}
      />

      {/* Digital Farm Twin Preview */}
      <div className="bg-slate-50/70 p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs">
        <DigitalTwinGrid
          fields={farmState.fields}
          language={language}
          onSelectField={onSelectField}
        />
      </div>

      {/* Farm Future Horizon + Live AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <FarmFutureTrajectory fields={farmState.fields} language={language} />
        </div>
        <div className="lg:col-span-4">
          <AiInsightsFeed insights={insights} language={language} />
        </div>
      </div>
    </div>
  );
};
