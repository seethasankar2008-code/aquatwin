import React from 'react';
import { FarmProfile, Language } from '../../types/farm';
import { UserConfiguredField } from './AddFieldsStep';
import { translations } from '../../i18n/translations';
import { 
  Building2, 
  MapPin, 
  Droplets, 
  Sprout, 
  CheckCircle2, 
  ArrowRight, 
  Edit3, 
  ShieldCheck, 
  Sparkles,
  Camera,
  Info
} from 'lucide-react';

interface ReviewFarmStepProps {
  profile: FarmProfile;
  fields: UserConfiguredField[];
  onBackToFields: () => void;
  onBackToFarm: () => void;
  onCreateFarmTwin: () => void;
  language: Language;
}

export const ReviewFarmStep: React.FC<ReviewFarmStepProps> = ({
  profile,
  fields,
  onBackToFields,
  onBackToFarm,
  onCreateFarmTwin,
  language,
}) => {
  const t = translations[language];
  const totalFieldArea = fields.reduce((sum, f) => sum + f.area, 0);
  const photosCount = fields.filter((f) => !!f.visualAnalysis).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-eco-50 border border-eco-200 text-eco-900 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-eco-700" />
          <span>Step 03 of 03: Final Review</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          REVIEW YOUR DIGITAL TWIN
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verify your farm parameters before initializing AquaTwin's autonomous optimization engine.
        </p>
      </div>

      {/* Farm Profile Card */}
      <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-eco-900 shadow-2xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {profile.farmName || 'Unnamed Farm'}
              </h4>
              <p className="text-xs text-slate-500 flex items-center mt-0.5">
                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                {profile.location || 'Location Not Specified'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBackToFarm}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Farm</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
              Total Farm Area
            </span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
              {profile.totalArea} {profile.areaUnit}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
              Primary Water Source
            </span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">
              {profile.waterSource}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
              Available Water Pool
            </span>
            <span className="font-extrabold text-aqua-800 font-mono text-sm mt-0.5 block">
              {profile.availableWater.toLocaleString()} {profile.waterUnit === 'Kilolitres' ? 'kL' : 'L'}
            </span>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block">
              Configured Plots
            </span>
            <span className="font-extrabold text-emerald-800 text-sm mt-0.5 block">
              {fields.length} {fields.length === 1 ? 'Field' : 'Fields'} ({totalFieldArea.toFixed(1)} ha)
            </span>
          </div>
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="w-4 h-4 text-eco-800" />
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight">
              Configured Field Plots ({fields.length})
            </h4>
          </div>
          <button
            type="button"
            onClick={onBackToFields}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Fields</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-eco-300 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start sm:items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-eco-50 text-eco-800 border border-eco-200 flex items-center justify-center font-extrabold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        {field.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-eco-100/80 text-eco-900 text-[10px] font-extrabold">
                        {field.crop}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {field.area} ha
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {field.soilType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Stage: <span className="font-semibold text-slate-700">{field.growthStage}</span> • Initial Soil Moisture:{' '}
                      <span className="font-mono font-bold text-slate-800">
                        {field.soilMoisture !== undefined ? `${field.soilMoisture}%` : 'Autonomous Baseline'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Photo Insight Status Badge */}
                <div className="self-start sm:self-center">
                  {field.visualAnalysis ? (
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-aqua-50 border border-aqua-200 text-aqua-900 text-xs font-bold shadow-2xs">
                      <Camera className="w-3.5 h-3.5 text-aqua-700" />
                      <span>Visual Insight Attached</span>
                      <span className="text-[10px] font-normal text-aqua-700">
                        ({field.visualAnalysis.cropAppearance})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-500 text-xs font-medium">
                      <span>No Photo • Standard Baseline</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Observation Snippet if available */}
              {field.visualAnalysis && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-start space-x-3 text-xs">
                  {field.visualAnalysis.photoUrl && (
                    <img
                      src={field.visualAnalysis.photoUrl}
                      alt={field.name}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <p className="text-slate-700 font-medium leading-snug">
                      "{field.visualAnalysis.observation}"
                    </p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                      <span>Surface: <strong className="text-slate-700">{field.visualAnalysis.surfaceCondition}</strong></span>
                      <span>•</span>
                      <span>Stress: <strong className="text-slate-700">{field.visualAnalysis.visibleStress}</strong></span>
                      <span>•</span>
                      <span>Confidence: <strong className="text-slate-700">{field.visualAnalysis.confidence}</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Honest AI Non-Overclaiming Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
        <div className="flex items-center space-x-2 text-emerald-900 font-extrabold uppercase tracking-tight">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>AquaTwin Honest AI Guarantee</span>
        </div>
        <p className="leading-relaxed text-emerald-900">
          Field photos provide <strong>qualitative observations only</strong> (canopy health, visible stress, surface dry/wet state). AquaTwin never claims phone photos measure exact moisture percentages or litres. All water allocation is calculated scientifically using FAO-56 evapotranspiration models, crop sensitivity factors (Ky), and weather forecast uncertainty.
        </p>
        {photosCount === 0 && (
          <p className="text-emerald-800 text-[11px] font-semibold italic flex items-center">
            <Info className="w-3.5 h-3.5 inline mr-1 text-emerald-700 shrink-0" />
            <span>Zero photos added: AquaTwin functions at 100% full capacity using standard agronomic baselines.</span>
          </p>
        )}
      </div>

      {/* Navigation & Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBackToFields}
          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
        >
          Back to Fields
        </button>

        <button
          type="button"
          onClick={onCreateFarmTwin}
          className="flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-eco-900 via-eco-800 to-emerald-800 hover:from-eco-800 hover:to-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-eco-900/20 transition-all active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-aqua-300" />
          <span>CREATE & ACTIVATE FARM TWIN</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
