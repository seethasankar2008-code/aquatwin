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
import { UserConfiguredField } from './components/onboarding/AddFieldsStep';
import { Mic, Award, Info } from 'lucide-react';
import { translations } from './i18n/translations';

export const App: React.FC = () => {
  // Core application state
  const [farmState, setFarmState] = useState<FarmState>(() =>
    computeFarmState(INITIAL_WEATHER, INITIAL_AVAILABLE_WATER, undefined, 'BASELINE')
  );
  const [previousState, setPreviousState] = useState<FarmState | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('command-center');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [insights, setInsights] = useState<InsightEvent[]>(getInitialAiInsights());

  // Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isJudgeGuideOpen, setIsJudgeGuideOpen] = useState<boolean>(false);
  const [isFarmSetupOpen, setIsFarmSetupOpen] = useState<boolean>(false);

  const t = translations[language];

  // Custom Farm Creation Handler
  const handleCreateFarmTwin = (profile: FarmProfile, configuredFields: UserConfiguredField[]) => {
    setPreviousState({ ...farmState });
    const nextState = computeFarmState(
      INITIAL_WEATHER,
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

  return (
    <div className={`min-h-screen bg-[#f0f9ff] text-slate-900 flex flex-col font-sans ${language === 'ta' ? 'font-tamil' : ''}`}>
      {/* Sticky Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        farmState={farmState}
        language={language}
        onLanguageChange={setLanguage}
        onOpenFarmSetup={() => setIsFarmSetupOpen(true)}
      />

      {/* Main Screen Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'command-center' && (
          <CommandCenterPage
            farmState={farmState}
            language={language}
            insights={insights}
            onSelectField={handleSelectField}
            onNavigateToScenarioLab={() => setCurrentTab('scenario-lab')}
            onOpenFarmSetup={() => setIsFarmSetupOpen(true)}
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

      {/* Floating Action Buttons for Judge Demo & Voice Assistant (Secondary, clean & unobtrusive) */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end space-y-2">
        {/* Judge Demo Script Trigger */}
        <button
          onClick={() => setIsJudgeGuideOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 border border-amber-300/80"
        >
          <Award className="w-3.5 h-3.5 text-slate-950" />
          <span>Judge Demo Guide</span>
        </button>

        {/* Ask AquaTwin Voice Button */}
        <button
          onClick={() => setIsVoiceModalOpen(true)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 border border-slate-700/80"
        >
          <Mic className="w-3.5 h-3.5 text-aqua-400" />
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

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200/90 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 tracking-tight">AQUATWIN</span>
            <span className="text-slate-300">|</span>
            <span className={`font-serif italic font-semibold text-slate-700 ${language === 'ta' ? 'font-tamil not-italic' : ''}`}>{t.tagline}</span>
          </div>

          <div className="text-center md:text-right text-[11px] space-y-0.5">
            <p className="font-bold text-sky-950">
              Hack4Values – UHV Cell Hackathon • Theme: Harmony with Nature (Eco-Centric Agriculture)
            </p>
            <p className="text-slate-400 flex items-center justify-center md:justify-end space-x-1">
              <Info className="w-3 h-3 inline mr-1" />
              <span>{t.simulationNotice}</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
