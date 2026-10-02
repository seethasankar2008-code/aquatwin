export type CropType = 'Rice' | 'Tomato' | 'Groundnut' | 'Maize' | 'Cotton' | 'Sugarcane';

export type GrowthStage = 
  | 'Vegetative' 
  | 'Flowering' 
  | 'Pod Development' 
  | 'Silking / Tasseling' 
  | 'Boll Formation' 
  | 'Tillering';

export type SoilType = 'Clay Loam' | 'Sandy Loam' | 'Red Soil' | 'Alluvial';

export type StressLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface FutureStressTrajectory {
  now: StressLevel;
  plus6h: StressLevel;
  plus12h: StressLevel;
  plus24h: StressLevel;
}

export type CropAppearance = 'Healthy' | 'Moderate Stress' | 'Possible Stress' | 'Uncertain';
export type SurfaceCondition = 'Dry-looking' | 'Moist-looking' | 'Standing Water' | 'Uncertain';
export type VisibleCropStress = 'Low' | 'Moderate' | 'High' | 'Uncertain';
export type VisualConfidence = 'Low' | 'Medium' | 'High';

export interface FieldVisualAnalysis {
  photoUrl?: string;
  timestamp: string;
  cropAppearance: CropAppearance;
  surfaceCondition: SurfaceCondition;
  visibleStress: VisibleCropStress;
  confidence: VisualConfidence;
  observation: string;
  disclaimer: string;
}

export interface FieldState {
  id: string;
  name: string;
  crop: CropType;
  area: number; // in hectares (ha)
  soilType: SoilType;
  soilMoisture: number; // percentage (0-100%)
  targetMoisture: number; // optimal percentage (0-100%)
  growthStage: GrowthStage;
  stageSensitivityKy: number; // Yield response factor Ky (higher = more sensitive to stress)
  criticality: PriorityLevel;
  currentStress: StressLevel;
  futureStress: FutureStressTrajectory;
  waterDemand: number; // Litres needed to satisfy deficit and ET
  marginalBenefit: number; // 0-100 score indicating return from next litre
  priorityScore: number; // 0-100 composite priority score
  priorityLevel: PriorityLevel;
  allocation: number; // Litres allocated currently
  previousAllocation: number; // Litres allocated in prior step
  confidence: number; // 0-100% decision confidence
  reasons: string[]; // Rationale bullet points
  visualAnalysis?: FieldVisualAnalysis; // Optional field photo visual observation
}

export interface WeatherState {
  temperature: number; // Celsius (°C)
  humidity: number; // %
  rainfallProbability: number; // 0-100%
  forecastConfidence: number; // 0-100%
  uncertaintyLevel: 'LOW' | 'MODERATE' | 'HIGH';
  expectedRainfallMm: number; // mm expected if rain happens
  recentRainfallMm: number; // mm in last 24h
  et0: number; // Reference evapotranspiration (mm/day)
}

export interface WaterBudget {
  availableWater: number; // Total available water in Litres (e.g. 10,000 L)
  allocatedWater: number; // Total allocated across fields (e.g. 6,700 L)
  reserveWater: number; // Dynamic resilience reserve (e.g. 2,000 L)
  uncommittedWater: number; // Uncommitted buffer (e.g. 1,300 L)
  previousAvailable: number;
}

export type ScenarioPreset = 
  | 'BASELINE' 
  | 'DROUGHT' 
  | 'HEATWAVE' 
  | 'RAIN_SURGE' 
  | 'RAIN_FAILURE' 
  | 'WATER_SHORTAGE' 
  | 'CUSTOM';

export interface WhatChangedDelta {
  previousTemp: number;
  currentTemp: number;
  previousRainProb: number;
  currentRainProb: number;
  previousStressOverview: string;
  currentStressOverview: string;
  previousTopPriorityField: string;
  currentTopPriorityField: string;
  summaryReason: string;
}

export interface FarmProfile {
  farmName: string;
  location: string;
  totalArea: number;
  areaUnit: 'Acres' | 'Hectares';
  waterSource: 'Borewell' | 'Canal' | 'Farm Pond' | 'Reservoir' | 'Rainwater' | 'Other';
  availableWater: number;
  waterUnit: 'Litres' | 'Kilolitres';
  irrigationMethod?: 'Drip' | 'Sprinkler' | 'Flood' | 'Basin' | 'Other';
}

export interface FarmState {
  weather: WeatherState;
  waterBudget: WaterBudget;
  fields: FieldState[];
  activeScenario: ScenarioPreset;
  simulationMode: boolean; // Always true for hackathon integrity
  lastAdaptedTime: string;
  whatChanged: WhatChangedDelta;
  farmProfile?: FarmProfile; // Optional user configured farm profile
}

export interface ComparisonStrategyMetrics {
  waterAllocated: number;
  usefulWaterDelivered: number;
  unmetDemand: number;
  stressHours: number;
  reserveProtected: number;
  efficiencyScore: number; // 0-100%
}

export interface BaselineComparison {
  fixedSchedule: ComparisonStrategyMetrics;
  equalAllocation: ComparisonStrategyMetrics;
  aquaTwin: ComparisonStrategyMetrics;
}

export type Language = 'en' | 'ta';

export interface InsightEvent {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  type: 'info' | 'warning' | 'alert' | 'success';
}

export interface WaterIntegrityTelemetry {
  sourceVolume: number; // e.g. 5,000 L
  expectedDelivery: number; // e.g. 4,800 L
  delivered: number; // e.g. 4,420 L
  potentialLoss: number; // e.g. 380 L
  status: 'NORMAL' | 'CHECK DISTRIBUTION' | 'CRITICAL LEAKAGE';
}

export interface RainHarvestTelemetry {
  expectedRainfallMm: number; // e.g. 18 mm
  estimatedHarvestableWater: number; // e.g. 1,240 L
  storageCapacity: number; // e.g. 1,800 L
  currentStorage: number; // e.g. 600 L
  recommendation: string;
}

export interface GroundwaterSafetyTelemetry {
  currentExtractionL: number;
  safeThresholdL: number;
  riskState: 'SAFE' | 'WARNING' | 'CRITICAL';
  recommendation: string;
}
