import React, { useState } from 'react';
import { Droplets, Volume2, Square, ShieldCheck, Sprout, Key, LogOut, UserCheck, Sparkles } from 'lucide-react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { speakText, stopSpeech, buildDecisionBriefText } from '../services/speechService';
import { isGeminiConfigured } from '../services/geminiService';
import { isWeatherApiConfigured } from '../services/weatherService';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  farmState: FarmState;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenFarmSetup?: () => void;
  onOpenApiKey?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  farmState,
  language,
  onLanguageChange,
  onOpenFarmSetup,
  onOpenApiKey,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { user, farmerProfile, isGuestMode, logout } = useAuth();
  const t = translations[language];

  const handleHearDecision = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const brief = buildDecisionBriefText(farmState, language);
      speakText(
        brief,
        language,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const navItems = [
    { id: 'command-center', label: t.navCommandCenter },
    { id: 'farm-twin', label: t.navFarmTwin },
    { id: 'scenario-lab', label: t.navScenarioLab, isDemo: true },
    { id: 'decisions', label: t.navDecisions },
    { id: 'resilience', label: t.navResilience },
  ];

  return (
    <header className="sticky top-0 z-40 bg-sky-100/80 backdrop-blur-md border-b border-sky-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-15 sm:h-16">
          {/* Brand Logo & Wordmark */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group" 
            onClick={() => onTabChange('command-center')}
          >
            <div className="w-9 h-9 rounded-lg bg-water-600 flex items-center justify-center text-white shadow-xs">
              <Droplets className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg tracking-tight text-sky-950 font-display group-hover:text-water-600 transition-colors">
                  AQUATWIN
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/90 text-emerald-800 border border-emerald-300/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5" />
                  {farmState.farmProfile ? farmState.farmProfile.farmName : t.farmLive}
                </span>
              </div>
              <p className="text-[10px] font-semibold text-sky-900/80">
                {farmState.farmProfile
                  ? `${farmState.farmProfile.location} • ${farmState.farmProfile.totalArea} ${farmState.farmProfile.areaUnit}`
                  : t.tagline}
              </p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-sky-200/50 p-1 rounded-xl border border-sky-300/60">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all relative flex items-center space-x-1.5 ${
                    active
                      ? 'bg-white text-sky-950 shadow-xs font-black border border-sky-200/80'
                      : 'text-sky-900 hover:text-sky-950 hover:bg-white/60 font-semibold'
                  }`}
                >
                  <span className={language === 'ta' ? 'font-tamil' : ''}>{item.label}</span>
                  {item.isDemo && (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                      active ? 'bg-water-100 text-water-800' : 'bg-sky-100 text-sky-800'
                    }`}>
                      Demo
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions: Water Bank Pill, Voice Brief, Farm Setup, API Key, Language Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Water Bank Mini-Pill */}
            <div className="hidden lg:flex items-center bg-white/85 border border-sky-200/90 px-2.5 py-1.5 rounded-lg text-xs shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-water-600 mr-1.5 shrink-0" />
              <span className="text-slate-600 mr-1 text-[11px] font-semibold">{t.waterAvailable}:</span>
              <span className="font-extrabold text-sky-950 font-mono text-xs">
                {farmState.waterBudget.availableWater.toLocaleString()} L
              </span>
              <span className="mx-2 text-sky-200">|</span>
              <span className="text-slate-600 mr-1 text-[11px] font-semibold">Reserve:</span>
              <span className="text-water-700 font-bold font-mono text-xs">
                {farmState.waterBudget.reserveWater.toLocaleString()} L
              </span>
            </div>

            {/* Farm Setup Trigger */}
            {onOpenFarmSetup && (
              <button
                onClick={onOpenFarmSetup}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-white/90 hover:bg-sky-50 text-slate-800 text-xs font-bold shadow-xs transition-all active:scale-95 border border-sky-300"
                title="Setup Farm & Fields"
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Farm Setup</span>
                <span className="sm:hidden">+ Farm</span>
              </button>
            )}

            {/* API Setup Trigger */}
            {onOpenApiKey && (
              <button
                onClick={onOpenApiKey}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-xs ${
                  isGeminiConfigured() || isWeatherApiConfigured()
                    ? 'bg-emerald-100/90 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                    : 'bg-white/90 hover:bg-sky-50 text-slate-800 border-sky-300'
                }`}
                title="Configure Gemini AI & Live Weather APIs"
              >
                <Key className="w-3.5 h-3.5 text-water-600" />
                <span className="hidden sm:inline">
                  {isGeminiConfigured() && isWeatherApiConfigured()
                    ? 'AI & Met Live'
                    : isGeminiConfigured()
                    ? 'Gemini Live'
                    : isWeatherApiConfigured()
                    ? 'Weather Live'
                    : 'APIs'}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isGeminiConfigured() || isWeatherApiConfigured()
                      ? 'bg-emerald-600'
                      : 'bg-slate-300'
                  }`}
                />
              </button>
            )}

            {/* Voice Decision Brief Button */}
            <button
              onClick={handleHearDecision}
              title={isSpeaking ? t.stopAudio : t.hearDecision}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isSpeaking
                  ? 'bg-rose-600 text-white ring-2 ring-rose-200'
                  : 'bg-white/90 hover:bg-sky-50 text-slate-800 border border-sky-300'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5 text-white" />
                  <span className="hidden sm:inline">{t.stopAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-water-600" />
                  <span className="hidden sm:inline">{t.hearDecision}</span>
                </>
              )}
            </button>

            {/* Language Toggle: EN | தமிழ் */}
            <div className="flex items-center bg-sky-200/60 p-0.5 rounded-lg border border-sky-300/70 text-xs font-semibold">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-sky-950 shadow-xs font-black'
                    : 'text-sky-900 hover:text-sky-950'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ta')}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  language === 'ta'
                    ? 'bg-white text-sky-950 shadow-xs font-black font-tamil'
                    : 'text-sky-900 hover:text-sky-950 font-tamil'
                }`}
              >
                தமிழ்
              </button>
            </div>

            {/* Authenticated Farmer Account Pill or Demo Mode Indicator */}
            {user ? (
              <div className="flex items-center space-x-1.5 bg-emerald-100/90 border border-emerald-300 pl-2 pr-1 py-1 rounded-lg text-xs shadow-xs">
                <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="font-bold text-emerald-950 font-mono text-[11px] truncate max-w-[90px] sm:max-w-[120px]">
                  {farmerProfile?.mobile_number || user.phone || 'Farmer'}
                </span>
                <button
                  onClick={logout}
                  title="Logout from farm account"
                  className="p-1 rounded hover:bg-emerald-200 text-emerald-800 transition-colors ml-0.5"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : isGuestMode ? (
              <div className="flex items-center space-x-1 bg-amber-100/90 border border-amber-300 pl-2 pr-1 py-1 rounded-lg text-xs shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span className="font-bold text-amber-950 text-[10px] uppercase tracking-wide">
                  Simulation
                </span>
                <button
                  onClick={logout}
                  title="Return to login screen"
                  className="p-1 rounded hover:bg-amber-200 text-amber-800 transition-colors ml-0.5"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-200/60 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                currentTab === item.id 
                  ? 'bg-water-600 text-white shadow-xs font-semibold' 
                  : 'text-slate-600 bg-white border border-slate-200'
              } ${language === 'ta' ? 'font-tamil' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
