import React from 'react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { DigitalTwinGrid } from '../components/DigitalTwinGrid';
import { Sprout, Droplets, ShieldCheck, Thermometer } from 'lucide-react';

interface FarmTwinPageProps {
  farmState: FarmState;
  language: Language;
  selectedFieldId?: string | null;
  onSelectField?: (fieldId: string) => void;
}

export const FarmTwinPage: React.FC<FarmTwinPageProps> = ({
  farmState,
  language,
  selectedFieldId,
  onSelectField,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-200 shadow-2xs">
              <Sprout className="w-5 h-5" />
            </span>
            <h2 className={`text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.digitalFarmTwin}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Autonomous biophysical twin synthesizing root-zone moisture, crop phenology, and thermal demand
          </p>
        </div>

        {/* Legend pills with clear consistent colors */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold shadow-2xs">
            ● Healthy
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold shadow-2xs">
            ▲ At Risk
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold shadow-2xs">
            ■ Critical
          </span>
        </div>
      </div>

      {/* Interactive Farm Twin Grid */}
      <DigitalTwinGrid
        fields={farmState.fields}
        language={language}
        selectedFieldId={selectedFieldId}
        onSelectField={onSelectField}
      />

      {/* Environmental & Soil Diagnostics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 bg-white rounded-3xl p-6 border border-sky-100 shadow-xs text-xs">
        <div className="flex items-start space-x-3.5 p-1">
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-100 shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 mb-1">Hydraulic Balance</h4>
            <p className="text-slate-500 leading-relaxed font-normal">
              Total root-zone deficit across plots is{' '}
              <strong className="text-slate-900 font-mono font-bold">
                {farmState.fields.reduce((s, f) => s + f.waterDemand, 0).toLocaleString()} L
              </strong>. 
              Optimization limits allocation to biologically responsive thresholds.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5 p-1">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 shrink-0">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 mb-1">Atmospheric Transpiration</h4>
            <p className="text-slate-500 leading-relaxed font-normal">
              Ambient temperature is <strong className="text-slate-900 font-mono font-bold">{farmState.weather.temperature}°C</strong> with 
              ET0 at <strong className="text-slate-900 font-mono font-bold">{farmState.weather.et0} mm/day</strong>. Evapotranspiration is actively drawing down sandy loam plots.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5 p-1">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 mb-1">Dynamic Protection</h4>
            <p className="text-slate-500 leading-relaxed font-normal">
              Resilience reserve is holding{' '}
              <strong className="text-slate-900 font-mono font-bold">
                {farmState.waterBudget.reserveWater.toLocaleString()} L
              </strong>{' '}
              to safeguard sensitive flowering stages in the event of meteorological variance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
