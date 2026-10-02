import React from 'react';
import { Droplet, TrendingUp, AlertTriangle, ShieldCheck, Gauge, CloudRain } from 'lucide-react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';

interface MetricRibbonProps {
  farmState: FarmState;
  language: Language;
}

export const MetricRibbon: React.FC<MetricRibbonProps> = ({ farmState, language }) => {
  const t = translations[language];
  const { waterBudget, weather, fields } = farmState;

  const totalDemand = fields.reduce((sum, f) => sum + f.waterDemand, 0);
  const avgMoisture = Math.round(fields.reduce((sum, f) => sum + f.soilMoisture, 0) / fields.length);
  const avgTarget = Math.round(fields.reduce((sum, f) => sum + f.targetMoisture, 0) / fields.length);
  const deficitPct = Math.max(0, avgTarget - avgMoisture);

  // Overall farm risk level
  const hasCritical = fields.some((f) => f.currentStress === 'CRITICAL' || f.futureStress.plus12h === 'CRITICAL');
  const hasHigh = fields.some((f) => f.currentStress === 'HIGH' || f.futureStress.plus12h === 'HIGH');
  const riskBadge = hasCritical
    ? { label: t.critical, color: 'text-rose-800 bg-rose-50 border-rose-200 font-bold' }
    : hasHigh
    ? { label: t.high, color: 'text-amber-800 bg-amber-50 border-amber-200 font-bold' }
    : { label: t.moderate, color: 'text-emerald-800 bg-emerald-50 border-emerald-200 font-bold' };

  const metrics = [
    {
      label: t.waterAvailable,
      value: waterBudget.availableWater.toLocaleString(),
      unit: 'L',
      sub: `${waterBudget.allocatedWater.toLocaleString()} L Allocated`,
      icon: Droplet,
      iconColor: 'text-water-600 bg-sky-50 border-sky-200',
    },
    {
      label: t.predictedDemand,
      value: totalDemand.toLocaleString(),
      unit: 'L',
      sub: `Across ${fields.length} active plots`,
      icon: TrendingUp,
      iconColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    },
    {
      label: t.deficit,
      value: `${deficitPct}%`,
      unit: 'Deficit',
      sub: `Avg Moisture: ${avgMoisture}%`,
      icon: Gauge,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      label: t.farmRisk,
      value: riskBadge.label,
      badgeColor: riskBadge.color,
      sub: `${weather.temperature}°C • ET0 ${weather.et0} mm/d`,
      icon: AlertTriangle,
      iconColor: 'text-orange-600 bg-orange-50 border-orange-200',
    },
    {
      label: t.forecastConfidence,
      value: `${weather.forecastConfidence}%`,
      unit: '',
      sub: `Rain Prob: ${weather.rainfallProbability}% (${weather.uncertaintyLevel})`,
      icon: CloudRain,
      iconColor: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      label: t.resilienceReserve,
      value: waterBudget.reserveWater.toLocaleString(),
      unit: 'L',
      sub: `${Math.round((waterBudget.reserveWater / waterBudget.availableWater) * 100)}% dynamic buffer`,
      icon: ShieldCheck,
      iconColor: 'text-teal-600 bg-teal-50 border-teal-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div
            key={idx}
            className="bg-white/90 backdrop-blur-xs rounded-xl p-3.5 sm:p-4 border border-sky-200/90 shadow-sm shadow-sky-950/5 hover:border-sky-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-bold text-sky-950 uppercase tracking-wider truncate ${language === 'ta' ? 'font-tamil' : ''}`}>
                  {m.label}
                </span>
                <div className="p-1 rounded-md text-sky-700 bg-sky-100/80 border border-sky-200/60">
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex items-baseline space-x-1">
                {m.badgeColor ? (
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${m.badgeColor}`}>
                    {m.value}
                  </span>
                ) : (
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl sm:text-2xl font-black text-sky-950 tracking-tight font-mono tabular-nums">
                      {m.value}
                    </span>
                    {m.unit && (
                      <span className="text-xs font-semibold text-slate-600 font-mono ml-0.5">
                        {m.unit}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-700 mt-2 truncate font-medium border-t border-sky-100 pt-1.5">
              {m.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
};
