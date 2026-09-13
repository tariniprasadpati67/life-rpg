import React from 'react';
import { Zap, Sparkles, TrendingUp } from 'lucide-react';
import { getProgressPercentage, getRankTitle, getRequiredXP } from '../lib/xpSystem';

export const XPProgress = ({ profile, compact = false }) => {
  if (!profile) return null;

  const currentLevel = Number(profile.current_level) || 1;
  const currentXP = Number(profile.current_xp) || 0;
  const reqXP = profile.requiredXP || getRequiredXP(currentLevel);
  const percentage = getProgressPercentage(currentXP, currentLevel);
  const rankTitle = getRankTitle(currentLevel);
  const xpNeeded = Math.max(0, reqXP - currentXP);

  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-rpg">
          <span className="text-cyan-400 font-semibold tracking-wider">LEVEL {currentLevel}</span>
          <span className="text-slate-400">{currentXP} / {reqXP} XP ({percentage}%)</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700/60">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-700 ease-out shadow-neon-cyan"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-cyan-500/20 relative overflow-hidden group">
      {/* Background Cyber Accents */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-neon-cyan animate-pulse-glow">
              <div className="w-full h-full bg-cyber-card rounded-[10px] flex flex-col items-center justify-center">
                <span className="text-[10px] font-rpg text-cyan-400 uppercase tracking-widest -mb-1">LVL</span>
                <span className="text-2xl font-heading font-black text-white">{currentLevel}</span>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[10px] font-bold shadow-sm">
              <Zap className="w-3 h-3 fill-black" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-heading font-bold text-white tracking-wide">
                {profile.display_name || profile.username || 'Adventurer'}
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded border border-cyan-500/40 bg-cyan-500/10 text-cyan-300">
                {rankTitle}
              </span>
            </div>
            <p className="text-xs font-rpg text-slate-400 flex items-center gap-1.5 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Non-linear progression formula active: <code className="text-cyan-300">100 × LVL^1.5</code></span>
            </p>
          </div>
        </div>

        {/* XP Status Numerics */}
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-wider flex items-baseline justify-end gap-1">
            <span className="text-cyan-400">{currentXP.toLocaleString()}</span>
            <span className="text-slate-500 text-sm font-normal">/ {reqXP.toLocaleString()} XP</span>
          </div>
          <div className="text-xs font-rpg text-cyan-400/80 font-medium">
            {xpNeeded > 0 ? `${xpNeeded.toLocaleString()} XP to Level ${currentLevel + 1}` : 'Ready to Ascend!'}
          </div>
        </div>
      </div>

      {/* Futuristic Progress Bar Container */}
      <div className="relative z-10 space-y-2">
        <div className="w-full h-4 rounded-full bg-slate-900/90 p-0.5 border border-cyan-500/30 shadow-inner relative overflow-hidden">
          {/* Animated Bar */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 relative transition-all duration-1000 ease-out shadow-neon-cyan"
            style={{ width: `${percentage}%` }}
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        <div className="flex justify-between items-center text-[11px] font-rpg text-slate-400 px-1">
          <span>PROGRESS TO TIER {currentLevel + 1}</span>
          <span className="font-bold text-cyan-400 tracking-wider">{percentage}% SYNCHRONIZED</span>
        </div>
      </div>
    </div>
  );
};
