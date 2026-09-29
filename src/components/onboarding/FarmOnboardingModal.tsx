import React, { useState } from 'react';
import { FarmProfile, Language } from '../../types/farm';
import { CreateFarmStep } from './CreateFarmStep';
import { AddFieldsStep, UserConfiguredField } from './AddFieldsStep';
import { ReviewFarmStep } from './ReviewFarmStep';
import { X, Check, Droplets, Sparkles, Building2, Sprout, ArrowRight } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface FarmOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFarmTwin: (profile: FarmProfile, fields: UserConfiguredField[]) => void;
  language: Language;
  initialProfile?: FarmProfile;
  initialFields?: UserConfiguredField[];
}

const DEFAULT_PROFILE: FarmProfile = {
  farmName: 'Cauvery Delta Agro-Plex',
  location: 'Thanjavur, Tamil Nadu',
  totalArea: 4.5,
  areaUnit: 'Acres',
  waterSource: 'Farm Pond',
  availableWater: 10000,
  waterUnit: 'Litres',
};

const DEFAULT_STARTER_FIELDS: UserConfiguredField[] = [
  {
    id: 'f-1',
    name: 'Plot 01 - North Terraces',
    crop: 'Rice',
    area: 1.2,
    soilType: 'Clay Loam',
    growthStage: 'Tillering',
    soilMoisture: 48,
  },
  {
    id: 'f-2',
    name: 'Plot 02 - East Ridge',
    crop: 'Tomato',
    area: 0.8,
    soilType: 'Sandy Loam',
    growthStage: 'Flowering',
    soilMoisture: 22,
  },
  {
    id: 'f-3',
    name: 'Plot 03 - South Slope',
    crop: 'Groundnut',
    area: 1.0,
    soilType: 'Red Soil',
    growthStage: 'Pod Development',
    soilMoisture: 32,
  },
];

export const FarmOnboardingModal: React.FC<FarmOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCreateFarmTwin,
  language,
  initialProfile,
  initialFields,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [profile, setProfile] = useState<FarmProfile>(initialProfile || DEFAULT_PROFILE);
  const [fields, setFields] = useState<UserConfiguredField[]>(
    initialFields && initialFields.length > 0 ? initialFields : DEFAULT_STARTER_FIELDS
  );
  const [isActivating, setIsActivating] = useState(false);

  if (!isOpen) return null;

  const t = translations[language];

  const handleProfileChange = (updated: Partial<FarmProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleCreateFarmTwin = () => {
    setIsActivating(true);
    setStep(4);
    // 1.2s activation animation for hackathon presentation impact
    setTimeout(() => {
      onCreateFarmTwin(profile, fields);
      setIsActivating(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with Stepper */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-eco-900 text-aqua-400 flex items-center justify-center shadow-xs">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 uppercase">
                  Farm Setup & Twin Creation
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-aqua-100 text-aqua-900 border border-aqua-200">
                  Onboarding
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Configure your farm, fields, and optional visual observations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {step < 4 && (
          <div className="px-6 py-3 border-b border-slate-100 bg-white grid grid-cols-3 gap-2 shrink-0">
            {/* Step 1 */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`flex items-center space-x-2 text-left p-1.5 rounded-xl transition-all ${
                step === 1 ? 'bg-eco-50 border border-eco-200' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                  step > 1
                    ? 'bg-emerald-600 text-white'
                    : step === 1
                    ? 'bg-eco-900 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </div>
              <div className="hidden sm:block">
                <span className="text-[11px] font-bold block text-slate-800 leading-tight">01 Farm Setup</span>
                <span className="text-[9px] text-slate-500 block">Baseline Parameters</span>
              </div>
            </button>

            {/* Step 2 */}
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`flex items-center space-x-2 text-left p-1.5 rounded-xl transition-all ${
                step === 2 ? 'bg-eco-50 border border-eco-200' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                  step > 2
                    ? 'bg-emerald-600 text-white'
                    : step === 2
                    ? 'bg-eco-900 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </div>
              <div className="hidden sm:block">
                <span className="text-[11px] font-bold block text-slate-800 leading-tight">02 Field Setup</span>
                <span className="text-[9px] text-slate-500 block">Plots & Photos</span>
              </div>
            </button>

            {/* Step 3 */}
            <button
              type="button"
              onClick={() => fields.length > 0 && setStep(3)}
              className={`flex items-center space-x-2 text-left p-1.5 rounded-xl transition-all ${
                step === 3 ? 'bg-eco-50 border border-eco-200' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                  step === 3 ? 'bg-eco-900 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </div>
              <div className="hidden sm:block">
                <span className="text-[11px] font-bold block text-slate-800 leading-tight">03 Review & Launch</span>
                <span className="text-[9px] text-slate-500 block">Autonomous Twin</span>
              </div>
            </button>
          </div>
        )}

        {/* Modal Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
          {step === 1 && (
            <CreateFarmStep
              profile={profile}
              onChange={handleProfileChange}
              onNext={() => setStep(2)}
              language={language}
            />
          )}

          {step === 2 && (
            <AddFieldsStep
              fields={fields}
              onFieldsChange={setFields}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && (
            <ReviewFarmStep
              profile={profile}
              fields={fields}
              onBackToFields={() => setStep(2)}
              onBackToFarm={() => setStep(1)}
              onCreateFarmTwin={handleCreateFarmTwin}
              language={language}
            />
          )}

          {step === 4 && (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-eco-900 flex items-center justify-center text-aqua-400 shadow-xl animate-pulse">
                  <Sparkles className="w-10 h-10" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-aqua-500" />
                </span>
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  INITIALIZING DIGITAL FARM TWIN
                </h3>
                <p className="text-xs text-slate-500">
                  Calibrating {fields.length} zones for {profile.farmName}... Running FAO-56 evapotranspiration models and dynamic resilience reserves.
                </p>
              </div>

              <div className="w-64 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-aqua-500 to-eco-900 h-2 rounded-full animate-[progress_1.2s_ease-in-out_infinite]" style={{ width: '85%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
