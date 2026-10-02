import React from 'react';
import { RefreshCw, MapPin, AlertCircle, SunMedium } from 'lucide-react';
import { LiveWeatherResult } from '../services/weatherService';
import { Language } from '../types/farm';

interface LiveWeatherCardProps {
  weatherResult: LiveWeatherResult | null;
  isLoading: boolean;
  onRefresh: () => void;
  language?: Language;
}

export const LiveWeatherCard: React.FC<LiveWeatherCardProps> = ({
  weatherResult,
  isLoading,
  onRefresh,
  language = 'en',
}) => {
  const isTa = language === 'ta';
  const isLive = weatherResult?.isLive ?? false;
  const temp = weatherResult?.weather?.temperature ?? 32;
  const rainProb = weatherResult?.weather?.rainfallProbability ?? 20;
  const nextRainProb = weatherResult?.nextForecast?.rainProbability ?? (rainProb > 40 ? 65 : 25);
  const et0 = weatherResult?.weather?.et0 ?? 4.8;
  const condition = weatherResult?.conditionText || 'Clear Sky';
  const location = weatherResult?.locationName || 'Thanjavur, Tamil Nadu';
  const updatedTime = weatherResult?.lastUpdated || 'Just now';
  const provider = weatherResult?.provider || 'Open-Meteo';

  return (
    <div className="bg-white/92 backdrop-blur-sm rounded-xl p-4 sm:p-4.5 border border-sky-200/90 shadow-sm shadow-sky-950/5 hover:border-sky-300 transition-all">
      {/* Top Header: Badge, Location & Refresh */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-sky-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-sky-100/90 text-water-700 border border-sky-300/70">
            <SunMedium className="w-4 h-4 text-water-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-sky-950 font-display">
                {isTa ? 'நேரலை வானிலை' : 'Live Weather'}
              </h3>
              {isLive ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                  {provider} Live
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-water-400 mr-1.5" />
                  Simulation Baseline
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-water-600 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-xs font-semibold text-slate-700">{location}</span>
            </p>
          </div>
        </div>

        {/* Sync Controls & Timestamp */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {isTa ? 'புதுப்பிக்கப்பட்டது' : 'Updated'}
            </p>
            <p className="text-xs font-mono font-bold text-slate-700">{updatedTime}</p>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100/80 text-water-800 text-xs font-bold border border-sky-200/90 shadow-xs transition-all active:scale-95 disabled:opacity-50"
            title="Refresh weather telemetry from Open-Meteo"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-water-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isTa ? 'புதுப்பி' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Fallback Notice (Only if live weather is unreachable) */}
      {!isLive && (
        <div className="mt-3 flex items-center space-x-2 px-3 py-2 rounded-lg bg-sky-50/90 border border-sky-200/90 text-sky-900 text-xs font-medium">
          <AlertCircle className="w-4 h-4 text-water-600 shrink-0" />
          <span>Live weather unavailable — using simulation data.</span>
        </div>
      )}

      {/* Main Meteorological Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3.5">
        {/* Metric 1: Temperature & Condition */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-sky-50/50 border border-sky-100 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isTa ? 'வெப்பநிலை' : 'Temperature'}
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-black text-sky-950 font-display">
              {temp}°C
            </span>
          </div>
          <span className="text-[11px] font-semibold text-water-700 mt-0.5 truncate">
            {condition}
          </span>
        </div>

        {/* Metric 2: Rain Probability */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-sky-50/50 border border-sky-100 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isTa ? 'மழை வாய்ப்பு' : 'Rain Probability'}
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-black text-sky-950 font-display flex items-center gap-1">
              <span className="text-base">🌧️</span>
              <span>{rainProb}%</span>
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-600 mt-0.5">
            {rainProb > 50 ? 'Likely Showers' : rainProb > 25 ? 'Low Chance' : 'Dry Period'}
          </span>
        </div>

        {/* Metric 3: Next Forecast */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-sky-50/50 border border-sky-100 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {isTa ? 'அடுத்த முன்னறிவிப்பு' : 'Next Forecast'}
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-black text-sky-950 font-display">
              {nextRainProb}%
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">rain</span>
          </div>
          <span className="text-[11px] font-semibold text-water-700 mt-0.5 truncate">
            {weatherResult?.nextForecast?.summary || 'Next 12 Hours'}
          </span>
        </div>

        {/* Metric 4: Evapotranspiration (ET0) */}
        <div className="p-2.5 sm:p-3 rounded-lg bg-sky-50/50 border border-sky-100 flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            FAO ET0 (Demand)
          </span>
          <div className="mt-1 flex items-baseline space-x-1.5">
            <span className="text-xl sm:text-2xl font-black text-sky-950 font-display">
              {et0}
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">mm/day</span>
          </div>
          <span className="text-[11px] font-semibold text-slate-600 mt-0.5">
            Crop Evaporation
          </span>
        </div>
      </div>
    </div>
  );
};
