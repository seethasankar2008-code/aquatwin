import React, { useState } from 'react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { 
  CheckCircle2, 
  History, 
  Compass, 
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
      <div className="pb-5 border-b border-sky-200/80">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-sky-100 text-water-700 border border-sky-300 shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-2xl font-black font-display text-sky-950 tracking-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.decisionsTitle}
            </h2>
            <p className="text-sm text-slate-700 font-medium mt-1">
              {t.decisionsSub}
            </p>
          </div>
        </div>
      </div>

      {/* Priority & Allocation Ranking Table */}
      <div className="bg-white/92 backdrop-blur-sm rounded-xl p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3.5 border-b border-sky-100">
          <div>
            <h3 className="text-sm font-black font-display uppercase tracking-wider text-sky-950">
              Ranked Water Allocation Roster
            </h3>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              Ranked strictly by Priority Score and Marginal Water Benefit (Click any row to inspect explainability)
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-sky-100 text-sky-900 rounded-full border border-sky-300">
            Sorted by Agronomic Urgency
          </span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-sky-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sky-200 bg-sky-100/80 text-sky-950 font-black uppercase tracking-wider text-[11px]">
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
            <tbody className="divide-y divide-sky-100">
              {sortedFields.map((field, idx) => {
                const isSelected = field.id === activeExplainId;
                return (
                  <tr
                    key={field.id}
                    onClick={() => setActiveExplainId(field.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-sky-100/70 border-l-4 border-water-600 font-bold'
                        : 'hover:bg-sky-50/70'
                    }`}
                  >
                    <td className="py-3.5 px-3.5 font-mono font-bold text-slate-500">
                      #{idx + 1}
                    </td>
                    <td className="py-3.5 px-3.5 font-bold font-display text-sky-950 whitespace-nowrap">
                      {field.name}
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-800 whitespace-nowrap font-bold">
                      {field.crop}
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-600 italic whitespace-nowrap font-medium">
                      {field.growthStage}
                    </td>
                    <td className="py-3.5 px-3.5 whitespace-nowrap font-mono font-medium">
                      <span className={field.soilMoisture < 25 ? 'text-rose-600 font-bold' : 'text-slate-900 font-bold'}>
                        {field.soilMoisture}%
                      </span>
                      <span className="text-slate-500 text-[10px] font-medium"> / {field.targetMoisture}%</span>
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          field.priorityScore >= 82
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : field.priorityScore >= 68
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-water-50 text-water-700 border-water-200'
                        }`}
                      >
                        {field.priorityScore}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <span className="font-bold text-water-600 font-mono text-sm">
                        {field.marginalBenefit}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-mono font-bold text-slate-900 text-sm">
                      {field.allocation.toLocaleString()} L
                    </td>
                    <td className="py-3.5 px-3.5 text-center text-slate-500 font-mono font-medium">
                      {field.confidence}%
                    </td>
                    <td className="py-3.5 px-3.5 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveExplainId(field.id);
                          onSelectField?.(field.id);
                        }}
                        className="text-water-600 hover:text-water-700 font-bold text-[11px] underline underline-offset-2 transition-colors"
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

      {/* Deep Explainable AI Inspector */}
      {selectedField && (
        <div className="bg-white/92 backdrop-blur-sm rounded-xl p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-sky-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-sky-100 text-water-700 border border-sky-300">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="text-xs font-black text-water-800 uppercase tracking-wider">
                  Explainable Decision Intelligence
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-display text-sky-950 mt-1.5">
                Why was {selectedField.allocation.toLocaleString()} L allocated to {selectedField.name}?
              </h3>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-950 text-xs border border-sky-300 font-bold shadow-xs">
                Confidence: <strong className="text-water-700 font-mono font-black">{selectedField.confidence}%</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Factor Decomposition */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-sky-950 uppercase tracking-wider">
                Agronomic & Meteorological Decision Factors
              </h4>
              <div className="space-y-2.5">
                {selectedField.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 rounded-lg bg-sky-50/70 border border-sky-200/80 text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black font-display text-sky-950 block mb-0.5">Factor {idx + 1}</span>
                      <p className="text-slate-800 leading-relaxed font-medium">{reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Marginal Benefit Analysis */}
            <div className="bg-sky-50/70 rounded-lg p-5 border border-sky-200/80 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-black text-sky-950 uppercase tracking-wider mb-2">
                  Marginal Benefit Concept Explained
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed mb-4 font-medium">
                  AquaTwin does not merely water the driest soil. It evaluates the{' '}
                  <strong className="text-slate-950 font-black">marginal yield return of the next litre</strong>.
                  Because {selectedField.crop} is currently in the{' '}
                  <strong className="text-water-800 font-bold">{selectedField.growthStage}</strong> stage, moisture stress causes irreversible physiological flower/fruit abortion. Resilient vegetative crops can safely endure controlled deficit.
                </p>

                <div className="space-y-2.5 text-xs pt-3.5 border-t border-sky-200">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">Yield Response Sensitivity (Ky):</span>
                    <span className="font-mono font-bold text-sky-950">{selectedField.stageSensitivityKy}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">Marginal Water Benefit Score:</span>
                    <span className="font-mono font-black text-emerald-700">{selectedField.marginalBenefit} / 100</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700">Trajectory Horizon Stress (+12h):</span>
                    <span className="font-mono font-bold text-rose-600">{selectedField.futureStress.plus12h}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-white/95 border border-sky-200 text-[11px] text-slate-700 font-medium">
                <span className="font-black text-sky-950">Deterministic Constraint:</span>{' '}
                Total farm allocation remains strictly bounded by Available Water minus Dynamic Resilience Reserve.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adaptation Timeline */}
      <div className="bg-white/92 backdrop-blur-sm rounded-xl p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5">
        <div className="flex items-center space-x-2.5 mb-5 pb-3.5 border-b border-slate-100">
          <div className="p-1.5 rounded-lg bg-water-50 border border-water-200/60 text-water-600">
            <History className="w-4 h-4" />
          </div>
          <h3 className={`text-sm font-bold font-display uppercase tracking-wider text-slate-900 ${language === 'ta' ? 'font-tamil' : ''}`}>
            {t.adaptationTimeline} (Change → Reasoning → Action)
          </h3>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {timelineSteps.map((step, i) => (
            <div key={i} className="relative text-xs">
              <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-water-600 ring-4 ring-water-100" />
              <div className="flex items-baseline space-x-2 mb-1">
                <span className="font-mono font-bold text-water-600">{step.time}</span>
                <span className="font-bold font-display text-slate-900 text-xs sm:text-sm">{step.title}</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-normal">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
