import React, { useState } from 'react';
import { 
  FieldState, 
  Language, 
  StressLevel 
} from '../types/farm';
import { translations } from '../i18n/translations';
import { 
  Sprout, 
  Droplet, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  X
} from 'lucide-react';

interface DigitalTwinGridProps {
  fields: FieldState[];
  language: Language;
  selectedFieldId?: string | null;
  onSelectField?: (fieldId: string) => void;
}

export const DigitalTwinGrid: React.FC<DigitalTwinGridProps> = ({
  fields,
  language,
  selectedFieldId: controlledSelectedId,
  onSelectField,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const activeId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;
  const t = translations[language];

  const handleFieldClick = (id: string) => {
    if (onSelectField) {
      onSelectField(id);
    } else {
      setInternalSelectedId(id === internalSelectedId ? null : id);
    }
  };

  const selectedField = fields.find((f) => f.id === activeId);

  const getStressBadge = (stress: StressLevel) => {
    switch (stress) {
      case 'CRITICAL':
        return { 
          label: t.critical, 
          bg: 'bg-rose-50 text-rose-750 border-rose-200 font-bold',
          dot: 'bg-rose-500'
        };
      case 'HIGH':
        return { 
          label: t.high, 
          bg: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
          dot: 'bg-amber-500'
        };
      case 'MODERATE':
        return { 
          label: t.moderate, 
          bg: 'bg-sky-50 text-sky-800 border-sky-200 font-bold',
          dot: 'bg-sky-500'
        };
      case 'LOW':
      default:
        return { 
          label: t.healthy, 
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
          dot: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-base sm:text-lg font-black font-display text-sky-950 tracking-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
            {t.digitalFarmTwin}
          </h3>
          <p className="text-xs text-slate-500">
            {t.digitalFarmTwinSub}
          </p>
        </div>
        <span className="text-[11px] font-bold text-water-700 bg-sky-100/70 px-3 py-1 rounded-full border border-sky-200/80 shadow-xs">
          {fields.length} Active Zones
        </span>
      </div>

      {/* Grid of Farm Plots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {fields.map((field) => {
          const stressBadge = getStressBadge(field.currentStress);
          const isSelected = field.id === activeId;
          const isTopPriority = field.priorityScore >= 85;

          return (
            <div
              key={field.id}
              onClick={() => handleFieldClick(field.id)}
              className={`relative bg-white/95 rounded-xl p-4 sm:p-4.5 border cursor-pointer transition-all duration-150 hover:shadow-md ${
                isSelected
                  ? 'border-water-600 ring-2 ring-water-500/30 shadow-md'
                  : isTopPriority
                  ? 'border-amber-300 bg-amber-50/25 hover:border-amber-400'
                  : 'border-sky-200/90 hover:border-sky-300 shadow-xs'
              }`}
            >
              {/* Top Row: Field ID, Crop, and Stress Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-1.5 rounded-lg border ${
                    isTopPriority 
                      ? 'bg-amber-100/80 text-amber-900 border-amber-300' 
                      : 'bg-sky-50 text-water-700 border-sky-200'
                  }`}>
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-sky-950 flex items-center space-x-1.5 font-display">
                      <span>{field.name}</span>
                      {isTopPriority && (
                        <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[9px] rounded font-bold uppercase tracking-wider border border-amber-300">
                          Priority
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-600 flex items-center space-x-1.5 flex-wrap font-medium">
                      <span className="font-bold text-slate-800">{field.crop}</span>
                      <span>•</span>
                      <span className="italic">{field.growthStage}</span>
                      {field.visualAnalysis && (
                        <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded bg-sky-100 text-water-800 text-[9px] font-bold border border-sky-300">
                          <span>📷 Visual</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <span className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${stressBadge.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${stressBadge.dot}`} />
                  <span>{stressBadge.label}</span>
                </span>
              </div>

              {/* Direct Moisture Progress Track */}
              <div className="my-2.5 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-semibold text-[11px]">{t.soilMoisture}:</span>
                  <span className="font-black font-mono tabular-nums text-sky-950 text-xs">
                    {field.soilMoisture}% <span className="text-slate-500 font-normal text-[11px]">/ {field.targetMoisture}% target</span>
                  </span>
                </div>
                <div className="w-full bg-sky-100/80 rounded-full h-2 overflow-hidden border border-sky-200/50">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      field.soilMoisture < 25
                        ? 'bg-rose-500'
                        : field.soilMoisture < 40
                        ? 'bg-amber-500'
                        : 'bg-water-600'
                    }`}
                    style={{ width: `${Math.min(100, (field.soilMoisture / field.targetMoisture) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Allocation & Priority Details */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sky-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-tight">{t.allocationL}</span>
                  <span className="font-black text-water-700 text-xs sm:text-sm font-mono block tabular-nums">
                    {field.allocation.toLocaleString()} L
                  </span>
                  <span className="text-[10px] text-slate-600 font-medium font-mono block tabular-nums">
                    Demand: {field.waterDemand.toLocaleString()} L
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-600 block uppercase tracking-tight">{t.priorityScore}</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-black text-sky-950 text-xs sm:text-sm font-mono tabular-nums">
                      {field.priorityScore}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono font-medium">/ 100</span>
                  </div>
                  <span className="text-[10px] text-slate-700 font-medium block truncate">
                    Benefit: {field.marginalBenefit}/100
                  </span>
                </div>
              </div>

              {/* Bottom Quick Horizon Tag */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-700 font-medium pt-2 border-t border-sky-100">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  +12h: <strong className="ml-1 text-slate-800 font-semibold">{field.futureStress.plus12h}</strong>
                </span>
                <span className="flex items-center text-water-600 font-semibold group-hover:translate-x-0.5 transition-transform text-xs">
                  Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Field Intelligence Detail Modal/Drawer if selected */}
      {selectedField && (
        <div className="mt-4 bg-white text-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md animate-in fade-in duration-200">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-water-50 text-water-700 border border-water-200 uppercase tracking-wider">
                  Field Intelligence Dossier
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {selectedField.id}</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold font-display text-slate-900 mt-1">
                {selectedField.name} — {selectedField.crop} ({selectedField.growthStage})
              </h4>
            </div>
            <button
              onClick={() => handleFieldClick(selectedField.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Agronomic Profile */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center">
                <Sprout className="w-4 h-4 mr-1.5 text-emerald-600" />
                Agronomic Parameters
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Field Area:</span>
                  <span className="font-medium text-slate-900">{selectedField.area} Hectares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Soil Classification:</span>
                  <span className="font-medium text-slate-900">{selectedField.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Root Moisture:</span>
                  <span className="font-bold text-amber-600 font-mono">{selectedField.soilMoisture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Field Capacity Target:</span>
                  <span className="font-medium text-slate-900 font-mono">{selectedField.targetMoisture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Yield Sensitivity (Ky):</span>
                  <span className="font-bold text-water-700 font-mono">{selectedField.stageSensitivityKy} (High)</span>
                </div>
              </div>
            </div>

            {/* Decision & Marginal Benefit */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center">
                <Droplet className="w-4 h-4 mr-1.5 text-water-600" />
                Optimization Metrics
              </h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recommended Allocation:</span>
                  <span className="font-bold text-water-700 text-xs sm:text-sm font-mono">
                    {selectedField.allocation.toLocaleString()} L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Agronomic Water Demand:</span>
                  <span className="font-medium text-slate-900 font-mono">{selectedField.waterDemand.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Priority Score:</span>
                  <span className="font-bold text-amber-600 font-mono">{selectedField.priorityScore}/100 ({selectedField.priorityLevel})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Marginal Water Benefit:</span>
                  <span className="font-bold text-water-700 font-mono">{selectedField.marginalBenefit}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Decision Confidence:</span>
                  <span className="font-medium text-slate-900 font-mono">{selectedField.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Why This Decision Factors */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-water-600" />
                Why this allocation?
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedField.reasons.map((r, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-water-600 mr-2 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Field Visual Observation Card (if present) */}
          {selectedField.visualAnalysis && (
            <div className="mt-5 p-4.5 rounded-2xl bg-sky-50/70 border border-sky-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-sky-200/80 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">📷</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-water-700">
                    Field Visual Analysis (Qualitative Observation)
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  Captured: {selectedField.visualAnalysis.timestamp}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {selectedField.visualAnalysis.photoUrl && (
                  <img
                    src={selectedField.visualAnalysis.photoUrl}
                    alt={selectedField.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-sky-200 shrink-0 shadow-sm"
                  />
                )}
                <div className="space-y-2 flex-1 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-white p-2 rounded-xl border border-sky-200/70">
                      <span className="text-[10px] text-slate-500 block">Canopy Appearance</span>
                      <span className="font-extrabold text-emerald-600 mt-0.5 block">{selectedField.visualAnalysis.cropAppearance}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-sky-200/70">
                      <span className="text-[10px] text-slate-500 block">Surface Moisture</span>
                      <span className="font-extrabold text-water-600 mt-0.5 block">{selectedField.visualAnalysis.surfaceCondition}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-sky-200/70">
                      <span className="text-[10px] text-slate-500 block">Visible Stress</span>
                      <span className="font-extrabold text-amber-600 mt-0.5 block">{selectedField.visualAnalysis.visibleStress}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-sky-200/70">
                      <span className="text-[10px] text-slate-500 block">Visual Confidence</span>
                      <span className="font-extrabold text-slate-800 mt-0.5 block">{selectedField.visualAnalysis.confidence}</span>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed italic bg-white/80 p-2.5 rounded-xl border border-sky-200/60">
                    "{selectedField.visualAnalysis.observation}"
                  </p>

                  <p className="text-[10px] text-slate-500 font-medium">
                    ⚠️ {selectedField.visualAnalysis.disclaimer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
