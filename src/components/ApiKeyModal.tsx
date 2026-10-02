import React, { useState, useEffect } from 'react';
import { Key, CheckCircle2, AlertCircle, Loader2, X, ExternalLink, ShieldCheck, Cpu, CloudSun, Sparkles } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey, clearGeminiApiKey, testGeminiApiKey, GEMINI_MODEL } from '../services/geminiService';
import { getWeatherApiKey, setWeatherApiKey, clearWeatherApiKey, testWeatherApiKey } from '../services/weatherService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [activeTab, setActiveTab] = useState<'gemini' | 'weather'>('gemini');

  // Gemini state
  const [geminiKey, setGeminiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiResult, setGeminiResult] = useState<{ success: boolean; message: string } | null>(null);

  // Weather state
  const [weatherKey, setWeatherKey] = useState('');
  const [showWeatherKey, setShowWeatherKey] = useState(false);
  const [isTestingWeather, setIsTestingWeather] = useState(false);
  const [weatherResult, setWeatherResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setGeminiKey(getGeminiApiKey());
      setWeatherKey(getWeatherApiKey());
      setGeminiResult(null);
      setWeatherResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasGeminiKey = getGeminiApiKey().length > 0;
  const hasWeatherKey = getWeatherApiKey().length > 0;

  // Gemini handlers
  const handleSaveGemini = async () => {
    const trimmed = geminiKey.trim();
    if (!trimmed) {
      clearGeminiApiKey();
      setGeminiResult({ success: true, message: 'Gemini API key cleared. Reverted to offline simulation.' });
      if (onKeyUpdated) onKeyUpdated();
      return;
    }

    setIsTestingGemini(true);
    setGeminiResult(null);

    const res = await testGeminiApiKey(trimmed);
    setIsTestingGemini(false);
    setGeminiResult(res);

    if (res.success) {
      setGeminiApiKey(trimmed);
      if (onKeyUpdated) onKeyUpdated();
    }
  };

  const handleClearGemini = () => {
    clearGeminiApiKey();
    setGeminiKey('');
    setGeminiResult({ success: true, message: 'Gemini API key disconnected. Running offline models.' });
    if (onKeyUpdated) onKeyUpdated();
  };

  // Weather handlers
  const handleSaveWeather = async () => {
    const trimmed = weatherKey.trim();
    if (!trimmed) {
      clearWeatherApiKey();
      setWeatherResult({ success: true, message: 'OpenWeatherMap key cleared. Using Open-Meteo & offline models.' });
      if (onKeyUpdated) onKeyUpdated();
      return;
    }

    setIsTestingWeather(true);
    setWeatherResult(null);

    const res = await testWeatherApiKey(trimmed);
    setIsTestingWeather(false);
    setWeatherResult(res);

    if (res.success) {
      setWeatherApiKey(trimmed);
      if (onKeyUpdated) onKeyUpdated();
    }
  };

  const handleClearWeather = () => {
    clearWeatherApiKey();
    setWeatherKey('');
    setWeatherResult({ success: true, message: 'OpenWeatherMap key disconnected. Using Open-Meteo & offline models.' });
    if (onKeyUpdated) onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 bg-sky-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-sky-300 animate-in zoom-in-95 duration-200 text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sky-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-sky-100 text-water-700 border border-sky-300 shadow-xs">
              <Key className="w-5 h-5 text-water-600" />
            </div>
            <div>
              <h3 className="font-black font-display text-sky-950 text-base tracking-tight">
                API & Live Data Configuration
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Connect Google Gemini AI and live meteorological telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-sky-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-sky-100/80 p-1 rounded-lg border border-sky-200 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('gemini')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'gemini'
                ? 'bg-white text-sky-950 shadow-xs border border-sky-300'
                : 'text-slate-700 hover:text-sky-950 hover:bg-white/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Google Gemini</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasGeminiKey ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-slate-400'
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('weather')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md text-xs font-bold transition-all ${
              activeTab === 'weather'
                ? 'bg-white text-sky-950 shadow-xs border border-sky-300'
                : 'text-slate-700 hover:text-sky-950 hover:bg-white/50'
            }`}
          >
            <CloudSun className="w-3.5 h-3.5" />
            <span>Live Weather</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                hasWeatherKey ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-water-600 shadow-[0_0_6px_#0284c7]'
              }`}
            />
          </button>
        </div>

        {/* TAB 1: GEMINI */}
        {activeTab === 'gemini' && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-150">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-water-600" />
                <span className="text-xs font-medium text-slate-600">Active Model:</span>
                <span className="text-xs font-mono text-slate-900 font-bold">{GEMINI_MODEL}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    hasGeminiKey ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-400'
                  }`}
                />
                <span className="text-[11px] font-semibold text-slate-700">
                  {hasGeminiKey ? 'Live AI Active' : 'Offline Simulation'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 pr-20 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 border border-slate-200 transition-colors"
                >
                  {showGeminiKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {geminiResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start space-x-2 animate-in fade-in ${
                  geminiResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {geminiResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{geminiResult.message}</span>
              </div>
            )}

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold font-display text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-water-600" />
                  Gemini Features:
                </span>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-water-600 hover:text-water-700 inline-flex items-center gap-1 font-bold text-[11px]"
                >
                  Get Free Key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Powers multimodal crop canopy photo diagnostics and grounded bilingual voice Q&A (Tamil & English).
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                {hasGeminiKey && (
                  <button
                    type="button"
                    onClick={handleClearGemini}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                  >
                    Disconnect Key
                  </button>
                )}
              </div>
              <button
                type="button"
                disabled={isTestingGemini}
                onClick={handleSaveGemini}
                className="flex items-center justify-center space-x-2 px-5 py-2 rounded-lg bg-water-600 hover:bg-water-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {isTestingGemini ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <span>Save Gemini Key</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE WEATHER */}
        {activeTab === 'weather' && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-150">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CloudSun className="w-4 h-4 text-water-600" />
                <span className="text-xs font-medium text-slate-600">Live Provider:</span>
                <span className="text-xs font-mono text-slate-900 font-bold">
                  {hasWeatherKey ? 'OpenWeatherMap API' : 'Open-Meteo (Zero-Key)'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[11px] font-semibold text-emerald-800">Live Ready</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                OpenWeatherMap API Key (Optional)
              </label>
              <div className="relative">
                <input
                  type={showWeatherKey ? 'text' : 'password'}
                  value={weatherKey}
                  onChange={(e) => setWeatherKey(e.target.value)}
                  placeholder="e.g. 7f8a9b2c..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 pr-20 placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowWeatherKey(!showWeatherKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-slate-100 border border-slate-200 transition-colors"
                >
                  {showWeatherKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                If omitted, AquaTwin automatically uses <strong className="text-water-700">Open-Meteo</strong> with global FAO-56 agrometeorology models (zero key required).
              </p>
            </div>

            {weatherResult && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start space-x-2 animate-in fade-in ${
                  weatherResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {weatherResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span className="leading-snug">{weatherResult.message}</span>
              </div>
            )}

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold font-display text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-water-600" />
                  Real Meteorological Sync:
                </span>
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noreferrer"
                  className="text-water-600 hover:text-water-700 inline-flex items-center gap-1 font-bold text-[11px]"
                >
                  OpenWeatherMap <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                <li>Fetches real-time temperature, humidity, rainfall probability & cloud cover.</li>
                <li>Calculates live FAO-56 Reference Evapotranspiration (<strong className="text-slate-900">ET0</strong>).</li>
                <li>Can be synced anytime from the <strong className="text-water-700">Scenario Lab</strong>.</li>
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                {hasWeatherKey && (
                  <button
                    type="button"
                    onClick={handleClearWeather}
                    className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                  >
                    Disconnect Key
                  </button>
                )}
              </div>
              <button
                type="button"
                disabled={isTestingWeather}
                onClick={handleSaveWeather}
                className="flex items-center justify-center space-x-2 px-5 py-2 rounded-lg bg-water-600 hover:bg-water-500 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {isTestingWeather ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Validating...</span>
                  </>
                ) : (
                  <span>Save Weather Key</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
