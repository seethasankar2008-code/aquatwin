import React from 'react';
import { InsightEvent, Language } from '../types/farm';
import { Radio, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

interface AiInsightsFeedProps {
  insights: InsightEvent[];
  language: Language;
}

export const AiInsightsFeed: React.FC<AiInsightsFeedProps> = ({ insights, language }) => {
  const getIcon = (type: InsightEvent['type']) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      case 'success':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'warning':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="w-3.5 h-3.5 text-sky-500" />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-sky-200/90 shadow-sm shadow-sky-950/5">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-sky-100">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-water-600 animate-pulse" />
          <h3 className="text-sm font-black uppercase tracking-wider text-sky-950 font-display">
            {language === 'ta' ? 'நிகழ்நேர AI நுண்ணறிவு ஓடை' : 'LIVE AI INSIGHTS FEED'}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-sky-900 font-bold uppercase tracking-wider bg-sky-100/80 px-2 py-0.5 rounded border border-sky-200">Autonomous Monitor</span>
      </div>

      <div className="space-y-2.5">
        {insights.map((event) => (
          <div
            key={event.id}
            className="flex items-start space-x-3 p-3 rounded-lg bg-sky-50/70 border border-sky-200/80 hover:bg-sky-50 hover:border-sky-300 text-xs transition-colors"
          >
            <div className="mt-0.5 shrink-0">{getIcon(event.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-0.5">
                <span className="font-bold text-sky-950 truncate">{event.title}</span>
                <span className="font-mono text-[10px] text-slate-600 shrink-0 ml-2 font-semibold">
                  {event.timestamp}
                </span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed font-medium">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
