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
    <div className="bg-gradient-to-br from-amber-500/10 via-white to-eco-50/50 rounded-2xl p-5 sm:p-6 border border-amber-200/90 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-200/60">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white">
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              {t.whatChanged}
            </h3>
            <p className="text-xs text-slate-600">
              Active Mode: <strong className="text-amber-800 uppercase font-mono">{activeScenario}</strong>
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
              className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs"
            >
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs mb-1.5">
                <Icon className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-semibold truncate">{c.label}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-slate-400 line-through font-mono font-medium">{c.from}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className={`font-bold font-mono ${c.alert ? 'text-amber-700' : 'text-slate-900'}`}>
                  {c.to}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Summary Statement */}
      <div className="p-3 bg-white/80 rounded-xl border border-amber-200/70 text-xs text-slate-800 leading-relaxed">
        <span className="font-bold text-amber-900 mr-1.5 uppercase tracking-wide">
          {language === 'ta' ? 'தகவமைப்பு காரணம்:' : 'Adaptation Rationale:'}
        </span>
        {whatChanged.summaryReason}
      </div>
    </div>
  );
};
