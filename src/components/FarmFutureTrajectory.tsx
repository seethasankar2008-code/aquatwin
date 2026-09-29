import React from 'react';
import { FieldState, Language, StressLevel } from '../types/farm';
import { translations } from '../i18n/translations';
import { Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface FarmFutureTrajectoryProps {
  fields: FieldState[];
  language: Language;
}

export const FarmFutureTrajectory: React.FC<FarmFutureTrajectoryProps> = ({ fields, language }) => {
  const t = translations[language];

  const getStepColor = (stress: StressLevel) => {
    switch (stress) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500',
          ring: 'ring-rose-200',
          text: 'text-rose-700',
          label: 'CRITICAL',
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500',
          ring: 'ring-amber-200',
          text: 'text-amber-700',
          label: 'HIGH',
        };
      case 'MODERATE':
        return {
          bg: 'bg-yellow-400',
          ring: 'ring-yellow-100',
          text: 'text-yellow-700',
          label: 'MODERATE',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-500',
          ring: 'ring-emerald-100',
          text: 'text-emerald-700',
          label: 'LOW',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sky-100 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-sky-100">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900">{t.farmFuture}</h3>
          </div>
          <p className="text-xs text-slate-500">{t.stressTrajectory}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1" />
            {t.healthy}
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mr-1" />
            {t.moderate}
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1" />
            {t.high}
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-1" />
            {t.critical}
          </span>
        </div>
      </div>

      {/* Trajectory Table / Visual Pipeline */}
      <div className="space-y-3">
        {fields.map((field) => {
          const sNow = getStepColor(field.futureStress.now);
          const s6 = getStepColor(field.futureStress.plus6h);
          const s12 = getStepColor(field.futureStress.plus12h);
          const s24 = getStepColor(field.futureStress.plus24h);

          return (
            <div
              key={field.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-sky-50/40 border border-sky-100/80 hover:bg-sky-50/70 transition-colors gap-3"
            >
              {/* Field Identity */}
              <div className="w-full sm:w-48 shrink-0">
                <span className="font-bold text-xs text-slate-900 block truncate">
                  {field.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {field.crop} • <span className="italic">{field.growthStage}</span>
                </span>
              </div>

              {/* 4-Step Horizon */}
              <div className="flex-1 grid grid-cols-4 gap-2 items-center">
                {/* NOW */}
                <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${sNow.bg}`} />
                  <div className="truncate">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {t.now}
                    </span>
                    <span className={`text-[10px] font-bold ${sNow.text}`}>
                      {field.futureStress.now}
                    </span>
                  </div>
                </div>

                {/* +6H */}
                <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s6.bg}`} />
                  <div className="truncate">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {t.plus6h}
                    </span>
                    <span className={`text-[10px] font-bold ${s6.text}`}>
                      {field.futureStress.plus6h}
                    </span>
                  </div>
                </div>

                {/* +12H */}
                <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s12.bg}`} />
                  <div className="truncate">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {t.plus12h}
                    </span>
                    <span className={`text-[10px] font-bold ${s12.text}`}>
                      {field.futureStress.plus12h}
                    </span>
                  </div>
                </div>

                {/* +24H */}
                <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-lg border border-slate-200/80">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s24.bg}`} />
                  <div className="truncate">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                      {t.plus24h}
                    </span>
                    <span className={`text-[10px] font-bold ${s24.text}`}>
                      {field.futureStress.plus24h}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action indicator */}
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">Allocated</span>
                <span className="text-xs font-bold text-aqua-700 font-mono">
                  {field.allocation.toLocaleString()} L
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
