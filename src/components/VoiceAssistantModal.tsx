import React, { useState } from 'react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { answerFarmQuestionAsync, speakText, stopSpeech } from '../services/speechService';
import { isGeminiConfigured, GEMINI_MODEL } from '../services/geminiService';
import { Mic, MicOff, Volume2, X, ChevronRight, Loader2, Cpu } from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmState: FarmState;
  language: Language;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  farmState,
  language,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerSource, setAnswerSource] = useState<'gemini' | 'local'>('local');
  const t = translations[language];

  const suggestedQuestions = language === 'ta'
    ? [
        'எந்த வயலுக்கு முதலில் நீர் தேவை?',
        'நீர் ஒதுக்கீடு ஏன் மாறியது?',
        'எவ்வளவு நீர் கையிருப்பில் உள்ளது?',
        'நான் இப்போது எதற்கு பாசனம் செய்ய வேண்டும்?',
      ]
    : [
        'Which field needs water first?',
        'Why did the allocation change?',
        'How much water is available?',
        'What should I irrigate now?',
      ];

  const handleQuery = async (question: string) => {
    setRecognizedText(question);
    setIsThinking(true);
    setAnswer('');

    const res = await answerFarmQuestionAsync(question, farmState, language);
    setIsThinking(false);
    setAnswer(res.text);
    setAnswerSource(res.source);

    speakText(
      res.text,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert(language === 'ta' ? 'உங்கள் உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.' : 'Speech recognition not supported in this browser.');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'ta' ? 'ta-IN' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setIsListening(false);
        handleQuery(speechResult);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-sky-950/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-sky-300 animate-in zoom-in-95 duration-200 text-slate-900">
        <div className="flex items-center justify-between pb-3.5 border-b border-sky-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-100 text-water-700 border border-sky-300 shadow-xs">
              <Volume2 className="w-5 h-5 text-water-600" />
            </div>
            <div>
              <h3 className={`font-black font-display text-sky-950 text-base ${language === 'ta' ? 'font-tamil' : ''}`}>
                {t.askAquaTwin}
              </h3>
              <p className="text-[11px] text-slate-600 font-semibold">
                Grounded Voice Decision Briefing
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-sky-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listening / Microphone CTA */}
        <div className="my-6 text-center">
          <button
            onClick={startVoiceInput}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-md active:scale-95 ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-500/20'
                : 'bg-water-600 hover:bg-water-500 text-white hover:scale-105 shadow-water-600/30 shadow-lg'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 animate-bounce" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
          <p className={`text-xs font-bold text-slate-800 mt-3.5 ${language === 'ta' ? 'font-tamil' : ''}`}>
            {isListening ? t.listening : 'Click microphone or select a standard query'}
          </p>
        </div>

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="mb-5 p-3.5 rounded-lg bg-sky-50 border border-sky-200 text-xs flex items-center justify-center space-x-2.5 text-water-700 font-bold">
            <Loader2 className="w-4 h-4 animate-spin text-water-600" />
            <span className="font-bold">
              {isGeminiConfigured() ? `Consulting Gemini 3.8 Flash with live farm telemetry...` : 'Evaluating farm telemetry...'}
            </span>
          </div>
        )}

        {/* Answer Box if available */}
        {answer && !isThinking && (
          <div className="mb-5 p-4 rounded-lg bg-sky-50/80 border border-sky-200 text-xs animate-in fade-in">
            <div className="flex items-center justify-between text-water-800 font-bold mb-1.5 gap-2">
              <span className="truncate">Q: {recognizedText}</span>
              <div className="flex items-center space-x-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 ${
                    answerSource === 'gemini'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-white text-slate-700 border border-sky-200'
                  }`}
                >
                  <Cpu className="w-2.5 h-2.5" />
                  {answerSource === 'gemini' ? 'Gemini 3.8 Flash' : 'Telemetry Math'}
                </span>
                {isSpeaking ? (
                  <button
                    onClick={() => {
                      stopSpeech();
                      setIsSpeaking(false);
                    }}
                    className="text-rose-600 text-[10px] font-bold underline"
                  >
                    {t.stopAudio}
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      speakText(
                        answer,
                        language,
                        () => setIsSpeaking(true),
                        () => setIsSpeaking(false)
                      )
                    }
                    className="text-water-700 text-[10px] font-bold flex items-center"
                  >
                    <Volume2 className="w-3 h-3 mr-0.5" /> Replay
                  </button>
                )}
              </div>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">
              {answer}
            </p>
          </div>
        )}

        {/* Suggested Quick Questions */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
            Standard Farmer Queries (Deterministic):
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuery(q)}
              className="w-full text-left p-3 rounded-lg bg-sky-50/70 hover:bg-sky-100 hover:border-sky-300 border border-sky-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors group"
            >
              <span className={`truncate ${language === 'ta' ? 'font-tamil' : ''}`}>{q}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-water-600 shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
