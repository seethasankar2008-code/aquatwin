import { 
  FieldState, 
  WeatherState, 
  PriorityLevel, 
  StressLevel 
} from '../types/farm';
import { AgronomicProfile } from './agronomicEngine';

export interface MarginalBenefitResult {
  marginalBenefitScore: number; // 0-100
  priorityScore: number; // 0-100
  priorityLevel: PriorityLevel;
  reasons: string[];
}

const STRESS_SEVERITY_WEIGHTS: Record<StressLevel, number> = {
  'CRITICAL': 1.0,
  'HIGH': 0.75,
  'MODERATE': 0.45,
  'LOW': 0.15,
};

/**
 * Computes the Marginal Water Benefit Score and Composite Priority Score for a given field
 * Answers: "Which field receives the greatest benefit from the next litre of water?"
 */
export function calculateMarginalBenefitAndPriority(
  field: Pick<FieldState, 'crop' | 'growthStage' | 'soilMoisture' | 'targetMoisture' | 'currentStress' | 'futureStress'>,
  profile: AgronomicProfile,
  weather: WeatherState
): MarginalBenefitResult {
  const { soilMoisture, targetMoisture, currentStress, futureStress } = field;
  const { temperature, rainfallProbability, forecastConfidence } = weather;

  // 1. Growth Stage Sensitivity Multiplier (FAO Ky)
  // Range typically 0.65 (sugarcane vegetative) to 1.25 (tomato flowering)
  const sensitivityNorm = (profile.ky - 0.6) / (1.3 - 0.6); // 0 to 1

  // 2. Moisture Deficit Ratio
  const deficitRatio = Math.max(0, (targetMoisture - soilMoisture) / targetMoisture); // 0 to 1

  // 3. Future Stress Acceleration Factor (+12h and +24h stress horizon)
  const stressHorizonScore = (
    STRESS_SEVERITY_WEIGHTS[futureStress.plus6h] * 0.2 +
    STRESS_SEVERITY_WEIGHTS[futureStress.plus12h] * 0.5 +
    STRESS_SEVERITY_WEIGHTS[futureStress.plus24h] * 0.3
  );

  // 4. Environmental Heat Risk
  const heatRisk = Math.max(0, Math.min(1, (temperature - 26) / 16)); // 0 at 26°C, 1 at 42°C

  // 5. Low Rainfall Confidence Penalty (higher priority to irrigate if rain forecast is unreliable)
  const rainOffset = (rainfallProbability / 100) * (forecastConfidence / 100);
  const rainConfidenceGap = Math.max(0, 1 - rainOffset);

  // MARGINAL BENEFIT CALCULATION (0 - 100)
  // Emphasizes yield protection per litre: Sensitivity (40%) + Deficit (30%) + Future Stress (20%) + Heat (10%)
  const rawBenefit = (
    sensitivityNorm * 40 +
    deficitRatio * 30 +
    stressHorizonScore * 20 +
    heatRisk * 10
  );
  const marginalBenefitScore = Math.min(99, Math.max(15, Math.round(rawBenefit)));

  // COMPOSITE PRIORITY SCORE (0 - 100)
  // Priority incorporates Marginal Benefit (35%) + Current Stress (25%) + Future Stress (20%) + Rain Gap (10%) + Heat (10%)
  const currentStressScore = STRESS_SEVERITY_WEIGHTS[currentStress] * 100;
  const rawPriority = (
    marginalBenefitScore * 0.35 +
    currentStressScore * 0.25 +
    (stressHorizonScore * 100) * 0.20 +
    (rainConfidenceGap * 100) * 0.10 +
    (heatRisk * 100) * 0.10
  );

  const priorityScore = Math.min(99, Math.max(10, Math.round(rawPriority)));

  // Map to Level
  let priorityLevel: PriorityLevel = 'LOW';
  if (priorityScore >= 82) {
    priorityLevel = 'CRITICAL';
  } else if (priorityScore >= 68) {
    priorityLevel = 'HIGH';
  } else if (priorityScore >= 45) {
    priorityLevel = 'MEDIUM';
  }

  // Generate transparent decision explanation factors
  const reasons: string[] = [];

  if (profile.ky >= 1.15) {
    reasons.push(`${field.growthStage} stage: extreme yield sensitivity to moisture stress (Ky ${profile.ky})`);
  } else if (profile.ky <= 0.75) {
    reasons.push(`${field.growthStage} stage: high natural drought resilience (Ky ${profile.ky})`);
  }

  if (deficitRatio > 0.45) {
    reasons.push(`Severe root-zone moisture deficit (${soilMoisture}% vs target ${targetMoisture}%)`);
  } else if (deficitRatio < 0.2) {
    reasons.push(`Soil moisture near field capacity (${soilMoisture}%)`);
  }

  if (futureStress.plus12h === 'CRITICAL' || futureStress.plus12h === 'HIGH') {
    reasons.push(`Future stress predicted to escalate to ${futureStress.plus12h} within 12 hours`);
  }

  if (temperature >= 37) {
    reasons.push(`Severe heatwave (${temperature}°C) accelerating evapotranspiration`);
  }

  if (rainfallProbability > 60 && forecastConfidence < 55) {
    reasons.push(`Unreliable rainfall forecast (${rainfallProbability}% prob at only ${forecastConfidence}% confidence)`);
  } else if (rainfallProbability > 75 && forecastConfidence >= 80) {
    reasons.push(`High-confidence rainfall expected (${rainfallProbability}% at ${forecastConfidence}%) reduces irrigation urgency`);
  }

  return {
    marginalBenefitScore,
    priorityScore,
    priorityLevel,
    reasons,
  };
}
