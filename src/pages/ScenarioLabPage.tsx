import React, { useState } from 'react';
import { 
  FarmState, 
  Language, 
  ScenarioPreset 
} from '../types/farm';
import { translations } from '../i18n/translations';
import { 
  SlidersHorizontal, 
  Play, 
  TrendingDown, 
  TrendingUp, 
  ShieldAlert, 
  CloudRain, 
  Flame, 
  AlertOctagon, 
  ArrowRight, 
  RotateCcw,
  Activity,
  Droplets,
  ShieldCheck,
  CloudSun,
  RefreshCw,
  MapPin,
  Loader2,
  Key
} from 'lucide-react';
import { fetchLiveWeatherData, LiveWeatherResult, isWeatherApiConfigured } from '../services/weatherService';

interface ScenarioLabPageProps {
  farmState: FarmState;
  previousState: FarmState | null;
  language: Language;
  onApplyPreset: (preset: ScenarioPreset) => void;
  onApplyCustom: (water: number, rainProb: number, confidence: number, temp: number) => void;
  onSelectField?: (fieldId: string) => void;
  onOpenApiKey?: () => void;
}

export const ScenarioLabPage: React.FC<ScenarioLabPageProps> = ({
  farmState,
  previousState,
  language,
  onApplyPreset,
  onApplyCustom,
  onSelectField,
  onOpenApiKey,
}) => {
  const t = translations[language];

  // Interactive slider states
  const [waterSlider, setWaterSlider] = useState<number>(farmState.waterBudget.availableWater);
  const [rainProbSlider, setRainProbSlider] = useState<number>(farmState.weather.rainfallProbability);
  const [confidenceSlider, setConfidenceSlider] = useState<number>(farmState.weather.forecastConfidence);
  const [tempSlider, setTempSlider] = useState<number>(farmState.weather.temperature);
  const [isAdapting, setIsAdapting] = useState<boolean>(false);

  // Live Weather API States
  const [locationQuery, setLocationQuery] = useState<string>(farmState.farmProfile?.location || 'Thanjavur, Tamil Nadu');
  const [isSyncingWeather, setIsSyncingWeather] = useState<boolean>(false);
  const [liveWeatherInfo, setLiveWeatherInfo] = useState<LiveWeatherResult | null>(null);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleSyncLiveWeather = async () => {
    setIsSyncingWeather(true);
    setSyncMessage(null);
    try {
      const res = await fetchLiveWeatherData(locationQuery);
      setLiveWeatherInfo(res);
      setTempSlider(res.weather.temperature);
      setRainProbSlider(res.weather.rainfallProbability);
      setConfidenceSlider(res.weather.forecastConfidence);
      onApplyCustom(
        waterSlider,
        res.weather.rainfallProbability,
        res.weather.forecastConfidence,
        res.weather.temperature
      );
      setSyncMessage(`Synced ${res.provider} live data for ${res.locationName}`);
    } catch (e: any) {
      setSyncMessage('Failed to sync live weather. Retaining current simulation.');
    } finally {
      setIsSyncingWeather(false);
    }
  };

  // Sync sliders when farmState updates from presets
  React.useEffect(() => {
    setWaterSlider(farmState.waterBudget.availableWater);
    setRainProbSlider(farmState.weather.rainfallProbability);
    setConfidenceSlider(farmState.weather.forecastConfidence);
    setTempSlider(farmState.weather.temperature);
  }, [farmState]);

  const handleAdaptClick = () => {
    setIsAdapting(true);
    setTimeout(() => {
      onApplyCustom(waterSlider, rainProbSlider, confidenceSlider, tempSlider);
      setIsAdapting(false);
    }, 250);
  };

  const presets = [
    {
      id: 'WATER_SHORTAGE' as ScenarioPreset,
      name: t.presetWaterShortage,
      desc: '10,000 L → 5,000 L water cut',
      icon: TrendingDown,
      color: 'border-rose-200 bg-rose-50/70 text-rose-900 hover:bg-rose-100/70 hover:border-rose-300',
      badge: 'Primary Judge Demo',
    },
    {
      id: 'RAIN_SURGE' as ScenarioPreset,
      name: t.presetRainSurge,
      desc: '85% Rain Prob @ 86% Conf',
      icon: CloudRain,
      color: 'border-sky-200 bg-sky-50/70 text-sky-900 hover:bg-sky-100/70 hover:border-sky-300',
      badge: 'Demand Reduction',
    },
    {
      id: 'RAIN_FAILURE' as ScenarioPreset,
      name: t.presetRainFailure,
      desc: 'Expected rain fails; 37°C heat',
      icon: AlertOctagon,
      color: 'border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100/70 hover:border-amber-300',
      badge: 'Uncertainty Re-Adapt',
    },
    {
      id: 'HEATWAVE' as ScenarioPreset,
      name: t.presetHeatwave,
      desc: '42°C Extreme Transpiration',
      icon: Flame,
      color: 'border-orange-200 bg-orange-50/70 text-orange-900 hover:bg-orange-100/70 hover:border-orange-300',
      badge: 'Thermal Risk',
    },
    {
      id: 'DROUGHT' as ScenarioPreset,
      name: t.presetDrought,
      desc: '4,000 L Water @ 40°C',
      icon: ShieldAlert,
      color: 'border-slate-200 bg-slate-50/70 text-slate-800 hover:bg-slate-100/70 hover:border-slate-300',
      badge: 'Defensive Mode',
    },
  ];

  // Base state for Before comparison (if no previous state, simulate baseline)
  const beforeFields = previousState?.fields || farmState.fields.map(f => ({
    ...f,
    allocation: f.id === 'field-03' ? 1800 : f.id === 'field-01' ? 3400 : 1600,
  }));
  const beforeAvailable = previousState?.waterBudget.availableWater || 10000;

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300">
      {/* Clean Page Title & Supporting Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-sky-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-sky-950 font-display">
              {t.scenarioLabTitle}
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-100 text-water-800 border border-sky-300">
              <Activity className="w-3.5 h-3.5 mr-1 text-water-600" />
              <span>Adaptiveness Engine</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-medium">
            {t.scenarioLabSub} Test how water allocations dynamically rebalance under environmental shifts and forecast uncertainty.
          </p>
        </div>

        <button
          onClick={() => onApplyPreset('BASELINE')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/90 hover:bg-sky-50 text-slate-800 text-xs font-bold border border-sky-300 shadow-xs transition-all active:scale-98 self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span className={language === 'ta' ? 'font-tamil' : ''}>{t.presetBaseline}</span>
        </button>
      </div>

      {/* STEP 1: Real-Time Meteorological Sync (Live Weather API) */}
      <div className="bg-white/92 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-sky-200/90 shadow-sm shadow-sky-950/5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-sky-100">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-sky-100 text-water-700 border border-sky-300">
              <CloudSun className="w-4 h-4 text-water-600" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-sky-950 flex items-center gap-2">
                <span>1. Meteorological Sync & Ambient Conditions</span>
                <span className="text-[10px] font-mono font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
                  {isWeatherApiConfigured() ? 'OpenWeatherMap API' : 'Open-Meteo (FAO Agrometeorology)'}
                </span>
              </h2>
            </div>
          </div>

          {onOpenApiKey && (
            <button
              type="button"
              onClick={onOpenApiKey}
              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white hover:bg-sky-50 text-slate-800 text-xs font-bold border border-sky-300 transition-colors self-start sm:self-auto shadow-xs"
            >
              <Key className="w-3.5 h-3.5 text-water-600" />
              <span>Weather API Key</span>
            </button>
          )}
        </div>

        {/* Location Input & Sync Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Enter city or farm region (e.g. Thanjavur, Madurai, Coimbatore)..."
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-sky-50/70 border border-sky-200 text-slate-900 text-xs placeholder:text-slate-500 focus:outline-none focus:border-water-500 focus:bg-white"
            />
          </div>
          <button
            type="button"
            disabled={isSyncingWeather}
            onClick={handleSyncLiveWeather}
            className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-water-600 hover:bg-water-500 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-all active:scale-98 shrink-0"
          >
            {isSyncingWeather ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Fetching Live Met Data...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Live Weather</span>
              </>
            )}
          </button>
        </div>

        {/* Live Weather Telemetry Pill */}
        {liveWeatherInfo && (
          <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-100 text-xs animate-in fade-in space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-water-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Live from {liveWeatherInfo.locationName}</span>
                <span className="text-[11px] text-slate-500">
                  ({liveWeatherInfo.conditionText}, updated {liveWeatherInfo.lastUpdated})
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                Digital Twin Adapted
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-1 font-mono">
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-sans">Temperature</span>
                <span className="font-bold text-slate-900 text-sm">{liveWeatherInfo.weather.temperature}°C</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-sans">Humidity</span>
                <span className="font-bold text-slate-900 text-sm">{liveWeatherInfo.weather.humidity}%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-sans">Rain Probability</span>
                <span className="font-bold text-water-700 text-sm">{liveWeatherInfo.weather.rainfallProbability}%</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-sans">FAO-56 ET0</span>
                <span className="font-bold text-slate-900 text-sm">{liveWeatherInfo.weather.et0} mm/d</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block font-sans">Wind Speed</span>
                <span className="font-bold text-slate-900 text-sm">{liveWeatherInfo.windSpeedKmh || 12} km/h</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* STEP 2: Scenario Modification Presets */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className={`text-xs font-black uppercase tracking-wider text-sky-950 ${language === 'ta' ? 'font-tamil' : ''}`}>
            2. Scenario Presets (One-Click Adaptations)
          </h2>
          <span className="text-[11px] text-slate-600 font-medium">Select any scenario to trigger deterministic re-optimization</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {presets.map((preset) => {
            const Icon = preset.icon;
            const isActive = farmState.activeScenario === preset.id;

            return (
              <button
                key={preset.id}
                onClick={() => onApplyPreset(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isActive
                    ? 'ring-2 ring-water-500 border-water-500 bg-white text-sky-950 shadow-md'
                    : 'bg-white/90 backdrop-blur-xs border-sky-200/90 hover:border-sky-300 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-sky-50 text-water-600 border border-sky-200">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100 text-sky-900 border border-sky-200">
                    {preset.badge}
                  </span>
                </div>
                <h3 className={`font-black text-xs text-sky-950 group-hover:text-water-700 transition-colors font-display ${language === 'ta' ? 'font-tamil' : ''}`}>
                  {preset.name}
                </h3>
                <p className="text-[11px] text-slate-700 mt-0.5 font-medium leading-relaxed">{preset.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: Parametric Weather & Water Controls + PRIMARY ADAPT FARM CTA */}
      <div className="bg-white/92 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-sky-100">
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-md bg-sky-100 text-water-700 border border-sky-300">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-black uppercase tracking-wider text-sky-950">
              3. Parametric Weather & Water Controls
            </h2>
          </div>
          <span className="text-xs text-slate-600 font-mono font-semibold">
            Deterministic Optimizer
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Available Water Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className={`font-medium text-slate-700 ${language === 'ta' ? 'font-tamil' : ''}`}>
                {t.availableWaterSlider}
              </span>
              <span className="font-bold font-mono text-water-700 text-xs sm:text-sm">
                {waterSlider.toLocaleString()} L
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="15000"
              step="500"
              value={waterSlider}
              onChange={(e) => setWaterSlider(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>2k L</span>
              <span>10k L</span>
              <span>15k L</span>
            </div>
          </div>

          {/* Rain Probability Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className={`font-medium text-slate-700 ${language === 'ta' ? 'font-tamil' : ''}`}>
                {t.rainProbabilitySlider}
              </span>
              <span className="font-bold font-mono text-water-700 text-xs sm:text-sm">
                {rainProbSlider}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={rainProbSlider}
              onChange={(e) => setRainProbSlider(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% Dry</span>
              <span>50%</span>
              <span>100% Storm</span>
            </div>
          </div>

          {/* Forecast Confidence Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className={`font-medium text-slate-700 ${language === 'ta' ? 'font-tamil' : ''}`}>
                {t.forecastConfidenceSlider}
              </span>
              <span className="font-bold font-mono text-slate-800 text-xs sm:text-sm">
                {confidenceSlider}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={confidenceSlider}
              onChange={(e) => setConfidenceSlider(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>20% Variance</span>
              <span>100% Solid</span>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className={`font-medium text-slate-700 ${language === 'ta' ? 'font-tamil' : ''}`}>
                {t.temperatureSlider}
              </span>
              <span className="font-bold font-mono text-amber-700 text-xs sm:text-sm">
                {tempSlider}°C
              </span>
            </div>
            <input
              type="range"
              min="22"
              max="46"
              step="1"
              value={tempSlider}
              onChange={(e) => setTempSlider(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>22°C Mild</span>
              <span>34°C</span>
              <span>46°C Hot</span>
            </div>
          </div>
        </div>

        {/* Primary Adapt Farm Button (Visually Dominant CTA for this section) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Forward-propagates adjustments through Penman-Monteith ET0, uncertainty discounting, and bounded linear programming.
          </p>

          <button
            onClick={handleAdaptClick}
            disabled={isAdapting}
            className="w-full sm:w-auto px-7 py-3 rounded-lg bg-water-600 hover:bg-water-500 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center space-x-2 transition-all active:scale-98"
          >
            {isAdapting ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-white" />
            )}
            <span className={language === 'ta' ? 'font-tamil' : ''}>
              {isAdapting ? 'OPTIMIZING...' : t.adaptFarmBtn}
            </span>
          </button>
        </div>
      </div>

      {/* STEP 4: BEFORE VS AFTER ADAPTATION TABLE */}
      <div className="bg-white/92 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-sky-100">
          <div>
            <h2 className={`text-base font-black font-display text-sky-950 tracking-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
              4. {t.beforeVsAfter}
            </h2>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              Field-level reallocation under active scenario: <strong className="text-water-700 font-mono font-bold">{farmState.activeScenario}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-white text-slate-700 font-bold border border-sky-200 shadow-xs">
              Before: {beforeAvailable.toLocaleString()} L
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            <span className="px-2.5 py-1 rounded-md bg-sky-100 text-water-900 font-black border border-sky-300 shadow-xs">
              Now: {farmState.waterBudget.availableWater.toLocaleString()} L
            </span>
          </div>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="overflow-x-auto rounded-lg border border-sky-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sky-200 bg-sky-100/80 text-sky-950 font-black uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Field / Plot</th>
                <th className="py-2.5 px-3">Crop & Stage</th>
                <th className="py-2.5 px-3 text-right">Before</th>
                <th className="py-2.5 px-3 text-right text-water-900 bg-sky-200/50">After</th>
                <th className="py-2.5 px-3 text-right">Net Change</th>
                <th className="py-2.5 px-3 text-center">Priority</th>
                <th className="py-2.5 px-3">Marginal Benefit Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100">
              {farmState.fields.map((field) => {
                const prev = beforeFields.find((bf) => bf.id === field.id)?.allocation || 0;
                const delta = field.allocation - prev;

                return (
                  <tr
                    key={field.id}
                    className="hover:bg-sky-50/70 transition-colors cursor-pointer"
                    onClick={() => onSelectField?.(field.id)}
                  >
                    <td className="py-3 px-3 font-bold text-sky-950 whitespace-nowrap">
                      {field.name}
                    </td>
                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap">
                      <span className="font-bold text-slate-900">{field.crop}</span> • <span className="italic text-slate-600">{field.growthStage}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                      {prev.toLocaleString()} L
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black text-water-800 bg-sky-100/40">
                      {field.allocation.toLocaleString()} L
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-black whitespace-nowrap">
                      {delta > 0 ? (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center text-xs">
                          <TrendingUp className="w-3 h-3 mr-1 text-emerald-600" /> +{delta.toLocaleString()} L
                        </span>
                      ) : delta < 0 ? (
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-flex items-center text-xs">
                          <TrendingDown className="w-3 h-3 mr-1 text-rose-600" /> {delta.toLocaleString()} L
                        </span>
                      ) : (
                        <span className="text-slate-400">0 L</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          field.priorityScore >= 82
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : field.priorityScore >= 68
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {field.priorityScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-xs max-w-xs truncate">
                      {field.reasons[0] || 'Optimized for root-zone moisture threshold'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Reserve Comparison Footnote */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
          <div className="flex items-center space-x-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-water-600 shrink-0" />
            <span className="font-semibold">Resilience Reserve Protected:</span>
            <span className="font-mono font-bold text-water-700">
              {farmState.waterBudget.reserveWater.toLocaleString()} L
            </span>
            <span className="text-slate-500">
              ({Math.round((farmState.waterBudget.reserveWater / farmState.waterBudget.availableWater) * 100)}% of pool)
            </span>
          </div>

          <div className="text-slate-600">
            Uncommitted Buffer: <strong className="font-mono text-slate-900 font-bold">{farmState.waterBudget.uncommittedWater.toLocaleString()} L</strong>
          </div>
        </div>
      </div>

      {/* WHY ALLOCATION CHANGED CARD */}
      <div className="bg-white text-slate-800 rounded-xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-2 mb-2.5">
          <Droplets className="w-4 h-4 text-water-600" />
          <h3 className={`text-xs font-bold uppercase tracking-wider text-water-700 font-display ${language === 'ta' ? 'font-tamil' : ''}`}>
            {t.whyAllocationChanged}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
          {farmState.whatChanged.summaryReason}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3.5 border-t border-slate-100 text-xs text-slate-600">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="font-semibold text-slate-900 block mb-0.5">1. Crop Criticality Weighting</span>
            <p className="text-slate-500 leading-normal">
              High Ky stages (flowering & yield formation) receive priority water shielding.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="font-semibold text-slate-900 block mb-0.5">2. Forecast Uncertainty Discount</span>
            <p className="text-slate-500 leading-normal">
              Rainfall predictions are discounted by confidence scores to prevent deficit shocks.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="font-semibold text-slate-900 block mb-0.5">3. Dynamic Resilience Shield</span>
            <p className="text-slate-500 leading-normal">
              Resilience reserve is scaled dynamically to preserve emergency survival capacity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
