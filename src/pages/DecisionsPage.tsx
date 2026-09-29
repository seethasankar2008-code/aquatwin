import React, { useState } from 'react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { 
  CheckCircle2, 
  History, 
  Sparkles, 
  Award,
  ChevronRight
} from 'lucide-react';

interface DecisionsPageProps {
  farmState: FarmState;
  language: Language;
  onSelectField?: (fieldId: string) => void;
}

export const DecisionsPage: React.FC<DecisionsPageProps> = ({
  farmState,
  language,
  onSelectField,
}) => {
  const t = translations[language];
  const [activeExplainId, setActiveExplainId] = useState<string>('field-03');

  // Sorted by Priority Score descending
  const sortedFields = [...farmState.fields].sort((a, b) => b.priorityScore - a.priorityScore);
  const selectedField = farmState.fields.find((f) => f.id === activeExplainId) || sortedFields[0];

  const timelineSteps = [
    {
      time: '09:00',
      title: 'Baseline Assessment',
      detail: 'Sensors report stable root-zone moisture; standard operational reserve maintained at 15%.',
      status: 'normal',
    },
    {
      time: '10:30',
      title: 'Atmospheric Heating Variance',
      detail: `Ambient temperature rose to ${farmState.weather.temperature}°C, accelerating reference ET0 to ${farmState.weather.et0} mm/d.`,
      status: 'alert',
    },
    {
      time: '10:42',
      title: 'Future Stress Horizon Detected',
      detail: 'Field 03 (Tomato) and Field 04 (Maize) projected to breach wilting thresholds in +12h.',
      status: 'warning',
    },
    {
      time: '10:45',
      title: 'Marginal Water Benefit Optimization',
      detail: 'Optimizer prioritized flowering tomato due to zero yield elasticity and high blossom drop risk.',
      status: 'success',
    },
    {
      time: '10:46',
      title: 'Deterministic Allocation Executed',
      detail: `Allocated ${farmState.waterBudget.allocatedWater.toLocaleString()} L; dynamic resilience reserve guarded at ${farmState.waterBudget.reserveWater.toLocaleString()} L.`,
      status: 'success',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2.5">
          <span className="p-2 rounded-xl bg-eco-100 text-eco-800 border border-eco-200 shadow-2xs">
            <Award className="w-5 h-5" />
          </span>
          <div>
            <h2 className={`text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.decisionsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.decisionsSub}
            </p>
          </div>
        </div>
      </div>

      {/* Priority & Allocation Ranking Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              Ranked Water Allocation Roster
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked strictly by Priority Score and Marginal Water Benefit (Click any row to inspect explainability)
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-eco-50 text-eco-900 rounded-full border border-eco-200 shadow-2xs">
            Sorted by Agronomic Urgency
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-extrabold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3.5">Rank</th>
                <th className="py-3 px-3.5">Field / Plot</th>
                <th className="py-3 px-3.5">Crop</th>
                <th className="py-3 px-3.5">Growth Stage</th>
                <th className="py-3 px-3.5">Root Moisture</th>
                <th className="py-3 px-3.5 text-center">Priority</th>
                <th className="py-3 px-3.5 text-center">Marginal Benefit</th>
                <th className="py-3 px-3.5 text-right">Allocation</th>
                <th className="py-3 px-3.5 text-center">Confidence</th>
                <th className="py-3 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedFields.map((field, idx) => {
                const isSelected = field.id === activeExplainId;
                return (
                  <tr
                    key={field.id}
                    onClick={() => setActiveExplainId(field.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-aqua-50/70 border-l-4 border-aqua-600 font-medium'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-3.5 px-3.5 font-mono font-extrabold text-slate-400">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                      {field.name}
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-700 whitespace-nowrap font-medium">
                      {field.crop}
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-600 italic whitespace-nowrap">
                      {field.growthStage}
                    </td>
                    <td className="py-3.5 px-3.5 whitespace-nowrap font-mono font-semibold">
                      <span className={field.soilMoisture < 25 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                        {field.soilMoisture}%
                      </span>
                      <span className="text-slate-400 text-[10px] font-normal"> / {field.targetMoisture}%</span>
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          field.priorityScore >= 82
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : field.priorityScore >= 68
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {field.priorityScore}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <span className="font-extrabold text-eco-700 font-mono text-sm">
                        {field.marginalBenefit}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-mono font-extrabold text-aqua-950 text-sm">
                      {field.allocation.toLocaleString()} L
                    </td>
                    <td className="py-3.5 px-3.5 text-center text-slate-600 font-mono font-medium">
                      {field.confidence}%
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveExplainId(field.id);
                          onSelectField?.(field.id);
                        }}
                        className="text-aqua-800 hover:text-aqua-950 font-bold text-[11px] underline underline-offset-2"
                      >
                        Explain Why
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep Explainable AI Inspector ("WHY DID FIELD X RECEIVE THIS MUCH WATER?") */}
      {selectedField && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-aqua-500/20 text-aqua-400">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="text-xs font-extrabold text-aqua-300 uppercase tracking-wider">
                  EXPLAINABLE AI ENGINE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
                Why was {selectedField.allocation.toLocaleString()} L allocated to {selectedField.name}?
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs border border-slate-700 font-medium shadow-2xs">
                Confidence: <strong className="text-aqua-300 font-mono">{selectedField.confidence}%</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Factor Decomposition */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Agronomic & Meteorological Decision Factors
              </h4>
              <div className="space-y-2.5">
                {selectedField.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/70 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block mb-0.5">Factor {idx + 1}</span>
                      <p className="text-slate-300 leading-relaxed font-normal">{reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marginal Benefit Analysis */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-aqua-300 uppercase tracking-wider mb-2">
                  Marginal Benefit Concept Explained
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  AquaTwin does not merely water the driest soil. It evaluates the{' '}
                  <strong className="text-white font-semibold">marginal yield return of the next litre</strong>.
                  Because {selectedField.crop} is currently in the{' '}
                  <strong className="text-aqua-300">{selectedField.growthStage}</strong> stage, moisture stress causes irreversible physiological flower/fruit abortion. Resilient vegetative crops can safely endure controlled deficit.
                </p>

                <div className="space-y-2 text-xs pt-3.5 border-t border-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Yield Response Sensitivity (Ky):</span>
                    <span className="font-mono font-bold text-white">{selectedField.stageSensitivityKy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Marginal Water Benefit Score:</span>
                    <span className="font-mono font-bold text-emerald-400">{selectedField.marginalBenefit} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trajectory Horizon Stress (+12h):</span>
                    <span className="font-mono font-bold text-rose-400">{selectedField.futureStress.plus12h}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">Deterministic Constraint:</span>{' '}
                Total farm allocation remains strictly bounded by Available Water minus Dynamic Resilience Reserve.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adaptation Timeline (Section 32 in prompt) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-5 pb-3.5 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-eco-100 text-eco-800">
            <History className="w-4 h-4" />
          </div>
          <h3 className={`text-sm font-extrabold uppercase tracking-wider text-slate-900 ${language === 'ta' ? 'font-tamil' : ''}`}>
            {t.adaptationTimeline} (Change → Reasoning → Action)
          </h3>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timelineSteps.map((step, i) => (
            <div key={i} className="relative text-xs">
              <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-eco-700 ring-4 ring-eco-100" />
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="font-mono font-extrabold text-eco-900">{step.time}</span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{step.title}</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-normal">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
