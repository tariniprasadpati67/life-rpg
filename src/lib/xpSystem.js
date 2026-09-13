/**
 * Life RPG - XP & Non-Linear Progression System
 * Formula: requiredXP(level) = Math.floor(100 * Math.pow(level, 1.5))
 */

export const getRequiredXP = (level) => {
  const lvl = Math.max(1, Math.floor(level));
  return Math.floor(100 * Math.pow(lvl, 1.5));
};

export const getProgressPercentage = (currentXP, level) => {
  const req = getRequiredXP(level);
  if (req <= 0) return 0;
  const pct = Math.min(100, Math.max(0, (currentXP / req) * 100));
  return Math.round(pct);
};

export const getRankTitle = (level) => {
  const lvl = Number(level) || 1;
  if (lvl >= 30) return 'Legendary Cyberlord';
  if (lvl >= 20) return 'Omniscient Architect';
  if (lvl >= 15) return 'Chrono Overlord';
  if (lvl >= 10) return 'Neural Vanguard';
  if (lvl >= 7) return 'Cyber Mercenary';
  if (lvl >= 4) return 'Neon Runner';
  if (lvl >= 2) return 'Grid Infiltrator';
  return 'Novice Drifter';
};

export const getCategoryColor = (category) => {
  switch (category) {
    case 'Coding':
      return {
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/40',
        glow: 'shadow-neon-cyan',
        accent: '#00f0ff'
      };
    case 'Fitness':
      return {
        text: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/40',
        glow: 'shadow-neon-magenta',
        accent: '#f72585'
      };
    case 'Reading':
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/40',
        glow: 'shadow-neon-gold',
        accent: '#ffb700'
      };
    case 'Mindfulness':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/40',
        glow: 'shadow-neon-emerald',
        accent: '#10b981'
      };
    case 'Study':
      return {
        text: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/40',
        glow: 'shadow-purple-500/30',
        accent: '#8b5cf6'
      };
    default:
      return {
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/40',
        glow: 'shadow-blue-500/30',
        accent: '#3b82f6'
      };
  }
};

export const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return { label: 'EASY', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
    case 'Medium':
      return { label: 'MEDIUM', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' };
    case 'Hard':
      return { label: 'HARD', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
    case 'Epic':
      return { label: 'EPIC BOSS', color: 'text-rose-400 border-rose-500/50 bg-rose-500/15 animate-pulse' };
    default:
      return { label: 'QUEST', color: 'text-slate-400 border-slate-700 bg-slate-800/40' };
  }
};

/**
 * Calculates attribute level and progress XP from total points or object
 * Brand new user with 0 points starts at Level 1, 0 / 100 XP
 */
export const getAttributeLevelAndXP = (value) => {
  if (typeof value === 'object' && value !== null && 'level' in value) {
    return {
      level: Math.max(1, Number(value.level) || 1),
      xp: Math.max(0, Number(value.xp) || 0),
      maxXP: Math.max(50, Number(value.maxXP) || 100)
    };
  }
  const points = typeof value === 'number' ? Math.max(0, value) : 0;
  const level = Math.max(1, Math.floor(points / 100) + 1);
  const xp = points % 100;
  const maxXP = 100;
  return { level, xp, maxXP };
};

