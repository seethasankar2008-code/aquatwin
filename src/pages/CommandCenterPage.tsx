import React from 'react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { MetricRibbon } from '../components/MetricRibbon';
import { FarmBrainCard } from '../components/FarmBrainCard';
import { DigitalTwinGrid } from '../components/DigitalTwinGrid';
import { FarmFutureTrajectory } from '../components/FarmFutureTrajectory';
import { AiInsightsFeed } from '../components/AiInsightsFeed';
import { WhatChangedCard } from '../components/WhatChangedCard';
import { LiveWeatherCard } from '../components/LiveWeatherCard';
import { LiveWeatherResult } from '../services/weatherService';
import { InsightEvent } from '../types/farm';
import { SlidersHorizontal, ArrowRight, Sprout } from 'lucide-react';

interface CommandCenterPageProps {
  farmState: FarmState;
  language: Language;
  insights: InsightEvent[];
  onSelectField: (fieldId: string) => void;
  onNavigateToScenarioLab: () => void;
  onOpenFarmSetup?: () => void;
  liveWeather?: LiveWeatherResult | null;
  isWeatherLoading?: boolean;
  onRefreshWeather?: () => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({
  farmState,
  language,
  insights,
  onSelectField,
  onNavigateToScenarioLab,
  onOpenFarmSetup,
  liveWeather,
  isWeatherLoading,
  onRefreshWeather,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* Clean Page Title & Supporting Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-sky-200/80">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-sky-950 font-display">
              {t.navCommandCenter}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-water-800 border border-sky-300/80">
              <span className="w-1.5 h-1.5 rounded-full bg-water-500 mr-1.5" />
              {farmState.farmProfile ? farmState.farmProfile.farmName : 'Live Optimization'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-medium">
            {t.subTagline}. Autonomous water allocation allocating every litre across active crops under meteorological uncertainty.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          {onOpenFarmSetup && (
            <button
              onClick={onOpenFarmSetup}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-white/90 hover:bg-sky-50 text-slate-800 font-bold text-xs border border-sky-300 shadow-xs transition-all active:scale-98"
              title="Configure custom farm and fields"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>{farmState.farmProfile ? 'Reconfigure Farm' : '+ Setup My Farm'}</span>
            </button>
          )}
          <button
            onClick={onNavigateToScenarioLab}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-water-600 hover:bg-water-500 text-white font-bold text-xs shadow-xs transition-all active:scale-98"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-white" />
            <span>Scenario Lab</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* FARM BRAIN (Primary visual focal point - What to do & Why) */}
      <FarmBrainCard
        farmState={farmState}
        language={language}
        onExploreField={onSelectField}
        onGoToScenarioLab={onNavigateToScenarioLab}
      />

      {/* What Changed Panel (if state adapted from baseline) */}
      {farmState.activeScenario !== 'BASELINE' && (
        <WhatChangedCard farmState={farmState} language={language} />
      )}

      {/* Real-Time Environmental Inputs: Open-Meteo Weather Status */}
      <LiveWeatherCard
        weatherResult={liveWeather || null}
        isLoading={Boolean(isWeatherLoading)}
        onRefresh={onRefreshWeather || (() => {})}
        language={language}
      />

      {/* Supporting Key Metrics Ribbon */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-xs font-black text-sky-950 uppercase tracking-wider">
            Hydraulic & Meteorological Telemetry
          </h2>
          <span className="text-[11px] text-slate-700 font-mono font-bold">
            Pool: {farmState.waterBudget.availableWater.toLocaleString()} L
          </span>
        </div>
        <MetricRibbon farmState={farmState} language={language} />
      </div>

      {/* Digital Farm Twin Preview */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5">
        <DigitalTwinGrid
          fields={farmState.fields}
          language={language}
          onSelectField={onSelectField}
        />
      </div>

      {/* Farm Future Horizon + Live AI Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
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
