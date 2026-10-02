import { GoogleGenAI } from '@google/genai';
import { FieldVisualAnalysis, CropAppearance, SurfaceCondition, VisibleCropStress, VisualConfidence, FarmState, Language } from '../types/farm';

const STORAGE_KEY = 'aquatwin_gemini_api_key';
export const GEMINI_MODEL = 'gemini-3.8-flash';

/**
 * Retrieve the active Gemini API key from localStorage or Vite environment variable
 */
export function getGeminiApiKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored.trim().length > 0) {
      return stored.trim();
    }
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0 && !envKey.includes('your_gemini_api_key')) {
    return envKey.trim();
  }
  return '';
}

/**
 * Store user-configured API key in localStorage
 */
export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key && key.trim().length > 0) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}

/**
 * Clear stored API key
 */
export function clearGeminiApiKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Check if a valid API key is configured
 */
export function isGeminiConfigured(): boolean {
  return getGeminiApiKey().length > 0;
}

/**
 * Test connectivity with Google Gemini API
 */
export async function testGeminiApiKey(keyToTest?: string): Promise<{ success: boolean; message: string }> {
  const key = (keyToTest && keyToTest.trim().length > 0) ? keyToTest.trim() : getGeminiApiKey();
  if (!key) {
    return { success: false, message: 'No Gemini API key provided.' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: 'Respond with exactly the single word: OK',
    });

    if (response && response.text) {
      return { success: true, message: `Gemini API connected successfully (${GEMINI_MODEL}).` };
    }
    return { success: false, message: 'No response received from Gemini.' };
  } catch (error: any) {
    console.error('Gemini test error:', error);
    const msg = error?.message || 'Failed to authenticate with Gemini API.';
    return { success: false, message: msg };
  }
}

/**
 * Multimodal field photo analysis using Gemini 3.8 Flash
 */
export async function analyzePhotoWithGemini(params: {
  base64Data?: string;
  mimeType?: string;
  imageUrl?: string;
  crop: string;
  growthStage: string;
  soilType?: string;
}): Promise<FieldVisualAnalysis | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  try {
    let base64 = params.base64Data;
    let mimeType = params.mimeType || 'image/jpeg';

    // If an image URL was provided instead of raw base64, attempt to fetch it
    if (!base64 && params.imageUrl) {
      try {
        const res = await fetch(params.imageUrl);
        const blob = await res.blob();
        mimeType = blob.type || 'image/jpeg';
        const buffer = await blob.arrayBuffer();
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        base64 = window.btoa(binary);
      } catch (err) {
        console.warn('Could not fetch image URL for Gemini analysis, proceeding without image binary:', err);
      }
    }

    if (!base64) return null;

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert agronomist and precision agriculture computer vision specialist evaluating a field photo for AquaTwin (an adaptive farm water management system).
Target Crop: ${params.crop}
Phenological Growth Stage: ${params.growthStage}
Soil Classification: ${params.soilType || 'Loam'}

Carefully inspect the visual canopy foliage, leaf turgor, leaf curling/wilting, surface soil color, and soil cracking.
You MUST output ONLY a valid JSON object with EXACTLY this structure (no markdown fences, no extra text):
{
  "cropAppearance": "Healthy" | "Moderate Stress" | "Possible Stress" | "Severe Stress",
  "surfaceCondition": "Moist-looking" | "Dry-looking" | "Standing Water" | "Cracked",
  "visibleStress": "Low" | "Moderate" | "High" | "Severe",
  "confidence": "High" | "Medium" | "Low",
  "observation": "A clear, 1-2 sentence descriptive observation of specific botanical and soil traits observed in the photo."
}

CRITICAL: Provide qualitative diagnostic observation only. Do NOT invent fake numerical sensor readings or prescribe exact irrigation volumes.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64,
              },
            },
          ],
        },
      ],
    });

    const rawText = response.text || '';
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      photoUrl: params.imageUrl || (base64 ? `data:${mimeType};base64,${base64}` : undefined),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cropAppearance: (parsed.cropAppearance as CropAppearance) || 'Possible Stress',
      surfaceCondition: (parsed.surfaceCondition as SurfaceCondition) || 'Dry-looking',
      visibleStress: (parsed.visibleStress as VisibleCropStress) || 'Moderate',
      confidence: (parsed.confidence as VisualConfidence) || 'High',
      observation: parsed.observation || 'Canopy foliar analysis completed via Gemini Multimodal Vision.',
      disclaimer: 'Visual analysis powered by Gemini 3.8 Flash. Qualitative observation only; does not replace physical soil telemetry.',
    };
  } catch (error) {
    console.error('Gemini photo analysis failed:', error);
    return null;
  }
}

/**
 * Grounded conversational assistant powered by Gemini with live farm telemetry
 */
export async function askGeminiFarmAssistant(
  question: string,
  farmState: FarmState,
  language: Language
): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Format concise farm state summary for context injection
    const fieldsSummary = farmState.fields
      .map(
        (f) =>
          `- ${f.name} (${f.crop}, ${f.growthStage}): Soil Moisture ${f.soilMoisture}% (Target: ${f.targetMoisture}%), Yield Elasticity Ky: ${f.stageSensitivityKy}, Priority Score: ${f.priorityScore}/100, Allocation: ${f.allocation.toLocaleString()} L, Predicted 12h Stress: ${f.futureStress.plus12h}`
      )
      .join('\n');

    const telemetryContext = `CURRENT AQUATWIN FARM TELEMETRY:
- Available Water Pool: ${farmState.waterBudget.availableWater.toLocaleString()} L
- Total Allocated: ${farmState.waterBudget.allocatedWater.toLocaleString()} L
- Resilience Reserve Held: ${farmState.waterBudget.reserveWater.toLocaleString()} L
- Ambient Weather: ${farmState.weather.temperature}°C, Humidity ${farmState.weather.humidity}%, Rain Prob: ${farmState.weather.rainfallProbability}% (Confidence: ${farmState.weather.forecastConfidence}%), ET0: ${farmState.weather.et0} mm/day
- Active Scenario: ${farmState.activeScenario}
- Summary Reason for Recent Changes: ${farmState.whatChanged.summaryReason}
- Field Roster:
${fieldsSummary}`;

    const systemInstruction = `You are AquaTwin's agricultural voice advisor for farmers.
You explain water decisions made by the FAO-56 and bounded optimization engine.
Target Language: ${language === 'ta' ? 'Tamil (தமிழ்)' : 'English'}.

RULES:
1. Ground your answer ENTIRELY in the real telemetry provided.
2. Be direct, helpful, and concise (MAXIMUM 2 to 3 sentences so it is easily spoken aloud).
3. ${language === 'ta' ? 'Reply in natural, polite Tamil script.' : 'Reply in clear English.'}
4. Never contradict the current allocation numbers or available water pool.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemInstruction}\n\n${telemetryContext}\n\nFarmer Question: "${question}"\n\nAnswer:` },
          ],
        },
      ],
    });

    const answer = response.text?.trim();
    return answer || null;
  } catch (error) {
    console.error('Gemini farm assistant failed:', error);
    return null;
  }
}
