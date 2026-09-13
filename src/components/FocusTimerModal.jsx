import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Check, 
  X, 
  Minimize2, 
  Sparkles, 
  Flame, 
  Brain 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatTimeRemaining, calculateProgressPercent, parseDurationMinutes } from '../lib/timerUtils';

export const FocusTimerModal = () => {
  const { 
    activeFocusQuest, 
    setActiveFocusQuest, 
    questTimers, 
    pauseQuestTimer, 
    resumeQuestTimer, 
    resetQuestTimer, 
    addTimeToTimer, 
    completeQuest 
  } = useGame();

  if (!activeFocusQuest) return null;

  const timer = questTimers?.[activeFocusQuest.id];
  const defaultSecs = parseDurationMinutes(activeFocusQuest.duration) * 60;
  const remaining = timer?.remainingSeconds ?? defaultSecs;
  const total = timer?.totalSeconds ?? defaultSecs;
  const isRunning = timer ? timer.isRunning : false;
  const isFinished = timer ? timer.isFinished : (remaining <= 0);
  const progress = calculateProgressPercent(remaining, total);

  const timeStr = formatTimeRemaining(remaining);
  const hasHours = timeStr.length > 5;

  // SVG Circular progress math (expanded radius for perfect text fit)
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  // Progress stroke offset: 0% elapsed = offset circumference; 100% elapsed = offset 0
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleComplete = async () => {
    await completeQuest(activeFocusQuest.id);
    setActiveFocusQuest(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080c16]/85 backdrop-blur-md animate-fadeIn">
      
      {/* Ambient Radial Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-500/20 blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f172a] border border-[#1e293b] p-6 sm:p-8 shadow-[0_0_50px_rgba(15,23,42,0.9)] flex flex-col items-center text-center space-y-6 overflow-hidden">
        
        {/* Top Controls: Quest Badge & Close/Minimize */}
        <div className="w-full flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-blue-400" />
            <span>ACTIVE FOCUS QUEST</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveFocusQuest(null)}
              className="p-2 rounded-xl bg-[#1e293b]/60 hover:bg-[#1e293b] text-slate-400 hover:text-white transition-colors"
              title="Minimize to background"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveFocusQuest(null)}
              className="p-2 rounded-xl bg-[#1e293b]/60 hover:bg-[#1e293b] text-slate-400 hover:text-white transition-colors"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quest Title & XP Bounties */}
        <div className="space-y-1.5 z-10 max-w-sm">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight truncate">
            {activeFocusQuest.title}
          </h2>
          <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
            <span className="text-cyan-400 font-bold">+{activeFocusQuest.xp_reward || 60} XP</span>
            {activeFocusQuest.gold_reward && (
              <>
                <span>•</span>
                <span className="text-amber-400 font-bold">🪙 +{activeFocusQuest.gold_reward} Gold</span>
              </>
            )}
            <span>•</span>
            <span className="capitalize">{activeFocusQuest.category || 'General'}</span>
          </div>
        </div>

        {/* Circular Countdown Dial (Sized so time never overflows ring) */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 280 280">
            {/* Background track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="rgba(30, 41, 59, 0.8)"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Active progress ring */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke={isFinished ? '#10b981' : isRunning ? '#38bdf8' : '#64748b'}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"
            />
          </svg>

          {/* Central Digital Display (Dynamically scaled & padded) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">
            <span 
              className={`font-mono font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] select-none transition-all ${
                hasHours 
                  ? 'text-3xl sm:text-4xl tracking-tight' 
                  : 'text-4xl sm:text-5xl tracking-normal'
              }`}
            >
              {timeStr}
            </span>
            <div className="mt-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase border backdrop-blur-sm ${
                isFinished 
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 animate-pulse' 
                  : isRunning 
                    ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 animate-pulse' 
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
              }`}>
                {isFinished ? '🎉 Quest Complete' : isRunning ? '⚡ Focus Active' : '⏸️ Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full space-y-3 z-10 pt-2">
          <div className="flex items-center justify-center gap-3">
            {/* Pause/Resume Toggle */}
            {!isFinished && (
              isRunning ? (
                <button
                  type="button"
                  onClick={() => pauseQuestTimer(activeFocusQuest.id)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#1e293b] hover:bg-[#27354f] border border-amber-500/30 text-amber-300 font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => resumeQuestTimer(activeFocusQuest.id)}
                  className="flex-1 py-3 px-4 rounded-2xl bg-[#2b59ff] hover:bg-blue-600 text-white font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[0_4px_14px_rgba(43,89,255,0.4)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </button>
              )
            )}

            {/* +5 Min Extension */}
            <button
              type="button"
              onClick={() => addTimeToTimer(activeFocusQuest.id, 5)}
              className="py-3 px-4 rounded-2xl bg-[#1e293b] hover:bg-[#27354f] border border-slate-700 text-slate-300 font-heading font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              title="Add 5 minutes to timer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+5 Min</span>
            </button>

            {/* Reset Timer */}
            <button
              type="button"
              onClick={() => resetQuestTimer(activeFocusQuest.id)}
              className="py-3 px-3.5 rounded-2xl bg-[#1e293b] hover:bg-[#27354f] border border-slate-700 text-slate-400 hover:text-white transition-all active:scale-95"
              title="Reset timer to original duration"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Claim / Complete Button - ONLY appears after timer finishes! */}
          {isFinished ? (
            <button
              type="button"
              onClick={handleComplete}
              className="w-full py-3.5 rounded-2xl font-heading font-bold text-sm text-white bg-gradient-to-r from-amber-500 via-emerald-500 to-green-500 hover:from-amber-400 hover:to-green-400 shadow-[0_4px_25px_rgba(16,185,129,0.55)] animate-pulse transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 fill-current text-amber-200" />
              <span>Claim {activeFocusQuest.xp_reward || 60} XP Bounty & Complete!</span>
            </button>
          ) : (
            <div className="w-full py-3 px-4 rounded-2xl bg-[#111a2e]/80 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-center gap-2">
              <Flame className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
              <span>Timer in progress — Complete the countdown to claim XP!</span>
            </div>
          )}
        </div>

        {/* Motivational Tagline */}
        <p className="text-xs text-slate-400 italic">
          "Discipline today, freedom tomorrow. Every second spent builds your stats."
        </p>

      </div>

    </div>
  );
};
