/**
 * Life RPG Progression Calculations
 * Non-linear XP formula: requiredXP(level) = Math.floor(100 * Math.pow(level, 1.5))
 */

export const getRequiredXP = (level) => {
  const lvl = Math.max(1, Math.floor(level));
  return Math.floor(100 * Math.pow(lvl, 1.5));
};

/**
 * Apply XP and compute level up with excess carryover
 */
export const calculateNewLevelAndXP = (currentLevel, currentXP, gainedXP) => {
  let level = Math.max(1, Number(currentLevel) || 1);
  let xp = (Number(currentXP) || 0) + (Number(gainedXP) || 0);
  let levelsGained = 0;

  while (true) {
    const reqXP = getRequiredXP(level);
    if (xp >= reqXP) {
      xp -= reqXP;
      level += 1;
      levelsGained += 1;
    } else {
      break;
    }
  }

  return {
    newLevel: level,
    newXP: xp,
    requiredXP: getRequiredXP(level),
    didLevelUp: levelsGained > 0,
    levelsGained
  };
};

/**
 * Format local date YYYY-MM-DD to avoid UTC midnight rollover bugs in local timezones
 */
export const getTodayDateString = (date = new Date()) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Calculate streak update based on local date (YYYY-MM-DD)
 */
export const calculateStreak = (lastActivityDate, currentStreak, longestStreak, streakShields = 0) => {
  const today = getTodayDateString();
  const curStreak = Number(currentStreak) || 0;
  let maxStreak = Number(longestStreak) || 0;
  const shieldsAvailable = Number(streakShields) || 0;

  if (!lastActivityDate) {
    // First day ever
    return {
      newStreak: 1,
      longestStreak: Math.max(maxStreak, 1),
      lastActivityDate: today,
      streakExtended: true,
      alreadyActiveToday: false,
      shieldConsumed: false,
      streakProtected: false
    };
  }

  const lastDateStr = typeof lastActivityDate === 'string'
    ? lastActivityDate.split('T')[0]
    : new Date(lastActivityDate).toISOString().split('T')[0];

  if (lastDateStr === today) {
    // Already logged activity today - don't increment streak again
    return {
      newStreak: Math.max(1, curStreak),
      longestStreak: Math.max(maxStreak, curStreak),
      lastActivityDate: today,
      streakExtended: false,
      alreadyActiveToday: true,
      shieldConsumed: false,
      streakProtected: false
    };
  }

  const todayDate = new Date(today);
  const lastDate = new Date(lastDateStr);
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

  if (diffDays === 1) {
    // Consecutive day
    const newStreak = curStreak + 1;
    return {
      newStreak,
      longestStreak: Math.max(maxStreak, newStreak),
      lastActivityDate: today,
      streakExtended: true,
      alreadyActiveToday: false,
      shieldConsumed: false,
      streakProtected: false
    };
  } else if (diffDays === 2 && shieldsAvailable > 0) {
    // Missed exactly 1 day, but user is protected by a Streak Shield!
    const newStreak = curStreak + 1;
    return {
      newStreak,
      longestStreak: Math.max(maxStreak, newStreak),
      lastActivityDate: today,
      streakExtended: true,
      alreadyActiveToday: false,
      shieldConsumed: true,
      streakProtected: true
    };
  } else {
    // Missed 1 or more days without a shield -> reset to 1
    return {
      newStreak: 1,
      longestStreak: Math.max(maxStreak, 1),
      lastActivityDate: today,
      streakExtended: true,
      alreadyActiveToday: false,
      shieldConsumed: false,
      streakProtected: false
    };
  }
};

/**
 * Attribute gain calculations based on quest category
 */
export const calculateAttributeGains = (category, xpReward) => {
  const xp = Number(xpReward) || 100;
  const gains = {
    intellect: 0,
    strength: 0,
    discipline: 0,
    knowledge: 0,
    mind: 0
  };

  const cat = (category || '').toLowerCase();

  if (cat.includes('cod') || cat.includes('math') || cat.includes('study') || cat.includes('intellect') || cat.includes('logic')) {
    gains.intellect = Math.max(1, Math.round(xp / 10));
    gains.knowledge = Math.max(0, Math.round(xp / 20));
  } else if (cat.includes('fit') || cat.includes('gym') || cat.includes('work') || cat.includes('strength') || cat.includes('run')) {
    gains.strength = Math.max(1, Math.round(xp / 10));
    gains.discipline = Math.max(0, Math.round(xp / 20));
  } else if (cat.includes('read') || cat.includes('book') || cat.includes('know') || cat.includes('learn')) {
    gains.knowledge = Math.max(1, Math.round(xp / 10));
    gains.intellect = Math.max(0, Math.round(xp / 20));
  } else if (cat.includes('mind') || cat.includes('meditat') || cat.includes('calm') || cat.includes('breath') || cat.includes('zen') || cat.includes('detox')) {
    gains.mind = Math.max(1, Math.round(xp / 10));
    gains.discipline = Math.max(1, Math.round(xp / 15));
  } else {
    gains.discipline = Math.max(1, Math.round(xp / 15));
    gains.mind = Math.max(1, Math.round(xp / 20));
  }

  return gains;
};
