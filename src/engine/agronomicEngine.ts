import { CropType, GrowthStage, StressLevel, FutureStressTrajectory } from '../types/farm';

export interface AgronomicProfile {
  crop: CropType;
  growthStage: GrowthStage;
  kc: number; // Crop coefficient (FAO-56)
  ky: number; // Yield response sensitivity factor (FAO-33)
  rootDepthM: number;
  wiltingPoint: number; // % moisture
  fieldCapacity: number; // % moisture
  optimalMoisture: number; // % moisture
}

export const CROP_AGRONOMIC_PROFILES: Record<CropType, AgronomicProfile> = {
  'Tomato': {
    crop: 'Tomato',
    growthStage: 'Flowering',
    kc: 1.15,
    ky: 1.25, // Extremely sensitive to water deficit during flowering (blossom drop)
    rootDepthM: 0.5,
    wiltingPoint: 15,
    fieldCapacity: 68,
    optimalMoisture: 60,
  },
  'Rice': {
    crop: 'Rice',
    growthStage: 'Tillering',
    kc: 1.10,
    ky: 0.90, // Submerged / high moisture preference, moderate yield elasticity
    rootDepthM: 0.35,
    wiltingPoint: 22,
    fieldCapacity: 85,
    optimalMoisture: 75,
  },
  'Groundnut': {
    crop: 'Groundnut',
    growthStage: 'Pod Development',
    kc: 0.95,
    ky: 0.85, // Sensitive during pegging/pod filling, drought tolerant in vegetative
    rootDepthM: 0.6,
    wiltingPoint: 12,
    fieldCapacity: 55,
    optimalMoisture: 50,
  },
  'Maize': {
    crop: 'Maize',
    growthStage: 'Silking / Tasseling',
    kc: 1.20,
    ky: 1.20, // High sensitivity during flowering/silking
    rootDepthM: 0.7,
    wiltingPoint: 14,
    fieldCapacity: 62,
    optimalMoisture: 58,
  },
  'Cotton': {
    crop: 'Cotton',
    growthStage: 'Boll Formation',
    kc: 0.90,
    ky: 0.75, // Deep taproot, resilient
    rootDepthM: 0.9,
    wiltingPoint: 12,
    fieldCapacity: 50,
    optimalMoisture: 45,
  },
  'Sugarcane': {
    crop: 'Sugarcane',
    growthStage: 'Vegetative',
    kc: 0.85,
    ky: 0.65, // Robust vegetative stage can withstand temporary deficit
    rootDepthM: 0.8,
    wiltingPoint: 16,
    fieldCapacity: 70,
    optimalMoisture: 62,
  },
};

/**
 * Calculates Reference Evapotranspiration (ET0) in mm/day
 * Deterministic formula based on temperature and relative humidity
 */
export function calculateET0(temperature: number, humidity: number): number {
  const baseET = 4.2;
  const tempFactor = (temperature - 25) * 0.18;
  const humidityFactor = (50 - humidity) * 0.04;
  const et0 = baseET + tempFactor + humidityFactor;
  return Math.max(2.2, Math.min(9.8, parseFloat(et0.toFixed(2))));
}

/**
 * Calculates current stress level from soil moisture relative to crop thresholds
 */
export function determineStressLevel(currentMoisture: number, wiltingPoint: number, optimalMoisture: number): StressLevel {
  const safetyMargin = optimalMoisture - wiltingPoint;
  const availableFraction = (currentMoisture - wiltingPoint) / Math.max(1, safetyMargin);

  if (availableFraction <= 0.15 || currentMoisture <= wiltingPoint) {
    return 'CRITICAL';
  } else if (availableFraction <= 0.35) {
    return 'HIGH';
  } else if (availableFraction <= 0.65) {
    return 'MODERATE';
  }
  return 'LOW';
}

/**
 * Estimates future stress trajectory (+6h, +12h, +24h)
 * Depletion rate accelerated by temperature and ET0, decelerated if rain is confident
 */
export function calculateFutureStressTrajectory(
  currentMoisture: number,
  profile: AgronomicProfile,
  temperature: number,
  et0: number,
  effectiveRainMm: number
): FutureStressTrajectory {
  const hourlyDepletion = (et0 * profile.kc / 24) * (temperature > 34 ? 1.25 : 1.0) * 1.6; // % moisture drop per hour

  const nowStress = determineStressLevel(currentMoisture, profile.wiltingPoint, profile.optimalMoisture);

  // +6 hours
  const moisture6h = Math.max(8, currentMoisture - hourlyDepletion * 6 + effectiveRainMm * 0.3);
  const plus6h = determineStressLevel(moisture6h, profile.wiltingPoint, profile.optimalMoisture);

  // +12 hours
  const moisture12h = Math.max(6, currentMoisture - hourlyDepletion * 12 + effectiveRainMm * 0.6);
  const plus12h = determineStressLevel(moisture12h, profile.wiltingPoint, profile.optimalMoisture);

  // +24 hours
  const moisture24h = Math.max(5, currentMoisture - hourlyDepletion * 24 + effectiveRainMm * 1.0);
  const plus24h = determineStressLevel(moisture24h, profile.wiltingPoint, profile.optimalMoisture);

  return {
    now: nowStress,
    plus6h,
    plus12h,
    plus24h,
  };
}

/**
 * Calculates realistic field water demand (in Litres) based on root zone deficit and daily ETc
 */
export function calculateWaterDemand(
  areaHa: number,
  currentMoisture: number,
  targetMoisture: number,
  profile: AgronomicProfile,
  et0: number
): number {
  const deficitPct = Math.max(0, targetMoisture - currentMoisture);
  // Volume to replenish deficit: 1 ha = 10,000 m^2. Root depth in meters.
  // 1% moisture deficit across 10,000 m^2 * 0.5m depth * 0.01 = 50 m^3 = 50,000 L.
  // For prototype demonstration scaling, we scale to farm zone units (approx 2,000 - 4,000 L per event)
  const deficitLitres = areaHa * deficitPct * 75; 
  const etLitres = areaHa * (et0 * profile.kc) * 140;

  const rawDemand = Math.round(deficitLitres + etLitres);
  return Math.max(400, Math.round(rawDemand / 50) * 50); // rounded to neat 50s
}
