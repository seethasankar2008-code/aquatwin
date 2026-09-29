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
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-600'
        };
      case 'HIGH':
        return { 
          label: t.high, 
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500'
        };
      case 'MODERATE':
        return { 
          label: t.moderate, 
          bg: 'bg-yellow-50 text-yellow-800 border-yellow-300',
          dot: 'bg-yellow-500'
        };
      case 'LOW':
      default:
        return { 
          label: t.healthy, 
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600'
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-base sm:text-lg font-extrabold text-slate-900 tracking-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
            {t.digitalFarmTwin}
          </h3>
          <p className="text-xs text-slate-500">
            {t.digitalFarmTwinSub}
          </p>
        </div>
        <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 shadow-2xs">
          {fields.length} Active Zones
        </span>
      </div>

      {/* Grid of Farm Plots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map((field) => {
          const stressBadge = getStressBadge(field.currentStress);
          const isSelected = field.id === activeId;
          const isTopPriority = field.priorityScore >= 85;

          return (
            <div
              key={field.id}
              onClick={() => handleFieldClick(field.id)}
              className={`relative bg-white rounded-2xl p-5 border cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-cyan-500 ring-2 ring-cyan-400/40 shadow-sm'
                  : isTopPriority
                  ? 'border-amber-300/80 bg-amber-50/15 hover:border-amber-400'
                  : 'border-sky-100/90 hover:border-sky-300 shadow-2xs'
              }`}
            >
              {/* Top Row: Field ID, Crop, and Stress Badge */}
              <div className="flex items-start justify-between mb-3.5">
                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl border ${
                    isTopPriority 
                      ? 'bg-amber-100/80 text-amber-800 border-amber-200' 
                      : 'bg-sky-50 text-sky-800 border-sky-100'
                  }`}>
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center space-x-1.5">
                      <span>{field.name}</span>
                      {isTopPriority && (
                        <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[9px] rounded-md font-extrabold uppercase tracking-wider">
                          PRIORITY
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center space-x-1.5 flex-wrap">
                      <span className="font-semibold text-slate-700">{field.crop}</span> • <span className="italic">{field.growthStage}</span>
                      {field.visualAnalysis && (
                        <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded-md bg-cyan-50 text-cyan-900 text-[9px] font-extrabold border border-cyan-200">
                          <span>📷 Visual</span>
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${stressBadge.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${stressBadge.dot}`} />
                  <span>{stressBadge.label}</span>
                </span>
              </div>

              {/* Moisture Bar Gauge */}
              <div className="my-3 bg-sky-50/60 rounded-xl p-3 border border-sky-100/80">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-slate-500 font-semibold">{t.soilMoisture}:</span>
                  <span className="font-extrabold font-mono text-slate-900">
                    {field.soilMoisture}% <span className="text-slate-400 font-normal">/ {field.targetMoisture}% target</span>
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      field.soilMoisture < 25
                        ? 'bg-rose-500'
                        : field.soilMoisture < 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (field.soilMoisture / field.targetMoisture) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Allocation & Priority Details */}
              <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-sky-100/70 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-tight">{t.allocationL}</span>
                  <span className="font-extrabold text-sky-800 text-sm font-mono block">
                    {field.allocation.toLocaleString()} L
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Demand: {field.waterDemand.toLocaleString()} L
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-tight">{t.priorityScore}</span>
                  <div className="flex items-center space-x-1">
                    <span className="font-extrabold text-slate-900 text-sm font-mono">
                      {field.priorityScore}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
                  </div>
                  <span className="text-[10px] text-sky-700 font-semibold block">
                    Marginal Benefit: {field.marginalBenefit}/100
                  </span>
                </div>
              </div>

              {/* Bottom Quick Horizon Tag */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-sky-50/70 px-3 py-1.5 rounded-lg border border-sky-100">
                <span className="flex items-center text-slate-600">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  +12h Horizon: <strong className="ml-1 text-slate-900 font-semibold">{field.futureStress.plus12h}</strong>
                </span>
                <span className="flex items-center text-sky-700 font-bold group-hover:translate-x-0.5 transition-transform">
                  Telemetry <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Field Intelligence Detail Modal/Drawer if selected */}
      {selectedField && (
        <div className="mt-4 bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-700/80 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                  FIELD INTELLIGENCE DOSSIER
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {selectedField.id}</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
                {selectedField.name} — {selectedField.crop} ({selectedField.growthStage})
              </h4>
            </div>
            <button
              onClick={() => handleFieldClick(selectedField.id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            {/* Agronomic Profile */}
            <div className="bg-slate-800/80 rounded-2xl p-4.5 border border-slate-700/70">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center">
                <Sprout className="w-4 h-4 mr-1.5 text-emerald-400" />
                Agronomic Parameters
              </h5>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Field Area:</span>
                  <span className="font-semibold text-white">{selectedField.area} Hectares</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Soil Classification:</span>
                  <span className="font-semibold text-white">{selectedField.soilType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Root Moisture:</span>
                  <span className="font-bold text-amber-400 font-mono">{selectedField.soilMoisture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Field Capacity Target:</span>
                  <span className="font-semibold text-white font-mono">{selectedField.targetMoisture}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Yield Sensitivity (Ky):</span>
                  <span className="font-bold text-aqua-300 font-mono">{selectedField.stageSensitivityKy} (High)</span>
                </div>
              </div>
            </div>

            {/* Decision & Marginal Benefit */}
            <div className="bg-slate-800/80 rounded-2xl p-4.5 border border-slate-700/70">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center">
                <Droplet className="w-4 h-4 mr-1.5 text-cyan-400" />
                Optimization Metrics
              </h5>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Recommended Allocation:</span>
                  <span className="font-extrabold text-cyan-300 text-sm font-mono">
                    {selectedField.allocation.toLocaleString()} L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Agronomic Water Demand:</span>
                  <span className="font-semibold text-white font-mono">{selectedField.waterDemand.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Priority Score:</span>
                  <span className="font-bold text-amber-400 font-mono">{selectedField.priorityScore}/100 ({selectedField.priorityLevel})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Marginal Water Benefit:</span>
                  <span className="font-bold text-cyan-400 font-mono">{selectedField.marginalBenefit}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Decision Confidence:</span>
                  <span className="font-semibold text-white font-mono">{selectedField.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Why This Decision Factors */}
            <div className="bg-slate-800/80 rounded-2xl p-4.5 border border-slate-700/70">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-cyan-400" />
                Why this allocation?
              </h5>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedField.reasons.map((r, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-cyan-400 mr-2 font-bold">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Field Visual Observation Card (if present) */}
          {selectedField.visualAnalysis && (
            <div className="mt-5 p-4.5 rounded-2xl bg-slate-800/90 border border-cyan-500/40 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">📷</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Field Visual Analysis (Qualitative Observation)
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Captured: {selectedField.visualAnalysis.timestamp}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {selectedField.visualAnalysis.photoUrl && (
                  <img
                    src={selectedField.visualAnalysis.photoUrl}
                    alt={selectedField.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-600 shrink-0 shadow-md"
                  />
                )}
                <div className="space-y-2 flex-1 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Canopy Appearance</span>
                      <span className="font-extrabold text-emerald-400 mt-0.5 block">{selectedField.visualAnalysis.cropAppearance}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Surface Moisture</span>
                      <span className="font-extrabold text-cyan-300 mt-0.5 block">{selectedField.visualAnalysis.surfaceCondition}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Visible Stress</span>
                      <span className="font-extrabold text-amber-300 mt-0.5 block">{selectedField.visualAnalysis.visibleStress}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/60">
                      <span className="text-[10px] text-slate-400 block">Visual Confidence</span>
                      <span className="font-extrabold text-slate-200 mt-0.5 block">{selectedField.visualAnalysis.confidence}</span>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-700/40">
                    "{selectedField.visualAnalysis.observation}"
                  </p>

                  <p className="text-[10px] text-slate-400 font-medium">
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
