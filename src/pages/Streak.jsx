import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Check, Lock, Trophy, Award, Sparkles, Shield } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Sidebar } from '../components/Sidebar';
import { soundFx } from '../lib/soundEffects';
import { getStreakFlameStyle } from '../lib/cosmetics';
import { SEOHead } from '../components/SEOHead';

export const Streak = () => {
  const { profile, weeklyCalendar, claimStreakReward, equipCosmetic, unequipCosmetic } = useGame();
  const todayItem = (weeklyCalendar || []).find(d => d.isToday) || (weeklyCalendar || [])[(weeklyCalendar || []).length - 1];

  const currentStreak = profile?.current_streak ?? 7;
  const bestStreak = profile?.longest_streak ?? 21;
  const streakRewards = profile?.streak_rewards || { '7_day': 'claimed', '14_day': 'locked', '30_day': 'locked' };

  const shieldCount = Number(profile?.streak_shields) || 0;
  const isShieldEquipped = !!profile?.equipped_streak_shield && shieldCount > 0;

  // Equipped Streak Flame visual customization
  const flameStyle = getStreakFlameStyle(profile?.equipped_streak_flame);
  const isHyperFlame = flameStyle?.id === 'flame-hyper';
  const isInfernoFlame = flameStyle?.id === 'flame-inferno';

  let heroFlameBg = 'bg-gradient-to-tr from-amber-600 via-orange-500 to-red-500 shadow-[0_0_35px_rgba(245,158,11,0.5)]';
  let heroFlameColor = 'text-white fill-white';
  let heroSubtitle = "Keep going! You're on fire!";
  let heroSubtitleColor = 'text-amber-400';
  let heroGlow = 'bg-amber-500/10';

  if (isHyperFlame) {
    heroFlameBg = 'bg-gradient-to-tr from-cyan-600 via-blue-500 to-teal-400 shadow-[0_0_40px_rgba(6,182,212,0.7)]';
    heroFlameColor = 'text-white fill-cyan-200';
    heroSubtitle = 'Powered by Hyperdrive Plasma Flame';
    heroSubtitleColor = 'text-cyan-400';
    heroGlow = 'bg-cyan-500/15';
  } else if (isInfernoFlame) {
    heroFlameBg = 'bg-gradient-to-tr from-red-600 via-rose-500 to-orange-500 shadow-[0_0_40px_rgba(239,68,68,0.7)]';
    heroFlameColor = 'text-white fill-orange-200';
    heroSubtitle = 'Unleashing Dragonfire Inferno Blaze';
    heroSubtitleColor = 'text-rose-400';
    heroGlow = 'bg-rose-500/15';
  }

  const rewards = [
    {
      id: '7_day',
      title: '7 Day Warrior',
      description: 'Complete 7 consecutive days',
      icon: '🔥',
      status: streakRewards['7_day'] || 'claimed',
      reward: '🪙 +200 Gold • 💎 +15 Diamonds'
    },
    {
      id: '14_day',
      title: '10 Day Champion',
      description: 'Complete 10 consecutive days',
      icon: '🛡️',
      status: streakRewards['14_day'] || (currentStreak >= 10 ? 'claimable' : 'locked'),
      reward: '🪙 +500 Gold • 💎 +30 Diamonds'
    },
    {
      id: '30_day',
      title: '30 Day Legend',
      description: 'Complete 30 consecutive days',
      icon: '👑',
      status: streakRewards['30_day'] || (currentStreak >= 30 ? 'claimable' : 'locked'),
      reward: '🪙 +1,500 Gold • 💎 +100 Diamonds'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-[#070b14] relative overflow-hidden">
      {/* Ambient Anime Artwork Backdrop with Rich Color Grading */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-30 z-0"
        style={{ backgroundImage: 'url("/home-bg.jpg")' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#070b14]/75 via-[#070b14]/55 to-[#070b14]/85 pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar className="hidden md:flex relative z-10" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-y-auto space-y-6 relative z-10">
        <SEOHead
          title="Daily Streak & Milestones"
          description="Track your daily streak momentum, unlock animated streak flames, manage streak shields, and earn milestone rewards."
          canonical="/streak"
        />
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Streak
          </h1>
          <p className="text-xs text-slate-300">
            Maintain daily consistency to unlock exclusive rewards and prestige.
          </p>
        </div>

        {/* Main Streak Hero Card */}
        <section aria-label="Current Streak Momentum" className="bg-[#0a1020]/75 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.5)] relative overflow-hidden space-y-8">
          
          {/* Ambient Flame Glow Background */}
          <div className={`absolute -top-12 -left-12 w-80 h-80 ${heroGlow} rounded-full blur-3xl pointer-events-none transition-colors duration-500`} />

          {/* Top Half: Flame + Header + Stats Box */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            {/* Left: Flame & Flame Text */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ${heroFlameBg} flex items-center justify-center animate-flame-flicker transition-all duration-500`}>
                  <Flame className={`w-12 h-12 sm:w-14 sm:h-14 ${heroFlameColor} drop-shadow`} />
                </div>
              </div>

              <div>
                <div className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight flex items-baseline gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  <span>{currentStreak}</span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-200">Day Streak</span>
                </div>
                <p className={`text-xs sm:text-sm font-semibold mt-1 ${heroSubtitleColor} transition-colors drop-shadow`}>
                  {heroSubtitle}
                </p>

                {/* STREAK SHIELD STATUS PILL */}
                <div className="mt-2.5 flex items-center gap-2">
                  {isShieldEquipped ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/50 text-blue-300 font-heading font-bold text-xs shadow-[0_0_15px_rgba(59,130,246,0.3)] animate-pulse">
                      <Shield className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                      <span>Streak Shield Equipped • {shieldCount} Available</span>
                    </span>
                  ) : shieldCount > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 font-heading font-bold text-xs">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      <span>{shieldCount} Shield{shieldCount > 1 ? 's' : ''} in Inventory • Standby</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-500 text-[11px]">
                      <Shield className="w-3 h-3 text-slate-600" />
                      <span>No Shield Equipped</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Current Streak & Best Streak Metrics Box */}
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl p-4 shrink-0 shadow-md backdrop-blur-md">
              <div className="px-3 border-r border-white/10 text-center">
                <div className="text-[11px] text-slate-300 font-medium">Current Streak</div>
                <div className="font-heading font-black text-xl text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">{currentStreak} <span className="text-xs font-normal text-slate-400">Days</span></div>
              </div>
              <div className="px-3 text-center">
                <div className="text-[11px] text-slate-300 font-medium">Best Streak</div>
                <div className="font-heading font-black text-xl text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">{bestStreak} <span className="text-xs font-normal text-slate-400">Days</span></div>
              </div>
            </div>

          </div>

          {/* Bottom Half of Hero Card: Mon - Sun Weekly Track */}
          <div className="pt-5 border-t border-white/10 relative z-10">
            <div className="flex items-center justify-between mb-3 px-1 text-xs">
              <span className="text-slate-300 font-medium">Weekly Activity Matrix</span>
              <span className="text-[11px] font-semibold">
                {todayItem?.isCompleted ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Today Secured
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1.5 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" /> Action Required Today
                  </span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {weeklyCalendar.map((d) => {
                const isToday = Boolean(d.isToday);
                const isCompleted = Boolean(d.isCompleted);
                const isOnFire = Boolean(d.isOnFire || (isToday && isCompleted));

                return (
                  <div key={d.day} className="flex flex-col items-center gap-1.5 relative">
                    {/* Today Badge Indicator */}
                    {isToday ? (
                      <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                          : 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.4)] animate-pulse'
                      }`}>
                        TODAY
                      </span>
                    ) : (
                      <span className="h-[18px] block" />
                    )}

                    {/* Day Pill Box */}
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isOnFire
                          ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-110 ring-2 ring-amber-400/80'
                          : isToday && !isCompleted
                          ? 'bg-amber-500/20 border-2 border-amber-400/90 text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.35)] scale-105 animate-pulse ring-1 ring-amber-400/40'
                          : isCompleted
                          ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : d.isPast
                          ? 'bg-white/[0.04] text-slate-500 border border-white/5'
                          : 'bg-white/[0.02] text-slate-600 border border-white/5'
                      }`}
                      title={`${d.day}${isToday ? ' (Today)' : ''}: ${isCompleted ? 'Completed' : isToday ? 'Needs Quest Today' : d.isPast ? 'Missed' : 'Upcoming'}`}
                    >
                      {isOnFire ? (
                        <Flame className="w-5 h-5 fill-white text-white animate-pulse" />
                      ) : isToday && !isCompleted ? (
                        <Flame className="w-5 h-5 text-amber-400 stroke-[2.5]" />
                      ) : isCompleted ? (
                        <Check className="w-5 h-5 stroke-[3]" />
                      ) : (
                        <span className="text-xs font-mono">{d.isPast ? '○' : '·'}</span>
                      )}
                    </div>

                    {/* Day Label */}
                    <span className={`text-xs font-semibold ${
                      isToday
                        ? 'text-amber-300 font-black'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Today's Action Banner */}
            {todayItem && (
              <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                {todayItem.isCompleted ? (
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-emerald-300 font-medium">
                    <span className="text-base">🔥</span>
                    <span>
                      <strong>Streak Maintained!</strong> You completed a quest today. Streak active at <strong>{currentStreak} Days</strong>!
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-amber-300 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block shrink-0" />
                    <span>
                      <strong>Today ({todayItem.day}):</strong> Complete any quest today to extend your streak to <strong>{currentStreak + 1} Days</strong>!
                    </span>
                  </div>
                )}

                {!todayItem.isCompleted && (
                  <Link
                    to="/quests"
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-heading tracking-wide shadow-md transition-all active:scale-95 shrink-0"
                  >
                    <span>Complete Quest</span>
                    <span>→</span>
                  </Link>
                )}
              </div>
            )}
          </div>

        </section>

        {/* Streak Rewards Section */}
        <section aria-labelledby="streak-rewards-heading" className="space-y-4">
          <h2 id="streak-rewards-heading" className="font-heading font-black text-xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Streak Rewards
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <article 
                key={reward.id}
                className="bg-[#0a1020]/75 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-amber-500/30 flex flex-col justify-between space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-amber-500/25 flex items-center justify-center text-2xl shrink-0 shadow-sm">
                    {reward.icon}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-white">
                      {reward.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {reward.description}
                    </p>
                    <div className="text-[11px] text-amber-300 font-semibold mt-1">
                      {reward.reward}
                    </div>
                  </div>
                </div>

                {/* Status Button */}
                <div>
                  {reward.status === 'claimed' ? (
                    <button 
                      disabled 
                      className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Claimed</span>
                    </button>
                  ) : reward.status === 'claimable' ? (
                    <button 
                      onClick={() => claimStreakReward(reward.id)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-[0_4px_14px_rgba(245,158,11,0.35)] flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Claim Reward</span>
                    </button>
                  ) : (
                    <button 
                      disabled 
                      className="w-full py-2.5 rounded-xl bg-white/[0.04] text-slate-500 border border-white/5 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Not Unlocked</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};
