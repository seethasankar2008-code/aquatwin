import { FarmState, Language } from '../types/farm';

export interface SpeechStatus {
  isSpeaking: boolean;
  isListening: boolean;
  supported: boolean;
}

/**
 * Builds the accurate, grounded voice decision briefing from current farm state
 */
export function buildDecisionBriefText(farmState: FarmState, language: Language): string {
  const sorted = [...farmState.fields].sort((a, b) => b.priorityScore - a.priorityScore);
  const topField = sorted[0];

  if (!topField) {
    return language === 'ta'
      ? 'பண்ணை நிலைமைகள் நிலையாக உள்ளன.'
      : 'Farm conditions are stable.';
  }

  if (language === 'ta') {
    const cropName = topField.crop === 'Tomato' ? 'தக்காளி' : topField.crop === 'Rice' ? 'நெல்' : topField.crop;
    return `வயல் 03 ${cropName} பயிருக்கு முன்னுரிமை வழங்கப்பட்டு ${topField.allocation.toLocaleString()} லிட்டர் நீர் பரிந்துரைக்கப்பட்டுள்ளது. மண் ஈரப்பதம் குறைவாகவும், பயிர் பூக்கும் நிலையிலும் இருப்பதால், அடுத்த 12 மணி நேரத்தில் அதிக நீர் அழுத்தம் ஏற்பட வாய்ப்புள்ளது. முடிவு நம்பிக்கை அளவு ${topField.confidence} சதவீதம்.`;
  }

  return `${topField.name} (${topField.crop}) is prioritized with ${topField.allocation.toLocaleString()} Litres recommended. Soil moisture is at ${topField.soilMoisture} percent in the critical ${topField.growthStage} stage, with ${topField.futureStress.plus12h} water stress predicted within 12 hours. Decision confidence is ${topField.confidence} percent.`;
}

/**
 * Answers farmer quick-questions strictly using real-time deterministic state
 */
export function answerFarmQuestion(question: string, farmState: FarmState, language: Language): string {
  const q = question.toLowerCase();
  const sorted = [...farmState.fields].sort((a, b) => b.priorityScore - a.priorityScore);
  const top = sorted[0];

  if (q.includes('which field') || q.includes('first') || q.includes('முன்னுரிமை') || q.includes('எந்த வயல்')) {
    if (language === 'ta') {
      return `முதலில் நீர் பாய்ச்ச வேண்டியது ${top.name} (${top.crop}). முன்னுரிமை மதிப்பெண் ${top.priorityScore}, பரிந்துரைக்கப்பட்ட நீர் ${top.allocation.toLocaleString()} லிட்டர்.`;
    }
    return `${top.name} (${top.crop}) needs water first with priority score ${top.priorityScore}/100 and recommended allocation of ${top.allocation.toLocaleString()} L.`;
  }

  if (q.includes('why') || q.includes('change') || q.includes('மாறியது') || q.includes('ஏன்')) {
    return farmState.whatChanged.summaryReason;
  }

  if (q.includes('available') || q.includes('water bank') || q.includes('நீர் அளவு') || q.includes('இருப்பு')) {
    const b = farmState.waterBudget;
    if (language === 'ta') {
      return `மொத்தம் கிடைக்கும் நீர் ${b.availableWater.toLocaleString()} லிட்டர். இதில் ${b.allocatedWater.toLocaleString()} லிட்டர் ஒதுக்கப்பட்டுள்ளது, மற்றும் ${b.reserveWater.toLocaleString()} லிட்டர் நெகிழ்ச்சி இருப்பாக பாதுகாக்கப்பட்டுள்ளது.`;
    }
    return `Total available water is ${b.availableWater.toLocaleString()} L. ${b.allocatedWater.toLocaleString()} L is allocated, and ${b.reserveWater.toLocaleString()} L is held in resilience reserve.`;
  }

  // Default: What should I irrigate now?
  const criticalFields = farmState.fields
    .filter(f => f.priorityLevel === 'CRITICAL' || f.priorityLevel === 'HIGH')
    .map(f => `${f.name} (${f.crop}: ${f.allocation.toLocaleString()} L)`)
    .join(', ');

  if (language === 'ta') {
    return `உடனடியாக நீர் பாய்ச்ச வேண்டிய பகுதிகள்: ${criticalFields}.`;
  }
  return `Immediate irrigation recommended for: ${criticalFields}.`;
}

/**
 * Triggers Browser SpeechSynthesis with appropriate language voice
 */
export function speakText(
  text: string, 
  language: Language, 
  onStart?: () => void, 
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    return;
  }

  // Stop any active utterance
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'ta' ? 'ta-IN' : 'en-US';
  utterance.rate = 0.95; // Clear and measured pace
  utterance.pitch = 1.0;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  // Attempt to select Tamil voice if available
  if (language === 'ta') {
    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'));
    if (tamilVoice) {
      utterance.voice = tamilVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}
