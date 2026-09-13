import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { localStore } from '../data/store.js';
import { getRandomDailyQuests } from '../data/questTemplates.js';
import {
  calculateNewLevelAndXP,
  calculateStreak,
  calculateAttributeGains,
  getRequiredXP,
  getTodayDateString
} from '../utils/progression.js';
import { 
  unpackProfileMetadata, 
  packProfileInventory, 
  sanitizeSupabaseUpdates 
} from '../utils/profileMetadata.js';

// Cache to prevent rapid concurrent double-clicks
const activeCompletions = new Set();

// Helper to parse duration and clean description
const parseQuestDuration = (q) => {
  let duration = q.duration;
  let cleanDesc = q.description || '';
  if (cleanDesc.includes('[duration:')) {
    const match = cleanDesc.match(/\[duration:\s*([^\]]+)\]/i);
    if (match) {
      duration = match[1].trim();
      cleanDesc = cleanDesc.replace(/\[duration:\s*[^\]]+\]/gi, '').trim();
    }
  }
  if (!duration) {
    switch (q.difficulty) {
      case 'Easy': duration = '15 min'; break;
      case 'Medium': duration = '30 min'; break;
      case 'Hard': duration = '45 min'; break;
      case 'Epic': duration = '60 min'; break;
      default: duration = '30 min';
    }
  }
  return { duration, cleanDesc };
};

/**
 * GET /api/quests
 * Returns user quests with completion status for today
 */
export const getQuests = async (req, res) => {
  try {
    const userId = req.user.id;
    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));
    const today = getTodayDateString();

    if (isSupabaseConfigured && !isGuest) {
      let { data: quests, error: qErr } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (qErr) throw qErr;

      // Auto-seed balanced daily quests across Intellect, Strength, Knowledge & Mind if user has 0 quests
      if (!quests || quests.length === 0) {
        const seeds = getRandomDailyQuests(userId, 5);
        const { data: inserted } = await supabase
          .from('quests')
          .insert(seeds.map(s => ({
            id: s.id,
            user_id: userId,
            title: s.title,
            description: s.description,
            category: s.category,
            difficulty: s.difficulty,
            duration: s.duration,
            xp_reward: s.xp_reward,
            gold_reward: s.gold_reward,
            is_active: s.is_active
          })))
          .select();
        quests = (inserted && inserted.length > 0) ? inserted : seeds;
      }

      const { data: todayCompletions, error: cErr } = await supabase
        .from('quest_completions')
        .select('quest_id, completed_at')
        .eq('user_id', userId)
        .eq('completion_date', today);

      if (cErr) throw cErr;

      const completedIds = new Set((todayCompletions || []).map(c => c.quest_id));
      const enrichedQuests = (quests || []).map(q => {
        const { duration, cleanDesc } = parseQuestDuration(q);
        return {
          ...q,
          description: cleanDesc,
          duration,
          is_completed_today: completedIds.has(q.id)
        };
      });

      return res.json({ success: true, quests: enrichedQuests });
    }

    // Local fallback store
    const quests = localStore.getQuests(userId);
    const completions = localStore.getCompletions(userId);
    const todayCompletions = completions.filter(c => c.completion_date === today);
    const completedIds = new Set(todayCompletions.map(c => c.quest_id));

    const enrichedQuests = quests.map(q => {
      const { duration, cleanDesc } = parseQuestDuration(q);
      return {
        ...q,
        description: cleanDesc,
        duration,
        is_completed_today: completedIds.has(q.id)
      };
    });

    return res.json({ success: true, quests: enrichedQuests });
  } catch (err) {
    console.error('❌ [getQuests] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch quests.' });
  }
};

/**
 * POST /api/quests
 * Create a new quest
 */
export const createQuest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, category, difficulty, xp_reward, duration } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Quest title is required.' });
    }

    const validCategories = ['Coding', 'Study', 'Fitness', 'Reading', 'Mindfulness', 'Personal'];
    const questCategory = validCategories.includes(category) ? category : 'Coding';

    const validDifficulties = ['Easy', 'Medium', 'Hard', 'Epic'];
    const questDifficulty = validDifficulties.includes(difficulty) ? difficulty : 'Medium';

    // Server-side XP normalization based on difficulty tier
    let xp = Number(xp_reward);
    if (!xp || isNaN(xp) || xp <= 0) {
      switch (questDifficulty) {
        case 'Easy': xp = 60; break;
        case 'Medium': xp = 100; break;
        case 'Hard': xp = 180; break;
        case 'Epic': xp = 250; break;
        default: xp = 100;
      }
    }
    // Cap XP at reasonable max for anti-exploit
    xp = Math.min(500, Math.max(25, xp));

    const cleanDuration = duration ? String(duration).trim() : (
      questDifficulty === 'Easy' ? '15 min' :
      questDifficulty === 'Hard' ? '45 min' :
      questDifficulty === 'Epic' ? '60 min' : '30 min'
    );

    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));

    if (isSupabaseConfigured && !isGuest) {
      const pureDesc = (description || '').replace(/\[duration:\s*[^\]]+\]/gi, '').trim();
      const supabaseDescription = `[duration: ${cleanDuration}] ${pureDesc}`.trim();

      const { data, error } = await supabase
        .from('quests')
        .insert({
          user_id: userId,
          title: title.trim(),
          description: supabaseDescription,
          category: questCategory,
          difficulty: questDifficulty,
          xp_reward: xp
        })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ 
        success: true, 
        quest: { 
          ...data, 
          description: pureDesc,
          duration: cleanDuration,
          is_completed_today: false 
        } 
      });
    }

    const created = localStore.createQuest(userId, {
      title: title.trim(),
      description: (description || '').trim(),
      category: questCategory,
      difficulty: questDifficulty,
      duration: cleanDuration,
      xp_reward: xp
    });

    return res.status(201).json({ success: true, quest: { ...created, is_completed_today: false } });
  } catch (err) {
    console.error('❌ [createQuest] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to create quest.' });
  }
};

/**
 * PUT /api/quests/:id
 * Update an existing quest
 */
export const updateQuest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, category, difficulty, xp_reward, duration } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, error: 'Quest ID is required.' });
    }

    const updates = {};
    if (title && title.trim()) updates.title = title.trim();
    if (category) updates.category = category;
    if (difficulty) updates.difficulty = difficulty;
    if (xp_reward && !isNaN(Number(xp_reward))) {
      updates.xp_reward = Math.min(500, Math.max(25, Number(xp_reward)));
    }
    if (duration) updates.duration = duration;

    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));

    if (isSupabaseConfigured && !isGuest) {
      if (duration || description !== undefined) {
        const cleanDesc = (description !== undefined ? description : '').replace(/\[duration:\s*[^\]]+\]/gi, '').trim();
        const cleanDur = duration ? String(duration).trim() : null;
        if (cleanDur) {
          updates.description = `[duration: ${cleanDur}] ${cleanDesc}`.trim();
        } else if (description !== undefined) {
          updates.description = cleanDesc;
        }
      }

      const supabaseUpdates = { ...updates };
      delete supabaseUpdates.duration;

      const { data, error } = await supabase
        .from('quests')
        .update(supabaseUpdates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      const { duration: parsedDur, cleanDesc } = parseQuestDuration(data);
      return res.json({ 
        success: true, 
        quest: {
          ...data,
          description: cleanDesc,
          duration: parsedDur
        } 
      });
    }

    if (description !== undefined) updates.description = description.trim();

    const updated = localStore.updateQuest(userId, id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Quest not found.' });
    }

    return res.json({ success: true, quest: updated });
  } catch (err) {
    console.error('❌ [updateQuest] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to update quest.' });
  }
};

/**
 * DELETE /api/quests/:id
 * Delete a quest
 */
export const deleteQuest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));

    if (isSupabaseConfigured && !isGuest) {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return res.json({ success: true, message: 'Quest eliminated.' });
    }

    const success = localStore.deleteQuest(userId, id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Quest not found.' });
    }

    return res.json({ success: true, message: 'Quest eliminated.' });
  } catch (err) {
    console.error('❌ [deleteQuest] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to delete quest.' });
  }
};

/**
 * POST /api/quests/:id/complete
 * Atomically complete quest, award validated XP, calculate level up, update streak & character stats
 */
export const completeQuest = async (req, res) => {
  const userId = req.user.id;
  const { id: questId } = req.params;
  const lockKey = `${userId}_${questId}`;

  // Idempotency: Prevent concurrent double clicks
  if (activeCompletions.has(lockKey)) {
    return res.status(429).json({
      success: false,
      error: 'Quest completion is currently processing. Please wait.'
    });
  }

  activeCompletions.add(lockKey);

  try {
    const today = getTodayDateString();

    // 1. Fetch Quest from DB to get authoritative XP and category
    let quest;
    let profile;
    let isAlreadyCompletedToday = false;

    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));

    if (isSupabaseConfigured && !isGuest) {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(questId);
      let qData = null;

      if (isUUID) {
        const { data } = await supabase
          .from('quests')
          .select('*')
          .eq('id', questId)
          .eq('user_id', userId)
          .maybeSingle();
        qData = data;
      }

      if (!qData) {
        // Fallback: search for first available quest for user or create one
        const { data: userQuests } = await supabase
          .from('quests')
          .select('*')
          .eq('user_id', userId)
          .limit(1);

        if (userQuests && userQuests.length > 0) {
          qData = userQuests[0];
        } else {
          const { data: newQ } = await supabase
            .from('quests')
            .insert({
              user_id: userId,
              title: 'Daily Task Completion',
              category: 'Coding',
              difficulty: 'Medium',
              xp_reward: 100
            })
            .select()
            .single();
          qData = newQ;
        }
      }

      quest = qData;

      // Check if already completed today
      const { data: existingComp } = await supabase
        .from('quest_completions')
        .select('id')
        .eq('quest_id', questId)
        .eq('user_id', userId)
        .eq('completion_date', today)
        .maybeSingle();

      if (existingComp) {
        isAlreadyCompletedToday = true;
      }

      // Fetch user profile
      const { data: pData, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (pErr || !pData) {
        activeCompletions.delete(lockKey);
        return res.status(404).json({ success: false, error: 'User profile not found.' });
      }
      profile = unpackProfileMetadata(pData);
    } else {
      const quests = localStore.getQuests(userId);
      quest = quests.find(q => q.id === questId);
      if (!quest) {
        activeCompletions.delete(lockKey);
        return res.status(404).json({ success: false, error: 'Quest not found.' });
      }

      const completions = localStore.getCompletions(userId);
      isAlreadyCompletedToday = completions.some(
        c => c.quest_id === questId && c.completion_date === today
      );

      profile = unpackProfileMetadata(localStore.getProfile(userId));
    }

    // If already completed today, prevent duplicate XP award
    if (isAlreadyCompletedToday) {
      activeCompletions.delete(lockKey);
      return res.status(400).json({
        success: false,
        error: 'Quest has already been conquered today! Return tomorrow for renewed XP.'
      });
    }

    const xpAwarded = Number(quest.xp_reward) || 100;
    const goldEarned = Number(quest.gold_reward) || (xpAwarded * 2) || 120;
    const newGold = (Number(profile.gold) || 0) + goldEarned;

    // 2. Progression calculation: Non-linear leveling with excess XP carryover
    const levelResult = calculateNewLevelAndXP(
      profile.current_level,
      profile.current_xp,
      xpAwarded
    );

    // 3. Streak calculation with streak shield protection
    const streakResult = calculateStreak(
      profile.last_activity_date,
      profile.current_streak,
      profile.longest_streak,
      profile.streak_shields || 0
    );

    // 4. RPG Attributes calculation
    const attrGains = calculateAttributeGains(quest.category, xpAwarded);
    const newIntellect = (profile.intellect || 10) + attrGains.intellect;
    const newStrength = (profile.strength || 10) + attrGains.strength;
    const newDiscipline = (profile.discipline || 10) + attrGains.discipline;
    const newKnowledge = (profile.knowledge || 10) + attrGains.knowledge;
    const newMind = (profile.mind || 10) + (attrGains.mind || 0);

    const profileUpdates = {
      current_xp: levelResult.newXP,
      current_level: levelResult.newLevel,
      current_streak: streakResult.newStreak,
      longest_streak: streakResult.longestStreak,
      last_activity_date: streakResult.lastActivityDate,
      gold: newGold,
      intellect: newIntellect,
      strength: newStrength,
      discipline: newDiscipline,
      knowledge: newKnowledge,
      mind: newMind
    };

    if (streakResult.shieldConsumed) {
      const remainingShields = Math.max(0, (Number(profile.streak_shields) || 0) - 1);
      profile.streak_shields = remainingShields;
      if (isSupabaseConfigured && !isGuest) {
        const packedInv = packProfileInventory(profile.inventory, {
          streak_shields: remainingShields,
          equipped_streak_shield: remainingShields > 0,
          equipped_aura: profile.equipped_aura,
          equipped_completion_effect: profile.equipped_completion_effect,
          equipped_victory_emote: profile.equipped_victory_emote,
          equipped_streak_flame: profile.equipped_streak_flame
        });
        profileUpdates.inventory = packedInv;
      } else {
        profileUpdates.streak_shields = remainingShields;
        profileUpdates.equipped_streak_shield = remainingShields > 0;
      }
    }

    let updatedProfile;

    if (isSupabaseConfigured && !isGuest) {
      // Record completion
      const { error: compErr } = await supabase
        .from('quest_completions')
        .insert({
          user_id: userId,
          quest_id: questId,
          xp_awarded: xpAwarded,
          completion_date: today
        });

      if (compErr) throw compErr;

      // Update profile
      const dbUpdates = sanitizeSupabaseUpdates(profileUpdates);
      const { data: pUpdated, error: uErr } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (uErr) throw uErr;
      updatedProfile = unpackProfileMetadata(pUpdated);
    } else {
      localStore.recordCompletion(userId, questId, xpAwarded);
      updatedProfile = unpackProfileMetadata(localStore.updateProfile(userId, profileUpdates));
    }

    activeCompletions.delete(lockKey);

    return res.json({
      success: true,
      message: 'Quest conquered successfully!',
      xpAwarded,
      attributeGains: attrGains,
      levelUp: {
        didLevelUp: levelResult.didLevelUp,
        oldLevel: profile.current_level,
        newLevel: levelResult.newLevel,
        levelsGained: levelResult.levelsGained
      },
      streak: {
        currentStreak: streakResult.newStreak,
        longestStreak: streakResult.longestStreak,
        streakExtended: streakResult.streakExtended,
        streakProtected: Boolean(streakResult.streakProtected),
        shieldConsumed: Boolean(streakResult.shieldConsumed)
      },
      profile: {
        ...updatedProfile,
        requiredXP: levelResult.requiredXP
      },
      questId
    });
  } catch (err) {
    activeCompletions.delete(lockKey);
    console.error('❌ [completeQuest] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to complete quest.' });
  }
};

/**
 * POST /api/quests/generate-daily
 * Generates fresh daily quests covering Intellect, Strength, Knowledge, Mind
 */
export const generateDailyQuests = async (req, res) => {
  try {
    const userId = req.user.id;
    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));
    const fresh = getRandomDailyQuests(userId, 5);

    if (isSupabaseConfigured && !isGuest) {
      const { data: inserted, error: iErr } = await supabase
        .from('quests')
        .insert(fresh.map(s => ({
          id: s.id,
          user_id: userId,
          title: s.title,
          description: s.description,
          category: s.category,
          difficulty: s.difficulty,
          duration: s.duration,
          xp_reward: s.xp_reward,
          gold_reward: s.gold_reward,
          is_active: s.is_active
        })))
        .select();

      if (iErr) throw iErr;
      return res.json({ success: true, quests: inserted || fresh });
    } else {
      fresh.forEach(q => localStore.createQuest(userId, q));
      return res.json({ success: true, quests: fresh });
    }
  } catch (err) {
    console.error('❌ [generateDailyQuests] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to roll daily quests.' });
  }
};
