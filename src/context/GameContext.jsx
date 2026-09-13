import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { soundFx } from '../lib/soundEffects';
import { getRequiredXP } from '../lib/xpSystem';
import { parseDurationMinutes } from '../lib/timerUtils';
import { QuestCompletionOverlay } from '../components/QuestCompletionOverlay';
import { getRandomDailyQuests } from '../data/questTemplates';

const GameContext = createContext(null);

// Baseline balanced daily quests covering all 4 Character Attributes (Intellect, Strength, Knowledge, Mind)
const DEFAULT_QUESTS = [
  { 
    id: 'q-1', 
    title: 'Study Mathematics & Logic', 
    category: 'Study', 
    difficulty: 'Medium', 
    duration: '40 min', 
    xp_reward: 60, 
    gold_reward: 120, 
    is_completed_today: false,
    is_active: false
  },
  { 
    id: 'q-2', 
    title: 'Coding Practice & Algorithms', 
    category: 'Coding', 
    difficulty: 'Hard', 
    duration: '60 min', 
    xp_reward: 80, 
    gold_reward: 160, 
    is_completed_today: false,
    is_active: true
  },
  { 
    id: 'q-3', 
    title: 'Gym / Strength Training', 
    category: 'Fitness', 
    difficulty: 'Medium', 
    duration: '45 min', 
    xp_reward: 55, 
    gold_reward: 110, 
    is_completed_today: false,
    is_active: false
  },
  { 
    id: 'q-4', 
    title: 'Read 20 Pages of a Book', 
    category: 'Knowledge', 
    difficulty: 'Easy', 
    duration: '30 min', 
    xp_reward: 40, 
    gold_reward: 80, 
    is_completed_today: false,
    is_active: false
  },
  { 
    id: 'q-5', 
    title: 'Morning Deep Meditation', 
    category: 'Mind', 
    difficulty: 'Easy', 
    duration: '15 min', 
    xp_reward: 35, 
    gold_reward: 70, 
    is_completed_today: false,
    is_active: false
  }
];

export const generateWeeklyCalendar = (currentStreak = 1) => {
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7; // 0 for Mon, ..., 5 for Sat, 6 for Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - todayIndex);

  const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  return dayNames.map((day, idx) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + idx);
    const dateStr = formatLocalDate(d);
    const isToday = idx === todayIndex;
    const isPast = idx < todayIndex;
    const isFuture = idx > todayIndex;
    const isCompleted = isPast ? (currentStreak >= (todayIndex - idx)) : false;

    return {
      day,
      date: dateStr,
      isToday,
      isPast,
      isFuture,
      isCompleted,
      isOnFire: isToday && isCompleted
    };
  });
};

export const GameProvider = ({ children }) => {
  const { user, token } = useAuth();

  const [profile, setProfile] = useState(() => {
    try {
      localStorage.removeItem('rpg_local_profile_v2');
      const saved = localStorage.getItem('rpg_local_profile_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'demo-user-123',
      username: 'Alex Rider',
      display_name: 'Alex Rider',
      email: 'alex@gamerpg.com',
      avatar_url: '/avatar-alex.jpg',
      level: 1,
      current_xp: 450,
      target_xp: 1000,
      tier: 'Bronze',
      current_streak: 1,
      longest_streak: 1,
      gold: 850,
      diamonds: 40,
      intellect: 0,
      strength: 0,
      knowledge: 0,
      mind: 0,
      discipline: 0,
      equipped_frame: 'Fire Frame',
      equipped_theme: 'Galaxy Theme',
      equipped_badge: 'Novice Adventurer',
      equipped_aura: null,
      equipped_completion_effect: null,
      equipped_victory_emote: null,
      equipped_streak_flame: null,
      streak_shields: 0,
      inventory: ['frame-fire', 'badge-bronze'],
      streak_rewards: { '7_day': 'locked', '14_day': 'locked', '30_day': 'locked' },
      sound_enabled: true
    };
  });

  const [quests, setQuests] = useState(() => {
    try {
      localStorage.removeItem('rpg_local_quests_v2');
      const saved = localStorage.getItem('rpg_local_quests_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_QUESTS;
  });

  const [weeklyCalendar, setWeeklyCalendar] = useState(() => generateWeeklyCalendar(profile?.current_streak ?? 1));

  const [recentCompletions, setRecentCompletions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FX States
  const [levelUpData, setLevelUpData] = useState(null);
  const [streakCelebration, setStreakCelebration] = useState(null);
  const [floatingXPs, setFloatingXPs] = useState([]);
  const [soundMuted, setSoundMuted] = useState(false);
  const [activeCompletionEffect, setActiveCompletionEffect] = useState(null);

  // Active Quest Timers state: { [questId]: { questId, title, category, totalSeconds, remainingSeconds, isRunning, isFinished, durationMinutes } }
  const [questTimers, setQuestTimers] = useState({});
  const [activeFocusQuest, setActiveFocusQuest] = useState(null);
  const completingQuestsRef = useRef(new Set());

  // Load saved timers for current user
  useEffect(() => {
    if (!user?.id) return;
    const isGuest = user.id === 'demo-user-123' || user.id?.startsWith('demo-') || user.isGuest;
    const userScope = isGuest ? 'guest' : user.id;
    try {
      const savedTimers = localStorage.getItem(`rpg_timers_${userScope}`);
      if (savedTimers) {
        const parsed = JSON.parse(savedTimers);
        // STRICT SINGLE ACTIVE TIMER: Ensure at most 1 timer is running
        let runningFound = false;
        const sanitized = {};
        Object.keys(parsed).forEach(id => {
          const t = parsed[id];
          if (t?.isRunning && !t?.isFinished && (t?.remainingSeconds > 0)) {
            if (!runningFound) {
              runningFound = true;
              sanitized[id] = t;
            } else {
              // Pause duplicate running timers
              sanitized[id] = { ...t, isRunning: false };
            }
          } else {
            sanitized[id] = t;
          }
        });
        setQuestTimers(sanitized);
      } else {
        setQuestTimers({});
      }
    } catch (e) {
      setQuestTimers({});
    }
  }, [user?.id]);

  // Persist timers to localStorage
  useEffect(() => {
    if (!user?.id) return;
    const isGuest = user.id === 'demo-user-123' || user.id?.startsWith('demo-') || user.isGuest;
    const userScope = isGuest ? 'guest' : user.id;
    try {
      localStorage.setItem(`rpg_timers_${userScope}`, JSON.stringify(questTimers));
    } catch (e) {}
  }, [questTimers, user?.id]);

  // Live countdown tick effect (1-second intervals) - STRICT SINGLE TIMER EXECUTION
  useEffect(() => {
    const runningIds = Object.keys(questTimers).filter(
      id => questTimers[id]?.isRunning && questTimers[id]?.remainingSeconds > 0
    );
    if (runningIds.length === 0) return;

    // Pick ONLY the single active running timer
    const activeRunningId = runningIds[0];

    const interval = setInterval(() => {
      setQuestTimers(prev => {
        const t = prev[activeRunningId];
        if (!t || !t.isRunning || t.remainingSeconds <= 0) return prev;

        const newRemaining = t.remainingSeconds - 1;
        const isDone = newRemaining <= 0;

        const next = {};
        Object.keys(prev).forEach(id => {
          if (id === activeRunningId) {
            next[id] = {
              ...t,
              remainingSeconds: Math.max(0, newRemaining),
              isRunning: !isDone,
              isFinished: isDone
            };
          } else if (prev[id]?.isRunning) {
            // Safety: ensure any other timer is kept paused
            next[id] = {
              ...prev[id],
              isRunning: false
            };
          } else {
            next[id] = prev[id];
          }
        });

        if (isDone) {
          try {
            soundFx.playTimerDone();
          } catch (e) {}
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questTimers]);

  // Save to localStorage when updated
  useEffect(() => {
    if (profile) {
      try {
        localStorage.setItem('rpg_local_profile_v3', JSON.stringify(profile));
      } catch (e) {}
    }
  }, [profile]);

  useEffect(() => {
    if (quests && quests.length > 0) {
      try {
        localStorage.setItem('rpg_local_quests_v3', JSON.stringify(quests));
      } catch (e) {}
    }
  }, [quests]);

  useEffect(() => {
    soundFx.setMuted(soundMuted);
  }, [soundMuted]);

  useEffect(() => {
    setWeeklyCalendar(generateWeeklyCalendar(profile?.current_streak ?? 1));
  }, [profile?.current_streak]);

  // Auth fetch headers helper
  const getHeaders = useCallback(() => {
    const isGuest = user?.id === 'demo-user-123' || user?.id?.startsWith('demo-') || user?.isGuest;
    const activeToken = isGuest ? 'demo-user-123' : (token || localStorage.getItem('rpg_auth_token') || 'demo-user-123');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${activeToken}`
    };
  }, [token, user]);

  // Load user game state with graceful local fallback
  const fetchGameData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const [profileRes, questsRes] = await Promise.all([
        fetch('/api/progress/profile', { headers: getHeaders() }).catch(() => null),
        fetch('/api/quests', { headers: getHeaders() }).catch(() => null)
      ]);

      if (profileRes && profileRes.ok) {
        const pData = await profileRes.json();
        if (pData.success && pData.profile) {
          const isGuest = user.id === 'demo-user-123' || user.id?.startsWith('demo-') || user.isGuest;
          const userScope = isGuest ? 'guest' : user.id;
          const uName = user.user_metadata?.username || user.email?.split('@')[0] || (isGuest ? 'CyberRunner' : 'Hero');
          const dName = user.user_metadata?.display_name || uName;

          const freshProfile = {
            ...pData.profile,
            display_name: pData.profile.display_name || dName
          };

          setProfile(freshProfile);
          try {
            localStorage.setItem(`rpg_profile_${userScope}`, JSON.stringify(freshProfile));
          } catch (e) {}

          if (pData.weeklyCalendar) setWeeklyCalendar(pData.weeklyCalendar);
          if (pData.recentCompletions) setRecentCompletions(pData.recentCompletions);
        }
      } else if (isSupabaseConfigured && supabase && user?.id && !user?.isGuest && user?.id !== 'demo-user-123') {
        // Direct Supabase query fallback for Vercel / Cloud deployments!
        try {
          const { data: supaProf } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (supaProf) {
            const uName = supaProf.username || user.user_metadata?.username || user.email?.split('@')[0] || 'Hero';
            const freshProfile = {
              ...supaProf,
              display_name: supaProf.display_name || uName
            };
            setProfile(freshProfile);
            try {
              localStorage.setItem(`rpg_profile_${user.id}`, JSON.stringify(freshProfile));
            } catch (e) {}
          }
        } catch (supaErr) {
          console.warn('Supabase client profile fallback notice:', supaErr);
        }
      }

      if (questsRes && questsRes.ok) {
        const qData = await questsRes.json();
        if (qData.success && qData.quests && qData.quests.length > 0) {
          setQuests(qData.quests);
          try {
            const isGuest = user.id === 'demo-user-123' || user.id?.startsWith('demo-') || user.isGuest;
            const userScope = isGuest ? 'guest' : user.id;
            localStorage.setItem(`rpg_quests_${userScope}`, JSON.stringify(qData.quests));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.warn('Backend sync paused, running in offline mode:', err);
    } finally {
      setLoading(false);
    }
  }, [user, getHeaders]);

  // Sync profile/quests when user identity switches (e.g. from Tarini to Guest)
  useEffect(() => {
    if (!user) return;
    const isGuest = user.id === 'demo-user-123' || user.id?.startsWith('demo-') || user.isGuest;
    const userScope = isGuest ? 'guest' : user.id;

    try {
      const cached = localStorage.getItem(`rpg_profile_${userScope}`);
      if (cached) {
        setProfile(JSON.parse(cached));
      } else if (isGuest) {
        setProfile({
          id: 'demo-user-123',
          username: 'CyberRunner',
          display_name: 'Cyber Runner',
          email: 'runner@cyber.net',
          avatar_url: '/avatar-alex.jpg',
          current_level: 3,
          current_xp: 350,
          requiredXP: 519,
          tier: 'Silver',
          current_streak: 5,
          longest_streak: 9,
          gold: 450,
          diamonds: 25,
          intellect: 45,
          strength: 32,
          discipline: 38,
          knowledge: 40,
          mind: 30,
          equipped_frame: 'Fire Frame',
          equipped_theme: 'Galaxy Theme',
          equipped_badge: 'Novice Adventurer',
          inventory: ['frame-fire', 'theme-galaxy'],
          sound_enabled: true
        });
      }
    } catch (e) {}

    fetchGameData();
  }, [user?.id, fetchGameData]);

  // Trigger floating XP effect
  const spawnFloatingXP = (xp, clientX, clientY) => {
    const id = Date.now() + Math.random();
    const x = clientX || window.innerWidth / 2;
    const y = clientY || window.innerHeight / 2;
    setFloatingXPs(prev => [...prev, { id, xp, x, y }]);

    setTimeout(() => {
      setFloatingXPs(prev => prev.filter(item => item.id !== id));
    }, 1400);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6d5df6', '#a855f7', '#f59e0b', '#38bdf8', '#ffffff']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6d5df6', '#f59e0b']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#10b981']
        });
      }, 300);
    } catch (e) {}
  };

  // Complete Quest with full offline resilience
  // Complete Quest with full offline resilience and duplicate protection
  const completeQuest = async (questId, clickEvent) => {
    if (completingQuestsRef.current.has(questId)) return;
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.is_completed_today) return;

    completingQuestsRef.current.add(questId);

    // Safe sound and visual celebration
    try {
      soundFx.playQuestComplete();
    } catch (e) {}

    // Trigger equipped completion effect if user has one equipped
    if (profile?.equipped_completion_effect) {
      setActiveCompletionEffect(profile.equipped_completion_effect);
      setTimeout(() => {
        setActiveCompletionEffect(null);
      }, 2600);
    }

    const xpBounty = Number(quest.xp_reward) || 60;
    const goldBounty = Number(quest.gold_reward) || (xpBounty * 2) || 120;

    setFloatingXPs(prev => [
      ...prev,
      { id: Date.now(), amount: xpBounty, gold: goldBounty }
    ]);

    // Immediately mark quest completed in local state & cache
    const nextQuests = quests.map(q => q.id === questId ? { ...q, is_completed_today: true, is_active: false } : q);
    setQuests(nextQuests);
    try {
      localStorage.setItem('rpg_local_quests_v3', JSON.stringify(nextQuests));
    } catch (e) {}

    // Clean up timer for this completed quest so next quest can run
    setQuestTimers(prev => {
      const next = { ...prev };
      delete next[questId];
      return next;
    });
    if (activeFocusQuest?.id === questId) {
      setActiveFocusQuest(null);
    }

    // Calculate progression locally
    const currentLvl = Math.max(1, Number(profile?.current_level) || 1);
    const currentXp = Math.max(0, Number(profile?.current_xp) || 0);
    const reqXp = Math.max(50, Number(profile?.requiredXP) || 100);

    let newXp = currentXp + xpBounty;
    let newLvl = currentLvl;
    let didLevelUp = false;
    let newReqXp = reqXp;

    if (newXp >= reqXp) {
      didLevelUp = true;
      newLvl = currentLvl + 1;
      newXp = newXp - reqXp;
      newReqXp = Math.floor(100 * Math.pow(newLvl, 1.3));
    }

    // Boost corresponding attribute points
    const cat = (quest.category || '').toLowerCase();
    let intellect = typeof profile?.intellect === 'number' ? profile.intellect : 0;
    let strength = typeof profile?.strength === 'number' ? profile.strength : 0;
    let knowledge = typeof profile?.knowledge === 'number' ? profile.knowledge : 0;
    let mind = typeof profile?.mind === 'number' ? profile.mind : 0;

    if (cat.includes('cod') || cat.includes('study') || cat.includes('math')) {
      intellect += xpBounty;
    } else if (cat.includes('fit') || cat.includes('gym') || cat.includes('work')) {
      strength += xpBounty;
    } else if (cat.includes('read') || cat.includes('know')) {
      knowledge += xpBounty;
    } else {
      mind += xpBounty;
    }

    // Immediately mark today as completed in weekly calendar
    setWeeklyCalendar(prev => prev.map(d => d.isToday ? { ...d, isCompleted: true, isOnFire: true } : d));

    const wasAlreadyCompletedToday = weeklyCalendar.some(d => d.isToday && d.isCompleted);
    const curStreak = Number(profile?.current_streak) || 0;
    const nextStreak = wasAlreadyCompletedToday ? curStreak : curStreak + 1;
    const nextLongest = Math.max(Number(profile?.longest_streak) || 0, nextStreak);

    const updatedProfile = {
      ...profile,
      current_level: newLvl,
      current_xp: newXp,
      requiredXP: newReqXp,
      current_streak: nextStreak,
      longest_streak: nextLongest,
      total_xp: (Number(profile?.total_xp) || 0) + xpBounty,
      gold: (Number(profile?.gold) || 0) + goldBounty,
      intellect,
      strength,
      knowledge,
      mind
    };

    setProfile(updatedProfile);

    // Clean up timer for completed quest
    setQuestTimers(prev => {
      const next = { ...prev };
      delete next[questId];
      return next;
    });
    if (activeFocusQuest?.id === questId) {
      setActiveFocusQuest(null);
    }

    // If level up happened!
    if (didLevelUp) {
      try {
        soundFx.playLevelUp();
      } catch (e) {}
      triggerConfetti();
      setLevelUpData({
        oldLevel: currentLvl,
        newLevel: newLvl,
        levelsGained: 1,
        xpGained: xpBounty,
        equipped_victory_emote: profile?.equipped_victory_emote || null
      });
    }

    // Try server sync asynchronously in background
    try {
      const res = await fetch(`/api/quests/${questId}/complete`, {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          setProfile(prev => ({
            ...prev,
            ...data.profile,
            current_level: data.profile.current_level,
            current_xp: data.profile.current_xp,
            current_streak: data.profile.current_streak,
            longest_streak: data.profile.longest_streak
          }));
        }

        // Fetch fresh weekly calendar and profile from server
        fetch('/api/progress/profile', { headers: getHeaders() })
          .then(r => r.json())
          .then(p => {
            if (p.success && p.weeklyCalendar) {
              setWeeklyCalendar(p.weeklyCalendar);
            }
          })
          .catch(() => {});
      }
    } catch (e) {
      console.warn('Server sync failed, completion recorded locally:', e);
    } finally {
      completingQuestsRef.current.delete(questId);
    }
  };

  // Create Quest
  const createQuest = async (questData) => {
    const newQ = {
      id: `q-${Date.now()}`,
      title: questData.title,
      description: questData.description || '',
      category: questData.category || 'Coding',
      difficulty: questData.difficulty || 'Medium',
      duration: questData.duration || '30 min',
      xp_reward: Number(questData.xp_reward) || 100,
      is_completed_today: false,
      created_at: new Date().toISOString()
    };

    soundFx.playClick();
    setQuests(prev => [newQ, ...prev]);

    try {
      await fetch('/api/quests', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(questData)
      });
    } catch (e) {}

    return newQ;
  };

  // Update Quest
  const updateQuest = async (questId, updates) => {
    soundFx.playClick();
    setQuests(prev => prev.map(q => q.id === questId ? { ...q, ...updates } : q));
    try {
      await fetch(`/api/quests/${questId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates)
      });
    } catch (e) {}
  };

  // Delete Quest
  const deleteQuest = async (questId) => {
    soundFx.playDelete();
    setQuests(prev => prev.filter(q => q.id !== questId));
    setQuestTimers(prev => {
      const next = { ...prev };
      delete next[questId];
      return next;
    });
    if (activeFocusQuest?.id === questId) {
      setActiveFocusQuest(null);
    }
    try {
      await fetch(`/api/quests/${questId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (e) {}
    return true;
  };

  // Roll / Generate fresh balanced daily quests across Intellect, Strength, Knowledge, Mind
  const rollDailyQuests = async () => {
    soundFx.playClick();
    const userId = user?.id || 'demo-user-123';
    const isGuest = userId === 'demo-user-123' || userId?.startsWith('demo-') || user?.isGuest;
    const userScope = isGuest ? 'guest' : userId;

    const fresh = getRandomDailyQuests(userId, 5);
    setQuests(fresh);

    try {
      localStorage.setItem('rpg_local_quests_v3', JSON.stringify(fresh));
      localStorage.setItem(`rpg_quests_${userScope}`, JSON.stringify(fresh));
    } catch (e) {}

    try {
      const res = await fetch('/api/quests/generate-daily', {
        method: 'POST',
        headers: getHeaders()
      });
      if (res.ok) {
        const d = await res.json();
        if (d.success && d.quests && d.quests.length > 0) {
          setQuests(d.quests);
          try {
            localStorage.setItem(`rpg_quests_${userScope}`, JSON.stringify(d.quests));
          } catch (e) {}
        }
      }
    } catch (e) {}

    return fresh;
  };

  // Start Quest Timer (Strict Single Active Timer: Pauses all others)
  const startQuestTimer = (questId, durationStr) => {
    soundFx.playClick();
    const targetQuest = quests.find(q => q.id === questId);
    const mins = parseDurationMinutes(durationStr || targetQuest?.duration || 45);
    const totalSecs = mins * 60;

    setQuestTimers(prev => {
      const updated = {};
      // Pause ALL other timers first! Only ONE timer can run in the entire app
      Object.keys(prev).forEach(id => {
        updated[id] = {
          ...prev[id],
          isRunning: false
        };
      });

      const existing = prev[questId];
      if (existing) {
        updated[questId] = {
          ...existing,
          isRunning: true,
          isFinished: false
        };
      } else {
        updated[questId] = {
          questId,
          title: targetQuest?.title || 'Quest',
          category: targetQuest?.category || 'General',
          totalSeconds: totalSecs,
          remainingSeconds: totalSecs,
          isRunning: true,
          isFinished: false,
          durationMinutes: mins
        };
      }
      return updated;
    });

    setQuests(prev => prev.map(q => q.id === questId ? { ...q, is_active: true } : q));
  };

  const pauseQuestTimer = (questId) => {
    soundFx.playClick();
    setQuestTimers(prev => {
      if (!prev[questId]) return prev;
      return {
        ...prev,
        [questId]: { ...prev[questId], isRunning: false }
      };
    });
  };

  const resumeQuestTimer = (questId) => {
    soundFx.playClick();
    setQuestTimers(prev => {
      if (!prev[questId]) return prev;
      const updated = {};
      // Pause ALL other timers so strictly only questId is running
      Object.keys(prev).forEach(id => {
        updated[id] = {
          ...prev[id],
          isRunning: id === questId
        };
      });
      return updated;
    });
  };

  const resetQuestTimer = (questId) => {
    soundFx.playClick();
    setQuestTimers(prev => {
      const t = prev[questId];
      if (!t) return prev;
      return {
        ...prev,
        [questId]: {
          ...t,
          remainingSeconds: t.totalSeconds,
          isRunning: false,
          isFinished: false
        }
      };
    });
  };

  const addTimeToTimer = (questId, extraMinutes = 5) => {
    soundFx.playClick();
    setQuestTimers(prev => {
      const t = prev[questId];
      if (!t) return prev;
      const addSecs = extraMinutes * 60;
      return {
        ...prev,
        [questId]: {
          ...t,
          totalSeconds: t.totalSeconds + addSecs,
          remainingSeconds: t.remainingSeconds + addSecs,
          isFinished: false
        }
      };
    });
  };

  const startQuest = startQuestTimer;

  // Buy Shop Item with server sync and strict duplicate/shield capacity checks
  const buyShopItem = async (item) => {
    soundFx.playClick();
    const cost = Number(item.price) || 0;
    const currency = item.currency || 'gold';
    const currentGold = Number(profile?.gold ?? 0);
    const currentDiamonds = Number(profile?.diamonds ?? 0);

    if (currency === 'gold' && currentGold < cost) {
      return {
        success: false,
        error: `Insufficient Gold! You have ${currentGold} Gold, but need ${cost} Gold. Complete quests to earn more!`
      };
    }
    if (currency === 'diamonds' && currentDiamonds < cost) {
      return {
        success: false,
        error: `Insufficient Diamonds! You have ${currentDiamonds} Diamonds, but need ${cost} Diamonds. Complete streak milestones to earn more!`
      };
    }

    const isShield = item.id === 'item-streak-shield' || item.type === 'streak_shield';
    if (isShield) {
      const currentShields = Number(profile?.streak_shields) || 0;
      if (currentShields >= (item.maxStack || 5)) {
        return {
          success: false,
          error: 'Maximum Streak Shield capacity (5) reached! Your streak is already heavily protected.'
        };
      }
    } else {
      const inv = profile?.inventory || [];
      if (inv.includes(item.id)) {
        return {
          success: false,
          error: 'You already own this item in your inventory!'
        };
      }
    }

    try {
      const res = await fetch('/api/progress/shop/buy', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ itemId: item.id })
      });
      const data = await res.json();
      if (res.ok && data.success && data.profile) {
        setProfile(prev => ({ ...prev, ...data.profile }));
        triggerConfetti();
        return { success: true, profile: data.profile, message: data.message };
      } else {
        return {
          success: false,
          error: data.error || data.message || 'Failed to complete purchase.'
        };
      }
    } catch (e) {
      console.warn('Server offline, applying purchase locally:', e);
      // Fallback local update
      const nextGold = currency === 'gold' ? Math.max(0, currentGold - cost) : currentGold;
      const nextDiamonds = currency === 'diamonds' ? Math.max(0, currentDiamonds - cost) : currentDiamonds;
      const nextInventory = (profile?.inventory || []).includes(item.id)
        ? profile?.inventory
        : [...(profile?.inventory || []), item.id];

      const updates = {
        gold: nextGold,
        diamonds: nextDiamonds,
        inventory: nextInventory
      };
      if (isShield) {
        updates.streak_shields = (Number(profile?.streak_shields) || 0) + 1;
        updates.equipped_streak_shield = true;
      }
      setProfile(prev => ({ ...prev, ...updates }));
      triggerConfetti();
      return { success: true, profile: updates };
    }
  };
  const buyItem = buyShopItem;

  // Convert Gold into Diamonds with authoritative server sync & fallback
  const convertGoldToDiamonds = async (goldAmount, diamondsAmount) => {
    soundFx.playClick();
    const goldToSpend = Number(goldAmount);
    const diamondsToGain = Number(diamondsAmount);

    const currentGold = Number(profile?.gold ?? 0);
    const currentDiamonds = Number(profile?.diamonds ?? 0);

    if (currentGold < goldToSpend) {
      return {
        success: false,
        error: `Insufficient Gold! You have ${currentGold.toLocaleString()} Gold, but need ${goldToSpend.toLocaleString()} Gold.`
      };
    }

    try {
      const res = await fetch('/api/progress/convert-currency', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ goldAmount: goldToSpend, diamondsAmount: diamondsToGain })
      });
      const data = await res.json();
      if (res.ok && data.success && data.profile) {
        setProfile(prev => ({ ...prev, ...data.profile }));
        triggerConfetti();
        soundFx.playReward();
        return { success: true, profile: data.profile, message: data.message };
      } else {
        return {
          success: false,
          error: data.error || data.message || 'Failed to convert currency.'
        };
      }
    } catch (e) {
      console.warn('Server offline, converting currency locally:', e);
      const newGold = Math.max(0, currentGold - goldToSpend);
      const newDiamonds = currentDiamonds + diamondsToGain;
      const updates = { gold: newGold, diamonds: newDiamonds };
      setProfile(prev => ({ ...prev, ...updates }));
      triggerConfetti();
      soundFx.playReward();
      return {
        success: true,
        profile: updates,
        message: `Successfully converted ${goldToSpend.toLocaleString()} Gold into ${diamondsToGain.toLocaleString()} Diamonds!`
      };
    }
  };

  // Equip Cosmetic with full category support & server verification
  const equipCosmetic = async (type, item) => {
    soundFx.playClick();
    const targetItemId = item.id || item.name;

    // Optimistic local update
    let updates = {};
    if (type === 'frame') updates = { equipped_frame: item.name };
    else if (type === 'theme') updates = { equipped_theme: item.name };
    else if (type === 'badge') updates = { equipped_badge: item.name };
    else if (type === 'aura') updates = { equipped_aura: item.name };
    else if (type === 'completion_effect') updates = { equipped_completion_effect: item.name };
    else if (type === 'victory_emote') updates = { equipped_victory_emote: item.name };
    else if (type === 'streak_flame') updates = { equipped_streak_flame: item.name };
    else if (type === 'streak_shield') updates = { 
      equipped_streak_shield: true,
      equipped_aura: item.name || 'Aegis Streak Shield Orbit'
    };

    setProfile(prev => ({ ...prev, ...updates }));

    try {
      const res = await fetch('/api/progress/shop/equip', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ type, itemId: targetItemId })
      });
      const data = await res.json();
      if (res.ok && data.success && data.profile) {
        setProfile(prev => ({ ...prev, ...data.profile }));
      } else if (res.status === 403) {
        alert(data.message || 'You must own this item before equipping it!');
        fetchGameData();
      }
    } catch (e) {
      console.warn('Failed to sync equip to server:', e);
    }
  };

  // Unequip Cosmetic
  const unequipCosmetic = async (type) => {
    soundFx.playClick();
    let updates = {};
    if (type === 'frame') updates = { equipped_frame: 'Fire Frame' };
    else if (type === 'badge') updates = { equipped_badge: null };
    else if (type === 'aura') updates = { equipped_aura: null };
    else if (type === 'completion_effect') updates = { equipped_completion_effect: null };
    else if (type === 'victory_emote') updates = { equipped_victory_emote: null };
    else if (type === 'streak_flame') updates = { equipped_streak_flame: null };
    else if (type === 'streak_shield') {
      updates = { 
        equipped_streak_shield: false,
        equipped_aura: (profile?.equipped_aura?.toLowerCase().includes('shield') ? null : profile?.equipped_aura)
      };
    }

    setProfile(prev => ({ ...prev, ...updates }));

    try {
      const res = await fetch('/api/progress/shop/unequip', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (res.ok && data.success && data.profile) {
        setProfile(prev => ({ ...prev, ...data.profile }));
      }
    } catch (e) {
      console.warn('Failed to sync unequip to server:', e);
    }
  };

  // Preview completion effect on demand (interactive shop preview)
  const previewCompletionEffect = (effectName) => {
    soundFx.playLevelUp();
    setActiveCompletionEffect(effectName || 'Supernova XP Burst');
    setTimeout(() => {
      setActiveCompletionEffect(null);
    }, 2600);
  };

  // Claim Streak Reward
  const claimStreakReward = (rewardKey) => {
    soundFx.playLevelUp();
    triggerConfetti();
    setProfile(prev => ({
      ...prev,
      gold: (prev.gold || 850) + 200,
      diamonds: (prev.diamonds || 40) + 15,
      streak_rewards: {
        ...(prev.streak_rewards || {}),
        [rewardKey]: 'claimed'
      }
    }));
  };

  // Generic Profile Update
  const updateProfile = (updates) => {
    soundFx.playClick();
    setProfile(prev => ({ ...prev, ...updates }));
  };

  // Update Profile Avatar (DP)
  const updateProfileAvatar = async (avatarUrl) => {
    soundFx.playClick();
    setProfile(prev => ({
      ...prev,
      avatar_url: avatarUrl
    }));

    try {
      await fetch('/api/progress/profile', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ avatar_url: avatarUrl })
      });
    } catch (e) {
      console.log('Avatar saved locally.');
    }
  };

  // Toggle Sound
  const toggleSound = () => {
    const nextVal = !soundMuted;
    setSoundMuted(nextVal);
    soundFx.setMuted(nextVal);
    setProfile(prev => ({ ...prev, sound_enabled: !nextVal }));
  };

  const closeLevelUpModal = () => {
    setLevelUpData(null);
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        quests,
        weeklyCalendar,
        recentCompletions,
        loading,
        error,
        levelUpData,
        streakCelebration,
        floatingXPs,
        soundMuted,
        questTimers,
        activeFocusQuest,
        setActiveFocusQuest,
        completeQuest,
        startQuest,
        startQuestTimer,
        pauseQuestTimer,
        resumeQuestTimer,
        resetQuestTimer,
        addTimeToTimer,
        createQuest,
        updateQuest,
        deleteQuest,
        rollDailyQuests,
        buyShopItem,
        convertGoldToDiamonds,
        equipCosmetic,
        unequipCosmetic,
        activeCompletionEffect,
        previewCompletionEffect,
        claimStreakReward,
        updateProfile,
        toggleSound,
        updateProfileAvatar,
        closeLevelUpModal,
        fetchGameData
      }}
    >
      {/* Active Quest Completion Visual Effect Overlay */}
      {activeCompletionEffect && (
        <QuestCompletionOverlay effectName={activeCompletionEffect} />
      )}
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
