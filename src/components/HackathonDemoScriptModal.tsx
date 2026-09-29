import React from 'react';
import { Award, ChevronRight, X } from 'lucide-react';
import { Language } from '../types/farm';

interface HackathonDemoScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onJumpToTab: (tab: string) => void;
}

export const HackathonDemoScriptModal: React.FC<HackathonDemoScriptModalProps> = ({
  isOpen,
  onClose,
  language,
  onJumpToTab,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Command Center & Farm Context',
      say: '"AquaTwin manages water allocation across 6 distinct crops facing limited supply and unpredictable weather forecasts."',
      action: 'Examine top metrics and the live FARM BRAIN decision.',
      tab: 'command-center',
    },
    {
      step: 2,
      title: 'Water Shortage Scenario (10,000 L → 5,000 L)',
      say: '"When available water drops by 50%, AquaTwin does not thin allocations equally. It protects the flowering tomato while shielding a 1,200 L resilience reserve."',
      action: 'Select "Water Shortage" in Scenario Lab and click ADAPT FARM.',
      tab: 'scenario-lab',
    },
    {
      step: 3,
      title: 'Rain Surge Scenario',
      say: '"When an 85% rain surge is detected with high confidence, AquaTwin cuts irrigation by 60% and recommends storage bund preparation."',
      action: 'Select "Rain Surge" and watch irrigation demand collapse to save water.',
      tab: 'scenario-lab',
    },
    {
      step: 4,
      title: 'Rain Failure Scenario (Uncertainty Defense)',
      say: '"When forecasted rain fails and heat spikes to 37°C, AquaTwin dynamically taps the resilience reserve to prevent flower drop."',
      action: 'Select "Rain Failure" to observe uncertainty re-adaptation.',
      tab: 'scenario-lab',
    },
    {
      step: 5,
      title: 'Explainable AI ("Why This Field?")',
      say: '"Every decision is transparently decomposed into growth stage sensitivity, root deficit, and future stress trajectory."',
      action: 'Open Decisions tab to view factor-by-factor breakdown.',
      tab: 'decisions',
    },
    {
      step: 6,
      title: 'Bilingual Tamil Farmer Support (தமிழ்)',
      say: '"Switching languages translates every insight into natural agricultural Tamil without altering a single simulation digit."',
      action: 'Click EN | தமிழ் toggle in header.',
      tab: 'command-center',
    },
    {
      step: 7,
      title: 'Voice Decision Brief (🔊 HEAR DECISION)',
      say: '"Farmers can listen to grounded audio briefs generated strictly from live telemetry."',
      action: 'Click "Hear Decision" button in the header or Farm Brain.',
      tab: 'command-center',
    },
    {
      step: 8,
      title: 'Water Efficiency & Baseline Comparison',
      say: '"Compared to fixed timers or naive equal distribution, AquaTwin delivers 94% useful water efficiency with 90% fewer stress hours."',
      action: 'Open Resilience tab to inspect simulated comparative metrics.',
      tab: 'resilience',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200/90 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                <Award className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                HACK4VALUES JUDGING GUIDE
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              3-Minute Competition Demo Walkthrough
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Follow these 8 steps to demonstrate all 4 judging criteria: Adaptiveness (30%), Water-Efficiency (25%), Innovation (20%), and Demo (25%).
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 my-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-eco-300 transition-colors"
            >
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-extrabold text-xs text-eco-950">
                  Step {s.step}: {s.title}
                </span>
                <button
                  onClick={() => {
                    onJumpToTab(s.tab);
                    onClose();
                  }}
                  className="text-[11px] font-bold text-aqua-800 hover:text-aqua-950 flex items-center"
                >
                  Jump to screen <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              <blockquote className="text-xs italic text-slate-700 bg-white p-3 rounded-xl border border-slate-100 my-2 leading-relaxed">
                {s.say}
              </blockquote>

              <p className="text-[11px] text-slate-500 font-medium">
                <strong className="text-slate-800">Action:</strong> {s.action}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-xs font-extrabold text-eco-950 font-serif italic">
            EVERY DROP IS A DECISION.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-eco-900 hover:bg-eco-800 text-white font-bold text-xs shadow-xs transition-all active:scale-98"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
