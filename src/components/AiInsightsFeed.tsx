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
        return <Info className="w-3.5 h-3.5 text-aqua-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            {language === 'ta' ? 'நிகழ்நேர AI நுண்ணறிவு ஓடை' : 'LIVE AI INSIGHTS FEED'}
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Autonomous Monitor</span>
      </div>

      <div className="space-y-3">
        {insights.map((event) => (
          <div
            key={event.id}
            className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 text-xs"
          >
            <div className="mt-0.5 shrink-0">{getIcon(event.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between mb-0.5">
                <span className="font-bold text-slate-900 truncate">{event.title}</span>
                <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-2">
                  {event.timestamp}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">{event.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
