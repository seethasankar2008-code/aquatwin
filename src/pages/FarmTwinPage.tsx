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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-sky-200/80">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-sky-100 text-water-700 border border-sky-300 shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <h2 className={`text-2xl font-black font-display text-sky-950 tracking-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.digitalFarmTwin}
            </h2>
          </div>
          <p className="text-sm text-slate-700 font-medium mt-1">
            Autonomous biophysical twin synthesizing root-zone moisture, crop phenology, and thermal demand
          </p>
        </div>

        {/* Legend pills with clear consistent colors */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold shadow-xs">
            ● Healthy
          </span>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold shadow-xs">
            ▲ At Risk
          </span>
          <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-bold shadow-xs">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 bg-white/92 backdrop-blur-sm rounded-xl p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5 text-xs">
        <div className="flex items-start space-x-3.5">
          <div className="p-2 rounded-lg bg-sky-100 text-water-700 border border-sky-300 shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black font-display text-sky-950 mb-1">Hydraulic Balance</h4>
            <p className="text-slate-700 leading-relaxed font-medium">
              Total root-zone deficit across plots is{' '}
              <strong className="text-water-700 font-mono font-bold">
                {farmState.fields.reduce((s, f) => s + f.waterDemand, 0).toLocaleString()} L
              </strong>. 
              Optimization limits allocation to biologically responsive thresholds.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black font-display text-sky-950 mb-1">Atmospheric Transpiration</h4>
            <p className="text-slate-700 leading-relaxed font-medium">
              Ambient temperature is <strong className="text-amber-800 font-mono font-bold">{farmState.weather.temperature}°C</strong> with 
              ET0 at <strong className="text-sky-950 font-mono font-bold">{farmState.weather.et0} mm/day</strong>. Evapotranspiration is actively drawing down sandy loam plots.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3.5">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-black font-display text-sky-950 mb-1">Dynamic Protection</h4>
            <p className="text-slate-700 leading-relaxed font-medium">
              Resilience reserve is holding{' '}
              <strong className="text-emerald-800 font-mono font-bold">
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
