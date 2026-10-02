import React, { useState } from 'react';
import { 
  FarmState, 
  Language, 
  ScenarioPreset, 
  InsightEvent,
  FarmProfile 
} from './types/farm';
import { 
  computeFarmState, 
  applyScenarioPreset, 
  INITIAL_WEATHER, 
  INITIAL_AVAILABLE_WATER, 
  getInitialAiInsights 
} from './engine/scenarioEngine';
import { Header } from './components/Header';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { FarmTwinPage } from './pages/FarmTwinPage';
import { ScenarioLabPage } from './pages/ScenarioLabPage';
import { DecisionsPage } from './pages/DecisionsPage';
import { ResiliencePage } from './pages/ResiliencePage';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { HackathonDemoScriptModal } from './components/HackathonDemoScriptModal';
import { FarmOnboardingModal } from './components/onboarding/FarmOnboardingModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { WaterBubblesBackground } from './components/WaterBubblesBackground';
import { UserConfiguredField } from './components/onboarding/AddFieldsStep';
import { fetchLiveWeatherData, LiveWeatherResult } from './services/weatherService';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { fetchUserFarms, saveUserFarm, saveFarmFields, fetchFarmFields } from './services/farmerDataService';
import { Mic, Award, Info, Droplets } from 'lucide-react';
import { translations } from './i18n/translations';

const MainApp: React.FC = () => {
  // Core application state
  const [farmState, setFarmState] = useState<FarmState>(() =>
    computeFarmState(INITIAL_WEATHER, INITIAL_AVAILABLE_WATER, undefined, 'BASELINE')
  );
  const [previousState, setPreviousState] = useState<FarmState | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('command-center');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [insights, setInsights] = useState<InsightEvent[]>(getInitialAiInsights());

  // User Authentication & Data Context
  const { user, farmerProfile, isLoading: isAuthLoading, isGuestMode } = useAuth();

  // Live Weather Telemetry State (Open-Meteo)
  const [liveWeather, setLiveWeather] = useState<LiveWeatherResult | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isJudgeGuideOpen, setIsJudgeGuideOpen] = useState<boolean>(false);
  const [isFarmSetupOpen, setIsFarmSetupOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  const t = translations[language];

  // Synchronize preferred language from authenticated farmer profile
  React.useEffect(() => {
    if (farmerProfile?.preferred_language) {
      setLanguage(farmerProfile.preferred_language);
    }
  }, [farmerProfile]);

  // Synchronize live Open-Meteo weather without altering underlying engine logic
  const syncWeatherForLocation = React.useCallback(async (locationName: string, force: boolean = false) => {
    setIsWeatherLoading(true);
    try {
      const res = await fetchLiveWeatherData(locationName, force);
      setLiveWeather(res);
      if (res.isLive) {
        setFarmState((prev) =>
          computeFarmState(
            res.weather,
            prev.waterBudget.availableWater,
            undefined,
            prev.activeScenario,
            prev,
            undefined,
            prev.farmProfile
          )
        );
      }
    } catch (e) {
      console.warn('Weather sync encountered error, maintaining simulation data:', e);
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  // Sync weather on startup for farm location
  React.useEffect(() => {
    const loc = farmState.farmProfile?.location || 'Thanjavur, Tamil Nadu';
    syncWeatherForLocation(loc);
  }, []);

  // Load saved farm data from Supabase PostgreSQL for authenticated farmer
  React.useEffect(() => {
    if (!user) return;

    let isMounted = true;
    (async () => {
      try {
        const farms = await fetchUserFarms(user.id);
        if (!isMounted) return;
        if (farms.length > 0) {
          const farm = farms[0];
          const fields = await fetchFarmFields(farm.farmName, user.id); // try loading fields if saved
          setFarmState((prev) =>
            computeFarmState(
              prev.weather,
              farm.availableWater,
              undefined,
              'BASELINE',
              undefined,
              fields.length > 0 ? fields : undefined,
              farm
            )
          );
          syncWeatherForLocation(farm.location, true);
        } else {
          // If a new farmer with 0 farms logs in, open Farm Setup so they can configure their real farm
          setIsFarmSetupOpen(true);
        }
      } catch (err) {
        console.warn('Could not load user farms from database:', err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Custom Farm Creation Handler
  const handleCreateFarmTwin = (profile: FarmProfile, configuredFields: UserConfiguredField[]) => {
    setPreviousState({ ...farmState });
    const weatherToUse = liveWeather?.weather || INITIAL_WEATHER;
    const nextState = computeFarmState(
      weatherToUse,
      profile.availableWater,
      undefined,
      'BASELINE',
      undefined, // fresh calculation for configured farm twin
      configuredFields,
      profile
    );
    setFarmState(nextState);
    setCurrentTab('command-center');
    setSelectedFieldId(null);

    // Refresh weather telemetry for the farmer's configured location
    syncWeatherForLocation(profile.location, true);

    // Persist real farm and fields to Supabase PostgreSQL with RLS
    if (user) {
      saveUserFarm(user.id, profile).then((farmId) => {
        if (farmId) {
          saveFarmFields(farmId, user.id, configuredFields);
        }
      });
    }

    const newInsight: InsightEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Digital Farm Twin Created: ${profile.farmName}`,
      detail: `Calibrated ${configuredFields.length} field plots with ${profile.availableWater.toLocaleString()} ${profile.waterUnit === 'Kilolitres' ? 'kL' : 'L'} water pool under uncertainty.`,
      type: 'success',
    };
    setInsights((prev) => [newInsight, ...prev.slice(0, 5)]);
  };

  // Preset scenario trigger
  const handleApplyPreset = (preset: ScenarioPreset) => {
    setPreviousState({ ...farmState });
    const nextState = applyScenarioPreset(preset, farmState);
    setFarmState(nextState);

    // Append dynamic insight
    const newInsight: InsightEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `${preset.replace('_', ' ')} Applied`,
      detail: nextState.whatChanged.summaryReason,
      type: preset === 'RAIN_FAILURE' || preset === 'WATER_SHORTAGE' ? 'alert' : 'info',
    };
    setInsights((prev) => [newInsight, ...prev.slice(0, 5)]);
  };

  // Parametric slider update trigger
  const handleApplyCustom = (water: number, rainProb: number, confidence: number, temp: number) => {
    setPreviousState({ ...farmState });
    const updatedWeather = {
      ...farmState.weather,
      rainfallProbability: rainProb,
      forecastConfidence: confidence,
      temperature: temp,
    };
    const nextState = computeFarmState(
      updatedWeather,
      water,
      undefined,
      'CUSTOM',
      farmState
    );
    setFarmState(nextState);

    const newInsight: InsightEvent = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'Parametric Farm Adaptation',
      detail: `Adapted to ${water.toLocaleString()} L water pool under ${temp}°C and ${rainProb}% rain probability.`,
      type: 'success',
    };
    setInsights((prev) => [newInsight, ...prev.slice(0, 5)]);
  };

  const handleSelectField = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setCurrentTab('farm-twin');
  };

  // Loading screen while checking authentication session
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-sky-50/50 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-water-600 flex items-center justify-center text-white shadow-lg shadow-water-600/20 animate-pulse">
          <Droplets className="w-6 h-6 text-white" />
        </div>
        <p className="text-xs font-black tracking-widest uppercase text-sky-950 font-display">
          Loading AquaTwin Farm OS...
        </p>
      </div>
    );
  }

  // Protected Route Guard: Must authenticate with Mobile OTP or choose Simulation Mode
  if (!user && !isGuestMode) {
    return <AuthScreen language={language} onLanguageChange={setLanguage} />;
  }

  return (
    <div className={`min-h-screen bg-sky-50/20 text-slate-900 flex flex-col font-sans selection:bg-sky-200 selection:text-sky-950 relative ${language === 'ta' ? 'font-tamil' : ''}`}>
      {/* Floating & Splitting Water Bubbles Background */}
      <WaterBubblesBackground />

      {/* Sticky Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        farmState={farmState}
        language={language}
        onLanguageChange={setLanguage}
        onOpenFarmSetup={() => setIsFarmSetupOpen(true)}
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Screen Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 relative z-10">
        {currentTab === 'command-center' && (
          <CommandCenterPage
            farmState={farmState}
            language={language}
            insights={insights}
            onSelectField={handleSelectField}
            onNavigateToScenarioLab={() => setCurrentTab('scenario-lab')}
            onOpenFarmSetup={() => setIsFarmSetupOpen(true)}
            liveWeather={liveWeather}
            isWeatherLoading={isWeatherLoading}
            onRefreshWeather={() =>
              syncWeatherForLocation(farmState.farmProfile?.location || 'Thanjavur, Tamil Nadu', true)
            }
          />
        )}

        {currentTab === 'farm-twin' && (
          <FarmTwinPage
            farmState={farmState}
            language={language}
            selectedFieldId={selectedFieldId}
            onSelectField={setSelectedFieldId}
          />
        )}

        {currentTab === 'scenario-lab' && (
          <ScenarioLabPage
            farmState={farmState}
            previousState={previousState}
            language={language}
            onApplyPreset={handleApplyPreset}
            onApplyCustom={handleApplyCustom}
            onSelectField={handleSelectField}
            onOpenApiKey={() => setIsApiKeyModalOpen(true)}
          />
        )}

        {currentTab === 'decisions' && (
          <DecisionsPage
            farmState={farmState}
            language={language}
            onSelectField={handleSelectField}
          />
        )}

        {currentTab === 'resilience' && (
          <ResiliencePage
            farmState={farmState}
            language={language}
          />
        )}
      </main>

      {/* Floating Action Buttons for Judge Demo & Voice Assistant */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end space-y-2">
        {/* Judge Demo Script Trigger */}
        <button
          onClick={() => setIsJudgeGuideOpen(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold text-xs shadow-sm transition-all active:scale-95 border border-amber-300/80"
        >
          <Award className="w-3.5 h-3.5 text-slate-900" />
          <span>Judge Demo Guide</span>
        </button>

        {/* Ask AquaTwin Voice Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/95 hover:bg-sky-50 text-water-800 font-bold text-xs shadow-md shadow-sky-900/10 transition-all active:scale-95 border border-sky-300"
        >
          <Mic className="w-3.5 h-3.5 text-water-600" />
          <span className={language === 'ta' ? 'font-tamil' : ''}>{t.askAquaTwin}</span>
        </button>
      </div>

      {/* Modals */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        farmState={farmState}
        language={language}
      />

      <HackathonDemoScriptModal
        isOpen={isJudgeGuideOpen}
        onClose={() => setIsJudgeGuideOpen(false)}
        language={language}
        onJumpToTab={setCurrentTab}
      />

      <FarmOnboardingModal
        isOpen={isFarmSetupOpen}
        onClose={() => setIsFarmSetupOpen(false)}
        onCreateFarmTwin={handleCreateFarmTwin}
        language={language}
        initialProfile={farmState.farmProfile}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-sky-200/80 bg-white/80 backdrop-blur-md py-6 text-xs text-slate-600 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sky-950 tracking-tight">AQUATWIN</span>
            <span className="text-slate-300">|</span>
            <span className={`font-serif italic font-medium text-slate-600 ${language === 'ta' ? 'font-tamil not-italic' : ''}`}>{t.tagline}</span>
          </div>

          <div className="text-center md:text-right text-[11px] space-y-0.5">
            <p className="font-bold text-water-700">
              Hack4Values – UHV Cell Hackathon • Theme: Harmony with Nature (Eco-Centric Agriculture)
            </p>
            <p className="text-slate-500 flex items-center justify-center md:justify-end space-x-1">
              <Info className="w-3 h-3 inline mr-1 text-slate-400" />
              <span>{t.simulationNotice}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
};

export default App;
