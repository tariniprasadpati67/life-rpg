/**
 * Life RPG Quest Timer Utilities
 */

export const parseDurationMinutes = (durationStr) => {
  if (typeof durationStr === 'number' && !isNaN(durationStr)) {
    return Math.max(1, durationStr);
  }
  if (!durationStr) return 45;
  const match = String(durationStr).match(/\d+/);
  return match ? Math.max(1, parseInt(match[0], 10)) : 45;
};

export const formatTimeRemaining = (totalSeconds) => {
  if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds <= 0) {
    return '00:00';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    const hh = hours < 10 ? `0${hours}` : `${hours}`;
    return `${hh}:${mm}:${ss}`;
  }

  return `${mm}:${ss}`;
};

export const calculateProgressPercent = (remainingSeconds, totalSeconds) => {
  if (!totalSeconds || totalSeconds <= 0) return 0;
  if (!remainingSeconds || remainingSeconds <= 0) return 100;
  const elapsed = totalSeconds - remainingSeconds;
  return Math.min(100, Math.max(0, Math.round((elapsed / totalSeconds) * 100)));
};
