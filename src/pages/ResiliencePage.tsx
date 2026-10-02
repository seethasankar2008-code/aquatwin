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
      <div className="pb-5 border-b border-sky-200/80">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-sky-100 text-water-700 border border-sky-300 shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-2xl font-black font-display text-sky-950 tracking-tight ${language === 'ta' ? 'font-tamil' : ''}`}>
              {t.resilienceTitle}
            </h2>
            <p className="text-sm text-slate-700 font-medium mt-1">
              {t.resilienceSub}
            </p>
          </div>
        </div>
      </div>

      {/* DYNAMIC WATER BANK & WATER JOURNEY */}
      <div className="bg-white/92 backdrop-blur-sm rounded-xl p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3.5 border-b border-sky-100">
          <div>
            <h3 className="text-sm font-black font-display uppercase tracking-wider text-sky-950">
              {t.waterBank} — Complete Hydraulic Balance
            </h3>
            <p className="text-xs text-slate-700 font-medium mt-0.5">
              Deterministic conservation: Available = Allocated + Resilience Reserve + Uncommitted
            </p>
          </div>
          <span className="font-mono text-xs font-bold px-2.5 py-1 bg-sky-100 text-sky-950 rounded-full border border-sky-300">
            Total Pool: {waterBudget.availableWater.toLocaleString()} L
          </span>
        </div>

        {/* Visual Stacked Progress Bar */}
        <div className="space-y-3 mb-6">
          <div className="h-6 w-full rounded-xl bg-sky-100/80 p-1 flex gap-1.5 overflow-hidden border border-sky-200">
            <div
              className="bg-water-600 rounded-lg h-full transition-all duration-500 relative group flex items-center justify-center text-[10px] font-bold text-white font-mono"
              style={{ width: `${allocatedPct}%` }}
              title={`Allocated: ${waterBudget.allocatedWater.toLocaleString()} L (${allocatedPct}%)`}
            >
              {allocatedPct > 12 && `${allocatedPct}%`}
            </div>
            <div
              className="bg-emerald-600 rounded-lg h-full transition-all duration-500 relative group flex items-center justify-center text-[10px] font-bold text-white font-mono"
              style={{ width: `${reservePct}%` }}
              title={`Reserve: ${waterBudget.reserveWater.toLocaleString()} L (${reservePct}%)`}
            >
              {reservePct > 10 && `${reservePct}%`}
            </div>
            {uncommittedPct > 0 && (
              <div
                className="bg-slate-300 rounded-lg h-full transition-all duration-500 relative group flex items-center justify-center text-[10px] font-bold text-slate-700 font-mono"
                style={{ width: `${uncommittedPct}%` }}
                title={`Uncommitted: ${waterBudget.uncommittedWater.toLocaleString()} L (${uncommittedPct}%)`}
              >
                {uncommittedPct > 8 && `${uncommittedPct}%`}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-700 font-semibold px-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-water-600 shrink-0" />
              <span>Allocated: <strong className="text-sky-950 font-mono font-black">{waterBudget.allocatedWater.toLocaleString()} L</strong> ({allocatedPct}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span>Resilience Reserve: <strong className="text-sky-950 font-mono font-black">{waterBudget.reserveWater.toLocaleString()} L</strong> ({reservePct}%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
              <span>Uncommitted Buffer: <strong className="text-sky-950 font-mono font-black">{waterBudget.uncommittedWater.toLocaleString()} L</strong> ({uncommittedPct}%)</span>
            </div>
          </div>
        </div>

        {/* Water Journey Flow */}
        <div className="bg-sky-50/70 rounded-lg p-4.5 border border-sky-200/80">
          <h4 className="text-xs font-black font-display text-sky-950 uppercase tracking-wider mb-3">
            Water Journey: Distribution Flow Architecture
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
            {farmState.fields.map((f) => (
              <div key={f.id} className="bg-white/95 p-3 rounded-lg border border-sky-200 text-center shadow-xs">
                <span className="text-[10px] text-slate-600 font-medium block truncate">{f.name.split(' - ')[0]}</span>
                <span className="font-bold text-slate-900 text-[11px] block truncate">{f.crop}</span>
                <span className="font-bold text-water-700 font-mono text-xs block mt-1">
                  {f.allocation.toLocaleString()} L
                </span>
              </div>
            ))}
            <div className="bg-emerald-100/90 p-3 rounded-lg border border-emerald-300 text-center shadow-xs">
              <span className="text-[10px] text-emerald-800 block font-bold">Defense</span>
              <span className="font-bold text-emerald-950 text-[11px] block">Reserve</span>
              <span className="font-bold text-emerald-800 font-mono text-xs block mt-1">
                {waterBudget.reserveWater.toLocaleString()} L
              </span>
            </div>
            <div className="bg-sky-100/90 p-3 rounded-lg border border-sky-300 text-center shadow-xs">
              <span className="text-[10px] text-sky-800 block font-bold">Surplus</span>
              <span className="font-bold text-sky-950 text-[11px] block">Uncommitted</span>
              <span className="font-bold text-sky-800 font-mono text-xs block mt-1">
                {waterBudget.uncommittedWater.toLocaleString()} L
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SIMULATED BASELINE COMPARISON */}
      <div className="bg-white/92 backdrop-blur-sm rounded-xl p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3.5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                SIMULATED COMPARISON
              </span>
              <h3 className={`text-base font-bold font-display text-slate-900 ${language === 'ta' ? 'font-tamil' : ''}`}>
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
          <div className="bg-sky-50/70 rounded-lg p-4.5 border border-sky-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="font-bold font-display text-xs text-slate-800 uppercase tracking-wide">
                  {t.fixedSchedule}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-sky-200">
                  58% Score
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Water Allocated:</span>
                  <span className="font-mono font-bold text-slate-900">{comparison.fixedSchedule.waterAllocated.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Useful Water Delivered:</span>
                  <span className="font-mono font-bold text-slate-800">{comparison.fixedSchedule.usefulWaterDelivered.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Unmet Deficit Demand:</span>
                  <span className="font-mono font-bold text-rose-600">{comparison.fixedSchedule.unmetDemand.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Stress Exposure Hours:</span>
                  <span className="font-mono font-bold text-rose-600">{comparison.fixedSchedule.stressHours} hrs</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-sky-200 mt-3 flex justify-between text-xs">
              <span className="text-slate-600 font-medium">Reserve Protected:</span>
              <span className="font-mono font-bold text-rose-600">0 L (Vulnerable)</span>
            </div>
          </div>

          {/* Equal Allocation */}
          <div className="bg-sky-50/70 rounded-lg p-4.5 border border-sky-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="font-bold font-display text-xs text-slate-800 uppercase tracking-wide">
                  {t.equalAllocation}
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-sky-200">
                  68% Score
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Water Allocated:</span>
                  <span className="font-mono font-bold text-slate-900">{comparison.equalAllocation.waterAllocated.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Useful Water Delivered:</span>
                  <span className="font-mono font-bold text-slate-800">{comparison.equalAllocation.usefulWaterDelivered.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Unmet Deficit Demand:</span>
                  <span className="font-mono font-bold text-amber-600">{comparison.equalAllocation.unmetDemand.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 font-medium">Stress Exposure Hours:</span>
                  <span className="font-mono font-bold text-amber-600">{comparison.equalAllocation.stressHours} hrs</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-sky-200 mt-3 flex justify-between text-xs">
              <span className="text-slate-600 font-medium">Reserve Protected:</span>
              <span className="font-mono font-bold text-slate-800">500 L</span>
            </div>
          </div>

          {/* AquaTwin System */}
          <div className="bg-white/95 rounded-lg p-4.5 border-2 border-water-500 shadow-sm relative overflow-hidden flex flex-col justify-between ring-2 ring-water-500/20">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <h4 className="font-black font-display text-xs text-sky-950 uppercase tracking-wide flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
                  {t.aquaTwinSystem}
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-water-600 text-white font-mono shadow-xs">
                  94% Score
                </span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-700 font-semibold">Water Allocated:</span>
                  <span className="font-mono font-black text-sky-950">{comparison.aquaTwin.waterAllocated.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 font-semibold">Useful Water Delivered:</span>
                  <span className="font-mono font-black text-water-700">{comparison.aquaTwin.usefulWaterDelivered.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 font-semibold">Unmet Deficit Demand:</span>
                  <span className="font-mono font-bold text-slate-800">{comparison.aquaTwin.unmetDemand.toLocaleString()} L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700 font-semibold">Stress Exposure Hours:</span>
                  <span className="font-mono font-bold text-emerald-700">{comparison.aquaTwin.stressHours} hrs</span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-sky-100 mt-3 flex justify-between text-xs">
              <span className="text-slate-900 font-black">Reserve Protected:</span>
              <span className="font-mono font-black text-emerald-700 text-sm">{comparison.aquaTwin.reserveProtected.toLocaleString()} L</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECONDARY ECO-CENTRIC MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
        {/* Rain Opportunity & Harvesting */}
        <div className="bg-white/92 backdrop-blur-sm rounded-xl p-5 border border-sky-200/90 shadow-sm shadow-sky-950/5 text-xs">
          <div className="flex items-center space-x-2 text-water-600 mb-2.5">
            <div className="p-1.5 rounded-lg bg-sky-100 border border-sky-300">
              <CloudRain className="w-4 h-4 text-water-600" />
            </div>
            <h4 className="font-black font-display text-sky-950 uppercase text-[11px] tracking-wide">
              {t.rainOpportunity}
            </h4>
          </div>
          <div className="space-y-2 text-slate-700 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-600">Expected Rainfall:</span>
              <span className="font-bold text-sky-950 font-mono">{secondary.rainHarvest.expectedRainfallMm} mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Est. Catchment Harvest:</span>
              <span className="font-bold text-water-700 font-mono">{secondary.rainHarvest.estimatedHarvestableWater.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Cistern Storage Headroom:</span>
              <span className="font-bold text-slate-900 font-mono">
                {(secondary.rainHarvest.storageCapacity - secondary.rainHarvest.currentStorage).toLocaleString()} L
              </span>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-sky-100 text-[11px] text-slate-600 italic font-normal">
              {secondary.rainHarvest.recommendation}
            </div>
          </div>
        </div>

        {/* Water Delivery Integrity & Loss Monitor */}
        <div className="bg-white/92 backdrop-blur-sm rounded-xl p-5 border border-sky-200/90 shadow-sm shadow-sky-950/5 text-xs">
          <div className="flex items-center space-x-2 text-water-600 mb-2.5">
            <div className="p-1.5 rounded-lg bg-sky-100 border border-sky-300">
              <Droplet className="w-4 h-4 text-water-600" />
            </div>
            <h4 className="font-black font-display text-sky-950 uppercase text-[11px] tracking-wide">
              {t.waterIntegrity}
            </h4>
          </div>
          <div className="space-y-2 text-slate-700 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-600">Source Canal Dispatch:</span>
              <span className="font-bold text-sky-950 font-mono">{secondary.integrity.sourceVolume.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Delivered at Nozzle:</span>
              <span className="font-bold text-sky-950 font-mono">{secondary.integrity.delivered.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Channel Conveyance Loss:</span>
              <span className="font-bold text-amber-700 font-mono">{secondary.integrity.potentialLoss} L ({(secondary.integrity.potentialLoss / secondary.integrity.sourceVolume * 100).toFixed(1)}%)</span>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-sky-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-700 font-semibold">Canal Status:</span>
              <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {secondary.integrity.status}
              </span>
            </div>
          </div>
        </div>

        {/* Groundwater Safety */}
        <div className="bg-white/92 backdrop-blur-sm rounded-xl p-5 border border-sky-200/90 shadow-sm shadow-sky-950/5 text-xs">
          <div className="flex items-center space-x-2 text-amber-600 mb-2.5">
            <div className="p-1.5 rounded-lg bg-amber-100 border border-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <h4 className="font-black font-display text-sky-950 uppercase text-[11px] tracking-wide">
              {t.groundwaterSafety}
            </h4>
          </div>
          <div className="space-y-2 text-slate-700 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-600">Current Daily Extraction:</span>
              <span className="font-bold text-sky-950 font-mono">{secondary.groundwater.currentExtractionL.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Safe Recharge Threshold:</span>
              <span className="font-bold text-sky-950 font-mono">{secondary.groundwater.safeThresholdL.toLocaleString()} L</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Aquifer Risk State:</span>
              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] border ${
                secondary.groundwater.riskState === 'SAFE' 
                  ? 'text-emerald-800 bg-emerald-100 border-emerald-300' 
                  : 'text-amber-800 bg-amber-100 border-amber-300'
              }`}>
                {secondary.groundwater.riskState}
              </span>
            </div>
            <div className="pt-2.5 mt-2.5 border-t border-sky-100 text-[11px] text-slate-600 italic font-normal">
              {secondary.groundwater.recommendation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
