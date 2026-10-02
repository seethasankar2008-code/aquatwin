import React from 'react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { ArrowRight, RefreshCw, Thermometer, CloudRain, AlertTriangle, Droplets } from 'lucide-react';

interface WhatChangedCardProps {
  farmState: FarmState;
  language: Language;
}

export const WhatChangedCard: React.FC<WhatChangedCardProps> = ({ farmState, language }) => {
  const t = translations[language];
  const { whatChanged, activeScenario, weather } = farmState;

  // Find top field before vs after
  const topField = [...farmState.fields].sort((a, b) => b.priorityScore - a.priorityScore)[0];
  const prevAlloc = topField?.previousAllocation || Math.round(topField?.allocation * 0.75);

  const deltaCards = [
    {
      label: language === 'ta' ? 'வெப்பநிலை' : 'Temperature',
      from: `${whatChanged.previousTemp}°C`,
      to: `${whatChanged.currentTemp}°C`,
      icon: Thermometer,
      alert: whatChanged.currentTemp > whatChanged.previousTemp,
    },
    {
      label: language === 'ta' ? 'மழை வாய்ப்பு' : 'Rain Probability',
      from: `${whatChanged.previousRainProb}%`,
      to: `${whatChanged.currentRainProb}%`,
      icon: CloudRain,
      alert: whatChanged.currentRainProb < whatChanged.previousRainProb,
    },
    {
      label: language === 'ta' ? 'முன்னுரிமை பயிர்' : 'Top Priority Crop',
      from: whatChanged.previousTopPriorityField,
      to: whatChanged.currentTopPriorityField,
      icon: AlertTriangle,
      alert: false,
    },
    {
      label: language === 'ta' ? 'பரிந்துரைக்கப்பட்ட நீர்' : 'Recommended Top Allocation',
      from: `${prevAlloc.toLocaleString()} L`,
      to: `${topField?.allocation.toLocaleString() ?? 0} L`,
      icon: Droplets,
      alert: (topField?.allocation ?? 0) > prevAlloc,
    },
  ];

  return (
    <div className="bg-white/92 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-amber-300 shadow-sm shadow-amber-900/5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-sky-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white font-bold shadow-xs">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-sky-950 font-display">
              {t.whatChanged}
            </h3>
            <p className="text-xs text-slate-700 font-medium">
              Active Mode: <strong className="text-amber-800 uppercase font-mono font-bold">{activeScenario}</strong>
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          Adapted at {farmState.lastAdaptedTime}
        </span>
      </div>

      {/* 4 Delta Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {deltaCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-sky-50/70 rounded-lg p-3 border border-sky-200 shadow-xs"
            >
              <div className="flex items-center space-x-1.5 text-slate-800 text-xs mb-1.5">
                <Icon className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-bold truncate">{c.label}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-slate-500 line-through font-mono font-semibold">{c.from}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className={`font-black font-mono ${c.alert ? 'text-amber-900' : 'text-sky-950'}`}>
                  {c.to}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Summary Statement */}
      <div className="p-3.5 bg-amber-50/70 rounded-lg border border-amber-200/80 text-xs text-slate-800 leading-relaxed">
        <span className="font-bold text-amber-900 mr-1.5 uppercase tracking-wide">
          {language === 'ta' ? 'தகவமைப்பு காரணம்:' : 'Adaptation Rationale:'}
        </span>
        {whatChanged.summaryReason}
      </div>
    </div>
  );
};
