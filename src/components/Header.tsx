import React, { useState } from 'react';
import { Droplets, Volume2, Square, ShieldCheck, Sprout } from 'lucide-react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { speakText, stopSpeech, buildDecisionBriefText } from '../services/speechService';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  farmState: FarmState;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenFarmSetup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  farmState,
  language,
  onLanguageChange,
  onOpenFarmSetup,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Wordmark */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group" 
            onClick={() => onTabChange('command-center')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-950 via-sky-900 to-cyan-800 flex items-center justify-center text-white shadow-xs border border-sky-700/50">
              <Droplets className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                  AQUATWIN
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                  {farmState.farmProfile ? farmState.farmProfile.farmName : t.farmLive}
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-wider text-sky-700 uppercase">
                {farmState.farmProfile
                  ? `${farmState.farmProfile.location} • ${farmState.farmProfile.totalArea} ${farmState.farmProfile.areaUnit}`
                  : t.tagline}
              </p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative flex items-center space-x-1.5 ${
                    active
                      ? 'bg-gradient-to-r from-sky-900 to-sky-800 text-white shadow-2xs border border-sky-700/50'
                      : 'text-slate-600 hover:text-sky-950 hover:bg-sky-50/80'
                  } ${item.isDemo && !active ? 'text-sky-950 font-bold' : ''}`}
                >
                  <span className={language === 'ta' ? 'font-tamil' : ''}>{item.label}</span>
                  {item.isDemo && (
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                      active ? 'bg-cyan-300 text-sky-950' : 'bg-cyan-100 text-cyan-900 border border-cyan-200'
                    }`}>
                      Demo
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions: Farm Setup, Water Bank Pill, Voice Brief, Language Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Farm Setup Trigger */}
            {onOpenFarmSetup && (
              <button
                onClick={onOpenFarmSetup}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-900 to-cyan-800 hover:from-sky-800 hover:to-cyan-700 text-white text-xs font-extrabold shadow-2xs transition-all active:scale-95 border border-sky-600/40"
                title="Setup Farm & Fields"
              >
                <Sprout className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Farm Setup</span>
                <span className="sm:hidden">+ Farm</span>
              </button>
            )}

            {/* Water Bank Mini-Pill */}
            <div className="hidden lg:flex items-center bg-sky-50/90 border border-sky-200/90 px-3 py-1.5 rounded-xl text-xs shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-700 mr-1.5" />
              <span className="text-slate-500 mr-1.5 font-medium">{t.waterAvailable}:</span>
              <span className="font-extrabold text-sky-950 font-mono">
                {farmState.waterBudget.availableWater.toLocaleString()} L
              </span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-slate-500 mr-1 text-[11px]">Res:</span>
              <span className="text-cyan-800 font-bold font-mono text-[11px]">
                {farmState.waterBudget.reserveWater.toLocaleString()} L
              </span>
            </div>

            {/* Voice Decision Brief Button */}
            <button
              onClick={handleHearDecision}
              title={isSpeaking ? t.stopAudio : t.hearDecision}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                isSpeaking
                  ? 'bg-rose-600 text-white ring-2 ring-rose-200'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-200/90'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline font-bold">{t.stopAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                  <span className="hidden sm:inline font-bold">{t.hearDecision}</span>
                </>
              )}
            </button>

            {/* Language Toggle: EN | தமிழ் */}
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg transition-all min-w-[34px] ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('ta')}
                className={`px-2.5 py-1 rounded-lg transition-all min-w-[44px] ${
                  language === 'ta'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold font-tamil'
                    : 'text-slate-500 hover:text-slate-900 font-tamil'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Strip */}
        <div className="flex md:hidden overflow-x-auto py-2.5 space-x-1.5 border-t border-sky-100 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                currentTab === item.id ? 'bg-sky-900 text-white' : 'text-slate-600 bg-sky-50/70 border border-sky-100'
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
