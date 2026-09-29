import React, { useState } from 'react';
import { FarmState, Language } from '../types/farm';
import { translations } from '../i18n/translations';
import { answerFarmQuestion, speakText, stopSpeech } from '../services/speechService';
import { Mic, MicOff, Volume2, X, Sparkles, ChevronRight } from 'lucide-react';

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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [answer, setAnswer] = useState('');
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

  const handleQuery = (question: string) => {
    setRecognizedText(question);
    const reply = answerFarmQuestion(question, farmState, language);
    setAnswer(reply);
    speakText(
      reply,
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200/90 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-aqua-100 text-aqua-800 border border-aqua-200">
              <Sparkles className="w-5 h-5 text-aqua-600" />
            </div>
            <div>
              <h3 className={`font-extrabold text-slate-900 text-base ${language === 'ta' ? 'font-tamil' : ''}`}>
                {t.askAquaTwin}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Grounded Voice Decision Briefing
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
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
                ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-100'
                : 'bg-gradient-to-tr from-sky-950 via-sky-850 to-cyan-600 text-white hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 animate-bounce" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
          <p className={`text-xs font-bold text-slate-700 mt-3.5 ${language === 'ta' ? 'font-tamil' : ''}`}>
            {isListening ? t.listening : 'Click microphone or select a standard query'}
          </p>
        </div>

        {/* Answer Box if available */}
        {answer && (
          <div className="mb-5 p-4 rounded-2xl bg-aqua-50/80 border border-aqua-200/90 text-xs">
            <div className="flex items-center justify-between text-aqua-950 font-bold mb-1.5">
              <span className="truncate">Q: {recognizedText}</span>
              {isSpeaking ? (
                <button
                  onClick={() => {
                    stopSpeech();
                    setIsSpeaking(false);
                  }}
                  className="text-rose-600 text-[10px] font-extrabold underline"
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
                  className="text-aqua-800 text-[10px] font-extrabold flex items-center"
                >
                  <Volume2 className="w-3 h-3 mr-0.5" /> Replay
                </button>
              )}
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">
              {answer}
            </p>
          </div>
        )}

        {/* Suggested Quick Questions */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Standard Farmer Queries (Deterministic):
          </span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuery(q)}
              className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-sky-50 hover:border-sky-300 border border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors group"
            >
              <span className={`truncate ${language === 'ta' ? 'font-tamil' : ''}`}>{q}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-800 shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
