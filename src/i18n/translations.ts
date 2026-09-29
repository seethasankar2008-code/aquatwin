export interface TranslationDict {
  tagline: string;
  subTagline: string;
  farmLive: string;
  simulationMode: string;
  simulationNotice: string;
  // Nav
  navCommandCenter: string;
  navFarmTwin: string;
  navScenarioLab: string;
  navDecisions: string;
  navResilience: string;
  // Metrics
  waterAvailable: string;
  predictedDemand: string;
  deficit: string;
  farmRisk: string;
  forecastConfidence: string;
  resilienceReserve: string;
  uncommitted: string;
  allocated: string;
  // Farm Brain
  farmBrainTitle: string;
  aiDecision: string;
  prioritizeField: string;
  recommendedAllocation: string;
  whyThisDecision: string;
  decisionConfidence: string;
  hearDecision: string;
  askAquaTwin: string;
  listening: string;
  speaking: string;
  stopAudio: string;
  // Digital Twin
  digitalFarmTwin: string;
  digitalFarmTwinSub: string;
  farmFuture: string;
  stressTrajectory: string;
  now: string;
  plus6h: string;
  plus12h: string;
  plus24h: string;
  // Statuses
  healthy: string;
  atRisk: string;
  critical: string;
  moderate: string;
  high: string;
  low: string;
  // Scenario Lab
  scenarioLabTitle: string;
  scenarioLabSub: string;
  adaptFarmBtn: string;
  presets: string;
  presetWaterShortage: string;
  presetRainSurge: string;
  presetRainFailure: string;
  presetHeatwave: string;
  presetDrought: string;
  presetBaseline: string;
  availableWaterSlider: string;
  rainProbabilitySlider: string;
  forecastConfidenceSlider: string;
  temperatureSlider: string;
  beforeVsAfter: string;
  before: string;
  after: string;
  whyAllocationChanged: string;
  whatChanged: string;
  // Decisions Page
  decisionsTitle: string;
  decisionsSub: string;
  fieldId: string;
  crop: string;
  growthStage: string;
  soilMoisture: string;
  marginalBenefit: string;
  priorityScore: string;
  allocationL: string;
  action: string;
  adaptationTimeline: string;
  // Resilience Page
  resilienceTitle: string;
  resilienceSub: string;
  waterBank: string;
  dynamicReserveTitle: string;
  rainOpportunity: string;
  waterIntegrity: string;
  groundwaterSafety: string;
  simulatedBaselineComparison: string;
  fixedSchedule: string;
  equalAllocation: string;
  aquaTwinSystem: string;
  waterEfficiency: string;
  stressHoursSaved: string;
  // Crops
  cropTomato: string;
  cropRice: string;
  cropGroundnut: string;
  cropMaize: string;
  cropCotton: string;
  cropSugarcane: string;
  // Growth Stages
  stageVegetative: string;
  stageFlowering: string;
  stagePodDev: string;
  stageSilking: string;
  stageBoll: string;
  stageTillering: string;
}

export const translations: Record<'en' | 'ta', TranslationDict> = {
  en: {
    tagline: 'EVERY DROP IS A DECISION.',
    subTagline: 'AI-Assisted Adaptive Farm Water Operating System Under Uncertainty',
    farmLive: 'FARM LIVE',
    simulationMode: 'PROTOTYPE SIMULATION',
    simulationNotice: 'Simulated agronomic digital twin under deterministic optimization models',
    // Nav
    navCommandCenter: 'Command Center',
    navFarmTwin: 'Farm Twin',
    navScenarioLab: 'Scenario Lab',
    navDecisions: 'Decisions',
    navResilience: 'Resilience',
    // Metrics
    waterAvailable: 'Water Available',
    predictedDemand: 'Predicted Demand',
    deficit: 'Moisture Deficit',
    farmRisk: 'Farm Risk',
    forecastConfidence: 'Forecast Confidence',
    resilienceReserve: 'Resilience Reserve',
    uncommitted: 'Uncommitted Water',
    allocated: 'Allocated Water',
    // Farm Brain
    farmBrainTitle: 'FARM BRAIN',
    aiDecision: 'AI DECISION',
    prioritizeField: 'PRIORITIZE',
    recommendedAllocation: 'Recommended Allocation',
    whyThisDecision: 'Why this decision?',
    decisionConfidence: 'Decision Confidence',
    hearDecision: 'Hear Decision',
    askAquaTwin: 'Ask AquaTwin',
    listening: 'Listening...',
    speaking: 'Speaking...',
    stopAudio: 'Stop Audio',
    // Digital Twin
    digitalFarmTwin: 'Digital Farm Twin',
    digitalFarmTwinSub: 'Real-time root-zone telemetry across 6 active agricultural plots',
    farmFuture: 'Farm Future Horizon',
    stressTrajectory: 'Stress Trajectory Forecast',
    now: 'Now',
    plus6h: '+6 Hours',
    plus12h: '+12 Hours',
    plus24h: '+24 Hours',
    // Statuses
    healthy: 'Healthy',
    atRisk: 'At Risk',
    critical: 'Critical',
    moderate: 'Moderate',
    high: 'High',
    low: 'Low',
    // Scenario Lab
    scenarioLabTitle: 'ADAPTIVE SCENARIO LAB',
    scenarioLabSub: 'Change farm conditions. Watch AquaTwin adapt in real-time.',
    adaptFarmBtn: 'ADAPT FARM',
    presets: 'Preset Scenarios',
    presetWaterShortage: 'Water Shortage (10kL → 5kL)',
    presetRainSurge: 'Rain Surge',
    presetRainFailure: 'Rain Failure',
    presetHeatwave: 'Heatwave (42°C)',
    presetDrought: 'Drought Mode',
    presetBaseline: 'Reset Baseline',
    availableWaterSlider: 'Available Water Supply (L)',
    rainProbabilitySlider: 'Rain Probability (%)',
    forecastConfidenceSlider: 'Forecast Confidence (%)',
    temperatureSlider: 'Atmospheric Temperature (°C)',
    beforeVsAfter: 'Before vs After Adaptation',
    before: 'BEFORE',
    after: 'AFTER',
    whyAllocationChanged: 'Why Allocation Changed',
    whatChanged: 'WHAT CHANGED?',
    // Decisions Page
    decisionsTitle: 'Transparent Decision Intelligence',
    decisionsSub: 'Multi-factor priority ranking and marginal water benefit breakdown',
    fieldId: 'Plot / Field',
    crop: 'Crop',
    growthStage: 'Growth Stage',
    soilMoisture: 'Root Moisture',
    marginalBenefit: 'Marginal Benefit',
    priorityScore: 'Priority Score',
    allocationL: 'Allocation',
    action: 'Prescribed Action',
    adaptationTimeline: 'Adaptation Timeline',
    // Resilience Page
    resilienceTitle: 'Eco-Centric Resilience & Integrity',
    resilienceSub: 'Dynamic reserve management, water accounting, and groundwater safety',
    waterBank: 'Dynamic Water Bank',
    dynamicReserveTitle: 'Uncertainty-Aware Resilience Reserve',
    rainOpportunity: 'Rain Harvesting Opportunity',
    waterIntegrity: 'Delivery Integrity & Loss Monitor',
    groundwaterSafety: 'Groundwater Safety Threshold',
    simulatedBaselineComparison: 'Simulated Baseline Comparison',
    fixedSchedule: 'Fixed Timer Schedule',
    equalAllocation: 'Naive Equal Allocation',
    aquaTwinSystem: 'AquaTwin Adaptive OS',
    waterEfficiency: 'Water-Use Efficiency',
    stressHoursSaved: 'Stress Hours Exposure',
    // Crops
    cropTomato: 'Tomato',
    cropRice: 'Rice (Paddy)',
    cropGroundnut: 'Groundnut',
    cropMaize: 'Maize',
    cropCotton: 'Cotton',
    cropSugarcane: 'Sugarcane',
    // Growth Stages
    stageVegetative: 'Vegetative',
    stageFlowering: 'Flowering',
    stagePodDev: 'Pod Development',
    stageSilking: 'Silking / Tasseling',
    stageBoll: 'Boll Formation',
    stageTillering: 'Tillering',
  },
  ta: {
    tagline: 'ஒவ்வொரு துளியும் ஒரு முடிவு.',
    subTagline: 'நிலையற்ற சூழலில் தகவமைக்கும் விவசாய நீர் மேலாண்மை அமைப்பு',
    farmLive: 'நேரலை பண்ணை',
    simulationMode: 'மாதிரி உருவகப்படுத்துதல்',
    simulationNotice: 'முடிவெடுக்கும் கணித மாதிரி அடிப்படையிலான டிஜிட்டல் பண்ணை',
    // Nav
    navCommandCenter: 'கட்டுப்பாட்டு மையம்',
    navFarmTwin: 'பண்ணை இரட்டை',
    navScenarioLab: 'சூழ்நிலை ஆய்வகம்',
    navDecisions: 'முடிவுகள்',
    navResilience: 'நெகிழ்ச்சி & நீர் சேமிப்பு',
    // Metrics
    waterAvailable: 'கிடைக்கும் நீர்',
    predictedDemand: 'கணிக்கப்பட்ட தேவை',
    deficit: 'மண் ஈரப்பதம் பற்றாக்குறை',
    farmRisk: 'பண்ணை அபாயம்',
    forecastConfidence: 'வானிலை நம்பிக்கை',
    resilienceReserve: 'நெகிழ்ச்சி இருப்பு',
    uncommitted: 'ஒதுக்கப்படாத இருப்பு',
    allocated: 'ஒதுக்கப்பட்ட நீர்',
    // Farm Brain
    farmBrainTitle: 'பண்ணை மூளை (FARM BRAIN)',
    aiDecision: 'AI முடிவு',
    prioritizeField: 'முன்னுரிமை',
    recommendedAllocation: 'பரிந்துரைக்கப்பட்ட நீர் ஒதுக்கீடு',
    whyThisDecision: 'இந்த முடிவின் காரணம் என்ன?',
    decisionConfidence: 'முடிவு நம்பிக்கை அளவு',
    hearDecision: 'முடிவை கேளுங்கள்',
    askAquaTwin: 'AquaTwin இடம் கேளுங்கள்',
    listening: 'கேட்கிறது...',
    speaking: 'பேசுகிறது...',
    stopAudio: 'ஆடியோ நிறுத்து',
    // Digital Twin
    digitalFarmTwin: 'டிஜிட்டல் பண்ணை இரட்டை',
    digitalFarmTwinSub: '6 விவசாய நிலங்களின் நிகழ்நேர மண் ஈரப்பதம் மற்றும் பயிர் நிலை',
    farmFuture: 'எதிர்கால அழுத்த கணிப்பு',
    stressTrajectory: 'நீர் அழுத்த பாதை',
    now: 'தற்போது',
    plus6h: '+6 மணி',
    plus12h: '+12 மணி',
    plus24h: '+24 மணி',
    // Statuses
    healthy: 'ஆரோக்கியம்',
    atRisk: 'அபாயத்தில்',
    critical: 'மிக ஆபத்து',
    moderate: 'நடுத்தரம்',
    high: 'அதிகம்',
    low: 'குறைவு',
    // Scenario Lab
    scenarioLabTitle: 'தகவமைப்பு சூழ்நிலை ஆய்வகம்',
    scenarioLabSub: 'பண்ணை சூழலை மாற்றி, AquaTwin உடனடியாக தகவமைப்பதை பாருங்கள்.',
    adaptFarmBtn: 'பண்ணையை தகவமை',
    presets: 'முன்னமைக்கப்பட்ட சூழ்நிலைகள்',
    presetWaterShortage: 'நீர் பற்றாக்குறை (10,000L → 5,000L)',
    presetRainSurge: 'மழை எழுச்சி (Rain Surge)',
    presetRainFailure: 'மழை பொய்த்தல் (Rain Failure)',
    presetHeatwave: 'வெப்ப அலை (42°C)',
    presetDrought: 'வறட்சி நிலை',
    presetBaseline: 'இயல்பு நிலைக்கு திரும்பு',
    availableWaterSlider: 'கிடைக்கும் நீர் அளவு (L)',
    rainProbabilitySlider: 'மழை வாய்ப்பு (%)',
    forecastConfidenceSlider: 'வானிலை முன்னறிவிப்பு நம்பிக்கை (%)',
    temperatureSlider: 'வளிமண்டல வெப்பநிலை (°C)',
    beforeVsAfter: 'தகவமைப்பிற்கு முன் vs பின்',
    before: 'முன்',
    after: 'பின்',
    whyAllocationChanged: 'ஒதுக்கீடு ஏன் மாறியது?',
    whatChanged: 'என்ன மாறியது?',
    // Decisions Page
    decisionsTitle: 'வெளிப்படையான முடிவெடுக்கும் நுண்ணறிவு',
    decisionsSub: 'முன்னுரிமை தரவரிசை மற்றும் விளிம்பு நீர் பயன் (Marginal Water Benefit)',
    fieldId: 'வயல் / பகுதி',
    crop: 'பயிர்',
    growthStage: 'வளர்ச்சி நிலை',
    soilMoisture: 'மண் ஈரப்பதம்',
    marginalBenefit: 'விளிம்பு நீர் பயன்',
    priorityScore: 'முன்னுரிமை மதிப்பெண்',
    allocationL: 'நீர் ஒதுக்கீடு',
    action: 'பரிந்துரைக்கப்பட்ட நடவடிக்கை',
    adaptationTimeline: 'தகவமைப்பு காலவரிசை',
    // Resilience Page
    resilienceTitle: 'இயற்கை இசைவு & நெகிழ்ச்சி மேலாண்மை',
    resilienceSub: 'இயக்கவியல் இருப்பு, நீர் விநியோக ஒருமைப்பாடு மற்றும் நிலத்தடி நீர் பாதுகாப்பு',
    waterBank: 'இயக்கவியல் நீர் வங்கி (Water Bank)',
    dynamicReserveTitle: 'அபாயத் தடுப்பு நெகிழ்ச்சி இருப்பு',
    rainOpportunity: 'மழைநீர் சேகரிப்பு வாய்ப்பு',
    waterIntegrity: 'விநியோக ஒருமைப்பாடு & கசிவு கண்காணிப்பு',
    groundwaterSafety: 'நிலத்தடி நீர் பாதுகாப்பு வரம்பு',
    simulatedBaselineComparison: 'உருவகப்படுத்தப்பட்ட ஒப்பீடு',
    fixedSchedule: 'நிலையான நேர அட்டவணை',
    equalAllocation: 'சமமான நீர் பகிர்வு',
    aquaTwinSystem: 'AquaTwin தகவமைப்பு அமைப்பு',
    waterEfficiency: 'நீர் பயன்பாட்டு திறன்',
    stressHoursSaved: 'பயிர் அழுத்த நேரம்',
    // Crops
    cropTomato: 'தக்காளி',
    cropRice: 'நெல்',
    cropGroundnut: 'நிலக்கடலை',
    cropMaize: 'மக்காச்சோளம்',
    cropCotton: 'பருத்தி',
    cropSugarcane: 'கரும்பு',
    // Growth Stages
    stageVegetative: 'வளர்ச்சி நிலை',
    stageFlowering: 'பூக்கும் நிலை',
    stagePodDev: 'காய் உருவாகும் நிலை',
    stageSilking: 'பூ தள்ளும் நிலை',
    stageBoll: 'காய் வெடிக்கும் நிலை',
    stageTillering: 'தூர்கட்டும் நிலை',
  },
};
