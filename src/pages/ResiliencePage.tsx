import React from 'react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { generateBaselineComparison, getSecondaryTelemetry } from '../engine/scenarioEngine';
import { 
  ShieldCheck, 
  Droplet, 
  CloudRain, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert
} from 'lucide-react';

interface ResiliencePageProps {
  farmState: FarmState;
  language: Language;
}

export const ResiliencePage: React.FC<ResiliencePageProps> = ({ farmState, language }) => {
  const t = translations[language];
  const comparison = generateBaselineComparison(farmState);
  const secondary = getSecondaryTelemetry(farmState);
  const { waterBudget } = farmState;

  // Water Bank distribution percentages
  const allocatedPct = Math.round((waterBudget.allocatedWater / waterBudget.availableWater) * 100);
  const reservePct = Math.round((waterBudget.reserveWater / waterBudget.availableWater) * 100);
  const uncommittedPct = Math.max(0, 100 - allocatedPct - reservePct);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2.5">
          <span className="p-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-200 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h2 className={`text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.resilienceTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.resilienceSub}
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC WATER BANK & WATER JOURNEY (Section 10, 11, 24) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
              {t.waterBank} — Complete Hydraulic Balance
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic conservation: Available = Allocated + Resilience Reserve + Uncommitted
            </p>
          </div>
          <span className="font-mono text-xs font-extrabold px-3 py-1.5 bg-cyan-50 text-cyan-950 rounded-xl border border-cyan-200 shadow-2xs">
            Total Pool: {waterBudget.availableWater.toLocaleString()} L
          </span>
        </div>

        {/* Visual Stacked Progress Bar (Water Level Inspired) */}
        <div className="space-y-3 mb-6">
          <div className="h-7 w-full rounded-2xl bg-slate-100 p-1 flex gap-1.5 overflow-hidden border border-slate-200/80 shadow-inner">
            <div
              className="bg-gradient-to-r from-cyan-600 to-sky-500 rounded-xl h-full transition-all duration-500 relative group flex items-center justify-center text-[10px] font-bold text-white font-mono"
              style={{ width: `${allocatedPct}%` }}
              title={`Allocated: ${waterBudget.allocatedWater.toLocaleString()} L (${allocatedPct}%)`}
            >
              {allocatedPct > 12 && `${allocatedPct}%`}
            </div>
            <div
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl h-full transition-all duration-500 relative group flex items-center justify-center text-[10px] font-bold text-white font-mono"
              style={{ width: `${reservePct}%` }}
              title={`Reserve: ${waterBudget.reserveWater.toLocaleString()} L (${reservePct}%)`}
            >
              {reservePct > 10 && `${reservePct}%`}
            </div>
            {uncommittedPct > 0 && (
              <div
                className="bg-slate-300 rounded-xl h-full transition-all duration-500 relative group flex items-center justify-center text-[10px] font-bold text-slate-700 font-mono"
                style={{ width: `${uncommittedPct}%` }}
                title={`Uncommitted: ${waterBudget.uncommittedWater.toLocaleString()} L (${uncommittedPct}%)`}
              >
                {uncommittedPct > 8 && `${uncommittedPct}%`}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 font-medium px-1">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-cyan-600 shrink-0" />
              <span>Allocated: <strong className="text-slate-900 font-mono font-bold">{waterBudget.allocatedWater.toLocaleString()} L</strong> ({allocatedPct}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
              <span>Resilience Reserve: <strong className="text-slate-900 font-mono font-bold">{waterBudget.reserveWater.toLocaleString()} L</strong> ({reservePct}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
              <span>Uncommitted Buffer: <strong className="text-slate-900 font-mono font-bold">{waterBudget.uncommittedWater.toLocaleString()} L</strong> ({uncommittedPct}%)</span>
            </div>
          </div>
        </div>

        {/* Water Journey Flow (Section 24 in prompt) */}
        <div className="bg-sky-50/50 rounded-2xl p-4.5 border border-sky-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Water Journey: Distribution Flow Architecture
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
            {farmState.fields.map((f) => (
              <div key={f.id} className="bg-white p-3 rounded-xl border border-sky-100 text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 block truncate">{f.name.split(' - ')[0]}</span>
                <span className="font-extrabold text-slate-800 text-[11px] block truncate">{f.crop}</span>
                <span className="font-extrabold text-sky-800 font-mono text-xs block mt-1">
                  {f.allocation.toLocaleString()} L
                </span>
              </div>
            ))}
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center shadow-2xs">
              <span className="text-[10px] text-emerald-700 block font-semibold">Defense</span>
              <span className="font-extrabold text-emerald-950 text-[11px] block">Reserve</span>
              <span className="font-extrabold text-emerald-700 font-mono text-xs block mt-1">
                {waterBudget.reserveWater.toLocaleString()} L
              </span>
            </div>
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-300 text-center shadow-2xs">
              <span className="text-[10px] text-slate-500 block font-semibold">Surplus</span>
              <span className="font-extrabold text-slate-800 text-[11px] block">Uncommitted</span>
              <span className="font-extrabold text-slate-800 font-mono text-xs block mt-1">
                {waterBudget.uncommittedWater.toLocaleString()} L
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SIMULATED BASELINE COMPARISON (Section 25 & 57 in prompt) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3.5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-sky-100 text-sky-800 uppercase tracking-wider">
                SIMULATED COMPARISON
              </span>
              <h3 className={`text-base font-extrabold text-slate-900 ${language === 'ta' ? 'font-tamil' : ''}`}>
                {t.simulatedBaselineComparison}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Identical farm conditions evaluated against standard conventional irrigation schedules
            </p>
          </div>
          <span className="text-[11px] text-slate-400 italic">
            *Deterministic agronomic model output
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {/* Fixed Schedule */}
          <div className="bg-slate-50/90 rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wide">
                  {t.fixedSchedule}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
                  58% Score
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Water Allocated:</span>
                  <span className="font-mono font-bold text-slate-800">{comparison.fixedSchedule.waterAllocated.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Useful Water Delivered:</span>
                  <span className="font-mono font-bold text-slate-700">{comparison.fixedSchedule.usefulWaterDelivered.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unmet Deficit Demand:</span>
                  <span className="font-mono font-bold text-rose-600">{comparison.fixedSchedule.unmetDemand.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stress Exposure Hours:</span>
                  <span className="font-mono font-bold text-rose-600">{comparison.fixedSchedule.stressHours} hrs</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 mt-3 flex justify-between text-xs">
              <span className="text-slate-500">Reserve Protected:</span>
              <span className="font-mono font-bold text-slate-400">0 L (Vulnerable)</span>
            </div>
          </div>

          {/* Equal Allocation */}
          <div className="bg-slate-50/90 rounded-2xl p-4.5 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wide">
                  {t.equalAllocation}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700">
                  68% Score
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Water Allocated:</span>
                  <span className="font-mono font-bold text-slate-800">{comparison.equalAllocation.waterAllocated.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Useful Water Delivered:</span>
                  <span className="font-mono font-bold text-slate-700">{comparison.equalAllocation.usefulWaterDelivered.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unmet Deficit Demand:</span>
                  <span className="font-mono font-bold text-amber-700">{comparison.equalAllocation.unmetDemand.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stress Exposure Hours:</span>
                  <span className="font-mono font-bold text-amber-700">{comparison.equalAllocation.stressHours} hrs</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 mt-3 flex justify-between text-xs">
              <span className="text-slate-500">Reserve Protected:</span>
              <span className="font-mono font-bold text-slate-700">500 L</span>
            </div>
          </div>

          {/* AquaTwin System */}
          <div className="bg-gradient-to-br from-sky-50/80 via-white to-cyan-50/80 rounded-2xl p-4.5 border-2 border-sky-600 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="font-extrabold text-xs text-sky-950 uppercase tracking-wide flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                  {t.aquaTwinSystem}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-700 text-white shadow-2xs">
                  94% Score
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-sky-950 font-semibold">Water Allocated:</span>
                  <span className="font-mono font-extrabold text-slate-900">{comparison.aquaTwin.waterAllocated.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-950 font-semibold">Useful Water Delivered:</span>
                  <span className="font-mono font-extrabold text-emerald-700">{comparison.aquaTwin.usefulWaterDelivered.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-950 font-semibold">Unmet Deficit Demand:</span>
                  <span className="font-mono font-extrabold text-slate-700">{comparison.aquaTwin.unmetDemand.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sky-950 font-semibold">Stress Exposure Hours:</span>
                  <span className="font-mono font-extrabold text-emerald-700">{comparison.aquaTwin.stressHours} hrs</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-sky-200 mt-3 flex justify-between text-xs">
              <span className="text-sky-950 font-bold">Reserve Protected:</span>
              <span className="font-mono font-extrabold text-emerald-700 text-sm">{comparison.aquaTwin.reserveProtected.toLocaleString()} L</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY ECO-CENTRIC MODULES (Sections 26, 27, 28) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
        {/* Rain Opportunity & Harvesting */}
        <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-xs text-xs">
          <div className="flex items-center space-x-2 text-blue-700 mb-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-100">
              <CloudRain className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wide">
              {t.rainOpportunity}
            </h4>
          </div>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Expected Rainfall:</span>
              <span className="font-bold text-slate-900 font-mono">{secondary.rainHarvest.expectedRainfallMm} mm</span>
            </div>
            <div className="flex justify-between">
              <span>Est. Catchment Harvest:</span>
              <span className="font-bold text-blue-800 font-mono">{secondary.rainHarvest.estimatedHarvestableWater.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between">
              <span>Cistern Storage Headroom:</span>
              <span className="font-bold text-slate-800 font-mono">
                {(secondary.rainHarvest.storageCapacity - secondary.rainHarvest.currentStorage).toLocaleString()} L
              </span>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] text-slate-500 italic">
              {secondary.rainHarvest.recommendation}
            </div>
          </div>
        </div>

        {/* Water Delivery Integrity & Loss Monitor */}
        <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-xs text-xs">
          <div className="flex items-center space-x-2 text-cyan-700 mb-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-100">
              <Droplet className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wide">
              {t.waterIntegrity}
            </h4>
          </div>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Source Canal Dispatch:</span>
              <span className="font-bold text-slate-900 font-mono">{secondary.integrity.sourceVolume.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between">
              <span>Delivered at Nozzle:</span>
              <span className="font-bold text-slate-900 font-mono">{secondary.integrity.delivered.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between">
              <span>Channel Conveyance Loss:</span>
              <span className="font-bold text-amber-700 font-mono">{secondary.integrity.potentialLoss} L ({(secondary.integrity.potentialLoss / secondary.integrity.sourceVolume * 100).toFixed(1)}%)</span>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-medium">Canal Status:</span>
              <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {secondary.integrity.status}
              </span>
            </div>
          </div>
        </div>

        {/* Groundwater Safety */}
        <div className="bg-white rounded-3xl p-5 border border-sky-100 shadow-xs text-xs">
          <div className="flex items-center space-x-2 text-amber-700 mb-2.5">
            <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-100">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wide">
              {t.groundwaterSafety}
            </h4>
          </div>
          <div className="space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Current Daily Extraction:</span>
              <span className="font-bold text-slate-900 font-mono">{secondary.groundwater.currentExtractionL.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between">
              <span>Safe Recharge Threshold:</span>
              <span className="font-bold text-slate-900 font-mono">{secondary.groundwater.safeThresholdL.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Aquifer Risk State:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] border ${
                secondary.groundwater.riskState === 'SAFE' 
                  ? 'text-emerald-800 bg-emerald-50 border-emerald-200' 
                  : 'text-amber-800 bg-amber-50 border-amber-200'
              }`}>
                {secondary.groundwater.riskState}
              </span>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] text-slate-500 italic">
              {secondary.groundwater.recommendation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
