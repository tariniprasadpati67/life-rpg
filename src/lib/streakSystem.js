/**
 * Life RPG - Daily Streak System & Milestones
 */

export const STREAK_MILESTONES = [
  { days: 3, name: 'BRONZE VANGUARD', icon: '🥉', color: 'text-amber-600 border-amber-600/40 bg-amber-600/10' },
  { days: 7, name: 'SILVER SENTINEL', icon: '🥈', color: 'text-slate-300 border-slate-300/40 bg-slate-400/10' },
  { days: 14, name: 'GOLD CHAMPION', icon: '🥇', color: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10' },
  { days: 30, name: 'LEGENDARY CYBERLORD', icon: '👑', color: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/15 shadow-neon-cyan' },
];

export const getNextMilestone = (currentStreak) => {
  const streak = Number(currentStreak) || 0;
  for (const m of STREAK_MILESTONES) {
    if (streak < m.days) {
      return {
        ...m,
        daysLeft: m.days - streak,
        progress: Math.min(100, Math.round((streak / m.days) * 100))
      };
    }
  }
  return {
    days: 100,
    name: 'MYTHIC OVERLORD',
    icon: '⚡',
    color: 'text-purple-400 border-purple-400/40 bg-purple-400/15',
    daysLeft: 100 - streak,
    progress: 100
  };
};

export const getFlameStyle = (streak) => {
  const count = Number(streak) || 0;
  if (count >= 30) {
    return {
      color: 'text-cyan-400',
      shadow: 'drop-shadow(0 0 16px #00f0ff)',
      text: 'COSMIC PLASMA',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
    };
  }
  if (count >= 14) {
    return {
      color: 'text-amber-400',
      shadow: 'drop-shadow(0 0 14px #ffb700)',
      text: 'GOLDEN INFERNO',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400'
    };
  }
  if (count >= 7) {
    return {
      color: 'text-rose-400',
      shadow: 'drop-shadow(0 0 12px #f43f5e)',
      text: 'BLAZING FIRE',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400'
    };
  }
  if (count >= 3) {
    return {
      color: 'text-orange-400',
      shadow: 'drop-shadow(0 0 8px #fb923c)',
      text: 'BURNING EMBER',
      badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400'
    };
  }
  return {
    color: 'text-slate-500',
    shadow: 'none',
    text: 'SPARK',
    badgeBg: 'bg-slate-800 text-slate-400 border-slate-700'
  };
};
