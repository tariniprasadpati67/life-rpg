import React from 'react';
import { Flame, Check, Calendar, Trophy, Zap, AlertCircle, Shield } from 'lucide-react';
import { STREAK_MILESTONES, getNextMilestone, getFlameStyle } from '../lib/streakSystem';
import { getStreakFlameStyle } from '../lib/cosmetics';

export const StreakPanel = ({ profile, weeklyCalendar = [], streakCelebration = null }) => {
  const currentStreak = Number(profile?.current_streak) || 0;
  const longestStreak = Number(profile?.longest_streak) || 0;
  const streakShields = Number(profile?.streak_shields) || 0;
  const defaultFlame = getFlameStyle(currentStreak);
  const customFlame = getStreakFlameStyle(profile?.equipped_streak_flame);
  const flame = customFlame || defaultFlame;
  const nextMilestone = getNextMilestone(currentStreak);

  // Fallback days if weeklyCalendar is empty
  const days = weeklyCalendar.length > 0 ? weeklyCalendar : [
    { day: 'MON', isToday: false, isCompleted: false },
    { day: 'TUE', isToday: false, isCompleted: false },
    { day: 'WED', isToday: false, isCompleted: false },
    { day: 'THU', isToday: true, isCompleted: currentStreak > 0 },
    { day: 'FRI', isToday: false, isCompleted: false },
    { day: 'SAT', isToday: false, isCompleted: false },
    { day: 'SUN', isToday: false, isCompleted: false },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-amber-500/20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Streak Extended Celebration Alert Banner */}
      {streakCelebration && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-400/50 flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2 text-amber-300 font-heading text-xs sm:text-sm font-bold">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-spin" />
            <span>🔥 STREAK EXTENDED! NOW AT {streakCelebration.streak} DAYS!</span>
          </div>
          <span className="text-[10px] font-rpg font-semibold uppercase px-2 py-0.5 rounded bg-amber-400 text-black">
            BONUS ACTIVE
          </span>
        </div>
      )}

      {/* Top Section: Streak Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3.5">
          <div className={`w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center ${flame.shadow} transition-all`}>
            <Flame className={`w-8 h-8 ${flame.color} fill-current animate-pulse`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-rpg font-semibold tracking-widest text-amber-400 uppercase">
                CURRENT STREAK
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${flame.badgeBg}`}>
                {flame.text}
              </span>
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-black text-white tracking-wider flex items-baseline gap-2">
              <span>{currentStreak}</span>
              <span className="text-sm font-rpg text-slate-400 font-semibold uppercase">
                {currentStreak === 1 ? 'DAY' : 'DAYS'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Status Capsule: Streak Shield & Longest Record */}
        <div className="flex items-center gap-2.5">
          {/* Active Streak Shield Pill */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-blue-500/30 bg-blue-950/40 shadow-sm" title="Streak Shield protects against 1 missed day">
            <Shield className="w-4 h-4 text-blue-400 fill-blue-400/20" />
            <div className="text-right">
              <div className="text-[10px] font-rpg text-blue-300 uppercase tracking-wider">STREAK SHIELD</div>
              <div className="text-xs font-heading font-bold text-white">
                {streakShields > 0 ? `${streakShields} ACTIVE` : '0 READY'}
              </div>
            </div>
          </div>

          {/* Longest Streak Record */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-800 bg-slate-900/60">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <div className="text-[10px] font-rpg text-slate-400 uppercase tracking-wider">RECORD BEST</div>
              <div className="text-xs font-heading font-bold text-white">{longestStreak} DAYS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Calendar: MON TUE WED THU FRI SAT SUN */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-rpg text-slate-400 mb-2 px-1">
          <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>WEEKLY ACTIVITY MATRIX</span>
          </span>
          <span>{currentStreak > 0 ? 'Protocol Maintained' : 'No Action Today'}</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {days.map((item, idx) => {
            const isCompleted = item.isCompleted;
            const isToday = item.isToday;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center py-2 rounded-xl border transition-all duration-300 ${
                  isToday && isCompleted
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-neon-gold scale-105'
                    : isToday && !isCompleted
                    ? 'bg-amber-500/10 border-amber-400/80 text-amber-300 animate-pulse ring-1 ring-amber-400/40'
                    : isCompleted
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-500'
                }`}
              >
                {isToday && (
                  <span className="text-[8px] font-black uppercase text-amber-300 tracking-tighter leading-none mb-0.5">TODAY</span>
                )}
                <span className="text-[10px] sm:text-xs font-rpg font-bold tracking-wider mb-1">
                  {item.day}
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isCompleted
                      ? 'bg-emerald-400 text-slate-950 font-bold shadow-sm'
                      : isToday
                      ? 'border border-dashed border-amber-400/80 text-amber-300 bg-amber-400/10'
                      : 'border border-slate-700 text-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span className="text-[9px] font-mono">{isToday ? '●' : '○'}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak Milestones: Bronze (3d), Silver (7d), Gold (14d), Legendary (30d) */}
      <div>
        <div className="flex items-center justify-between text-xs font-rpg text-slate-400 mb-2.5 px-1">
          <span className="font-semibold text-slate-300">STREAK MILESTONE TIERS</span>
          <span className="text-amber-400 font-medium">
            {nextMilestone.daysLeft > 0 ? `${nextMilestone.daysLeft} days to ${nextMilestone.name}` : 'Max Tier Reached!'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STREAK_MILESTONES.map((tier) => {
            const unlocked = currentStreak >= tier.days;
            return (
              <div
                key={tier.days}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  unlocked
                    ? `${tier.color} shadow-sm`
                    : 'border-slate-800/80 bg-slate-950/40 text-slate-600 opacity-60'
                }`}
              >
                <div className="text-lg mb-0.5">{tier.icon}</div>
                <div className="text-[10px] font-heading font-bold tracking-wider leading-tight">
                  {tier.name.split(' ')[0]}
                </div>
                <div className="text-[9px] font-rpg font-semibold tracking-widest mt-0.5">
                  {tier.days} DAYS {unlocked && '✓'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
