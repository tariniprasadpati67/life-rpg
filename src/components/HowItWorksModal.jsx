import React from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Target, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { soundFx } from '../lib/soundEffects';

export const HowItWorksModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'Pick or Create Quests',
      desc: 'Choose real-life daily tasks from Coding, Study, Fitness, Reading, and Mindfulness categories, or create custom quests.',
      icon: Target,
      color: 'bg-purple-500/15 border-purple-500/30 text-purple-400'
    },
    {
      num: '02',
      title: 'Complete in Real Life & Claim XP',
      desc: 'Finish your task in real life, then hit "Complete". You instantly earn XP rewards with audio and particle feedback.',
      icon: Zap,
      color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
    },
    {
      num: '03',
      title: 'Build 7-Day Streaks',
      desc: 'Complete at least 1 quest every day to maintain your streak flame and keep all 7 day circles checked.',
      icon: Flame,
      color: 'bg-amber-500/15 border-amber-500/30 text-amber-400'
    },
    {
      num: '04',
      title: 'Level Up & Power Up Stats',
      desc: 'Reach your XP milestone to experience the golden Level Up ceremony, ascending tiers and boosting your 5 Character Attributes.',
      icon: TrendingUp,
      color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-[#0e1424] border border-[#232e4d] p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182035] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
              How Life RPG Works
            </h2>
            <p className="text-xs text-slate-400">
              Turn your real-world goals and habits into an engaging game.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="space-y-3.5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#111625] border border-[#1e263d] hover:border-[#2d3757] transition-all"
              >
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 ${step.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Step {step.num}
                    </span>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Character Attributes Notice */}
        <div className="p-3.5 rounded-2xl bg-[#0c101d] border border-[#1e263d] text-xs text-slate-400 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Every Coding, Fitness, Study, Reading, and Mindfulness quest automatically powers up your Intellect, Strength, and Discipline stats!
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-[#6d5df6] hover:bg-[#5b4ae3] shadow-[0_4px_16px_rgba(109,93,246,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Got It! Let's Level Up</span>
          </button>
        </div>

      </div>
    </div>
  );
};
