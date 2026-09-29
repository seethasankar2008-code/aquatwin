import { WeatherState } from '../types/farm';

export interface UncertaintyAssessment {
  uncertaintyLevel: 'LOW' | 'MODERATE' | 'HIGH';
  effectiveRainCreditMm: number;
  resilienceReserveL: number;
  reserveRationale: string;
  reserveRatio: number;
}

/**
 * Assesses uncertainty from meteorological signals and dynamically sizes the Resilience Reserve
 */
export function evaluateUncertainty(
  weather: WeatherState,
  availableWater: number
): UncertaintyAssessment {
  const { rainfallProbability, forecastConfidence, temperature, expectedRainfallMm } = weather;

  // 1. Determine Categorical Uncertainty
  let uncertaintyLevel: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
  if (forecastConfidence < 50 || (rainfallProbability > 40 && forecastConfidence < 65)) {
    uncertaintyLevel = 'HIGH';
  } else if (forecastConfidence < 75 || (rainfallProbability > 30 && forecastConfidence < 80)) {
    uncertaintyLevel = 'MODERATE';
  } else {
    uncertaintyLevel = 'LOW';
  }

  // 2. Calculate Effective Rainfall Credit (Uncertainty-Discounted)
  // We use quadratic discounting on confidence:
  // E.g., 80% rain prob with 45% confidence -> 80% * (0.45)^2 = 16.2% of expected mm.
  const confidenceWeight = Math.pow(forecastConfidence / 100, 2);
  const probWeight = rainfallProbability / 100;
  const effectiveFraction = probWeight * confidenceWeight;
  const effectiveRainCreditMm = parseFloat((expectedRainfallMm * effectiveFraction).toFixed(1));

  // 3. Dynamic Resilience Reserve Calculation
  // Base reserve is 15% of available water
  let targetRatio = 0.15;

  if (uncertaintyLevel === 'HIGH') {
    targetRatio += 0.08; // +8% for high forecast variance
  } else if (uncertaintyLevel === 'MODERATE') {
    targetRatio += 0.04;
  }

  // Heatwave buffer: if temperature is blistering (>36°C), farm needs contingency water
  if (temperature >= 38) {
    targetRatio += 0.05;
  } else if (temperature >= 34) {
    targetRatio += 0.02;
  }

  // High rain probability with HIGH confidence allows freeing up reserve slightly
  if (rainfallProbability >= 75 && forecastConfidence >= 80) {
    targetRatio -= 0.04;
  }

  // Bound target ratio between 12% and 28%
  targetRatio = Math.max(0.12, Math.min(0.28, targetRatio));

  const rawReserve = Math.round(availableWater * targetRatio);
  const resilienceReserveL = Math.max(500, Math.round(rawReserve / 50) * 50);

  let reserveRationale = 'Standard operational buffer (15%) for baseline farm stability.';
  if (uncertaintyLevel === 'HIGH' && temperature >= 38) {
    reserveRationale = 'Defensive reserve expanded to 25%+ due to high forecast uncertainty & extreme heatwave evapotranspiration risk.';
  } else if (uncertaintyLevel === 'HIGH') {
    reserveRationale = 'Elevated reserve buffer to prevent crop shock in case forecasted rainfall fails.';
  } else if (temperature >= 38) {
    reserveRationale = 'Thermal contingency reserve held to buffer extreme transpiration drawdown.';
  } else if (rainfallProbability >= 75 && forecastConfidence >= 80) {
    reserveRationale = 'Reduced reserve constraint as high-confidence rainfall will replenish reservoir.';
  }

  return {
    uncertaintyLevel,
    effectiveRainCreditMm,
    resilienceReserveL,
    reserveRationale,
    reserveRatio: parseFloat((resilienceReserveL / availableWater).toFixed(2)),
  };
}
