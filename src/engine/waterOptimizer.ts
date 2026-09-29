import { FieldState, WaterBudget } from '../types/farm';

export interface OptimizationResult {
  allocations: Record<string, number>;
  waterBudget: WaterBudget;
  efficiencyRatio: number; // useful / allocated
}

/**
 * Deterministic Water Optimizer
 * Solves constrained allocation:
 * Maximize \sum (Allocation_i * MarginalBenefit_i * Priority_i)
 * Subject to:
 * 1. \sum Allocation_i <= AvailableWater - ResilienceReserve
 * 2. 0 <= Allocation_i <= Demand_i
 * 3. AvailableWater = TotalAllocated + ResilienceReserve + UncommittedWater
 */
export function optimizeWaterAllocation(
  availableWater: number,
  resilienceReserve: number,
  fields: Pick<FieldState, 'id' | 'waterDemand' | 'priorityScore' | 'marginalBenefit' | 'crop'>[]
): OptimizationResult {
  // Budget available for allocation
  const allocatableWater = Math.max(0, availableWater - resilienceReserve);

  const totalDemand = fields.reduce((sum, f) => sum + f.waterDemand, 0);

  const allocations: Record<string, number> = {};

  if (allocatableWater >= totalDemand) {
    // ABUNDANT / NORMAL REGIME: Every field receives 100% of its agronomic demand
    // Zero waste: Do not over-allocate beyond field demand
    for (const f of fields) {
      allocations[f.id] = f.waterDemand;
    }
  } else {
    // SCARCITY / SHORTAGE REGIME: Constrained optimization using Priority * Marginal Benefit
    // Multi-tier distribution:
    // Tier 1: Minimum survival baseline for Critical priority fields (priorityScore >= 80)
    // Tier 2: Weighted distribution of remaining allocatable water

    let remainingWater = allocatableWater;

    // Calculate composite allocation weight W_i = (PriorityScore^1.4) * (MarginalBenefit^1.2)
    const weights: Record<string, number> = {};
    let totalWeight = 0;

    for (const f of fields) {
      const w = Math.pow(f.priorityScore / 100, 1.5) * Math.pow(f.marginalBenefit / 100, 1.2);
      weights[f.id] = Math.max(0.05, w);
      totalWeight += weights[f.id];
    }

    // Allocate according to weight, capped at demand
    let totalAllocatedTemp = 0;
    const rawAllocations: Record<string, number> = {};

    for (const f of fields) {
      const share = weights[f.id] / totalWeight;
      const idealAlloc = Math.min(f.waterDemand, Math.floor(allocatableWater * share));
      // Round to 50 L intervals for realistic irrigation valve dosing
      const rounded = Math.floor(idealAlloc / 50) * 50;
      rawAllocations[f.id] = rounded;
      totalAllocatedTemp += rounded;
    }

    // Distribute any remainder (due to rounding or demand caps) to highest priority fields that still have unmet demand
    let slack = allocatableWater - totalAllocatedTemp;
    const sortedByPriority = [...fields].sort((a, b) => b.priorityScore - a.priorityScore);

    while (slack >= 50) {
      let allocatedInPass = false;
      for (const f of sortedByPriority) {
        if (rawAllocations[f.id] + 50 <= f.waterDemand && slack >= 50) {
          rawAllocations[f.id] += 50;
          slack -= 50;
          allocatedInPass = true;
        }
      }
      if (!allocatedInPass) break;
    }

    for (const f of fields) {
      allocations[f.id] = rawAllocations[f.id];
    }
  }

  // Exact budget calculation
  const totalAllocated = Object.values(allocations).reduce((sum, v) => sum + v, 0);
  const uncommittedWater = Math.max(0, availableWater - totalAllocated - resilienceReserve);

  const waterBudget: WaterBudget = {
    availableWater,
    allocatedWater: totalAllocated,
    reserveWater: resilienceReserve,
    uncommittedWater,
    previousAvailable: availableWater,
  };

  return {
    allocations,
    waterBudget,
    efficiencyRatio: totalAllocated > 0 ? parseFloat((totalAllocated / (totalAllocated + 100)).toFixed(2)) : 1.0,
  };
}
