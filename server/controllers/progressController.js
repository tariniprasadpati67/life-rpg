import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { localStore } from '../data/store.js';
import { getRequiredXP, getTodayDateString } from '../utils/progression.js';
import { getItemById, getItemByName } from '../data/cosmeticsCatalog.js';
import { 
  unpackProfileMetadata, 
  packProfileInventory, 
  sanitizeSupabaseUpdates 
} from '../utils/profileMetadata.js';

/**
 * GET /api/progress/profile
 * Returns user profile, required XP, streak data, and last 7 days completion history
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));
    let profile;
    let completions = [];

    if (isSupabaseConfigured && !isGuest) {
      const { data: pData, error: pErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (pErr && pErr.code === 'PGRST116') {
        // Profile doesn't exist yet, create one
        const { data: createdProfile, error: cErr } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: req.user.user_metadata?.username || `user_${userId.slice(0, 6)}`,
            display_name: req.user.user_metadata?.display_name || 'Cyber Adventurer',
            gold: 850,
            diamonds: 50
          })
          .select()
          .single();

        if (cErr) throw cErr;
        profile = createdProfile;
      } else if (pErr) {
        throw pErr;
      } else {
        profile = pData;
      }

      // Fetch completions for the past 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
      const { data: compData } = await supabase
        .from('quest_completions')
        .select('*, quests(title, category)')
        .eq('user_id', userId)
        .gte('completion_date', thirtyDaysAgo)
        .order('completed_at', { ascending: false });

      completions = compData || [];
    } else {
      profile = localStore.getProfile(userId);
      completions = localStore.getCompletions(userId);
    }

    profile = unpackProfileMetadata(profile);
    const requiredXP = getRequiredXP(profile.current_level);

    // Calculate weekly calendar active days (Monday - Sunday of the current week)
    const now = new Date();
    // Monday as start of week (0=Mon, 6=Sun)
    const dayOfWeek = (now.getDay() + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);

    const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const activeDates = new Set(completions.map(c => c.completion_date));

    const weeklyCalendar = weekDays.map((dayName, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const dateStr = getTodayDateString(d);
      const isToday = idx === dayOfWeek;
      const isPast = idx < dayOfWeek;
      const isFuture = idx > dayOfWeek;
      const isCompleted = activeDates.has(dateStr);
      const isOnFire = isToday && isCompleted;

      return {
        day: dayName,
        date: dateStr,
        isToday,
        isPast,
        isFuture,
        isCompleted,
        isOnFire
      };
    });

    return res.json({
      success: true,
      profile: {
        ...profile,
        requiredXP
      },
      weeklyCalendar,
      recentCompletions: completions.slice(0, 10)
    });
  } catch (err) {
    console.error('❌ [getProfile] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch profile.' });
  }
};

/**
 * PUT /api/progress/profile
 * Update user avatar, display name, sound settings
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      display_name, 
      avatar_url, 
      sound_enabled, 
      equipped_frame, 
      equipped_theme, 
      equipped_badge, 
      equipped_aura,
      equipped_completion_effect,
      equipped_victory_emote,
      equipped_streak_flame,
      equipped_streak_shield,
      streak_shields,
      gold, 
      diamonds, 
      inventory 
    } = req.body;
    const updates = {};

    if (display_name !== undefined) updates.display_name = display_name.trim();
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (sound_enabled !== undefined) updates.sound_enabled = Boolean(sound_enabled);
    if (equipped_frame !== undefined) updates.equipped_frame = equipped_frame;
    if (equipped_theme !== undefined) updates.equipped_theme = equipped_theme;
    if (equipped_badge !== undefined) updates.equipped_badge = equipped_badge;
    if (gold !== undefined) updates.gold = Number(gold);
    if (diamonds !== undefined) updates.diamonds = Number(diamonds);

    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));
    let currentProfile;
    if (isSupabaseConfigured && !isGuest) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      currentProfile = unpackProfileMetadata(data);
    } else {
      currentProfile = unpackProfileMetadata(localStore.getProfile(userId));
    }

    const nextInventory = inventory !== undefined ? inventory : currentProfile.inventory;
    const metaUpdates = {
      streak_shields: streak_shields !== undefined ? Number(streak_shields) : currentProfile.streak_shields,
      equipped_streak_shield: equipped_streak_shield !== undefined ? Boolean(equipped_streak_shield) : currentProfile.equipped_streak_shield,
      equipped_aura: equipped_aura !== undefined ? equipped_aura : currentProfile.equipped_aura,
      equipped_completion_effect: equipped_completion_effect !== undefined ? equipped_completion_effect : currentProfile.equipped_completion_effect,
      equipped_victory_emote: equipped_victory_emote !== undefined ? equipped_victory_emote : currentProfile.equipped_victory_emote,
      equipped_streak_flame: equipped_streak_flame !== undefined ? equipped_streak_flame : currentProfile.equipped_streak_flame
    };

    if (isSupabaseConfigured && !isGuest) {
      const packedInv = packProfileInventory(nextInventory, metaUpdates);
      const dbUpdates = sanitizeSupabaseUpdates({
        ...updates,
        inventory: packedInv
      });
      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      const unpacked = unpackProfileMetadata(data);
      return res.json({ success: true, profile: { ...unpacked, requiredXP: getRequiredXP(unpacked.current_level) } });
    }

    const localUpdates = { ...updates, ...metaUpdates, inventory: nextInventory };
    const updated = localStore.updateProfile(userId, localUpdates);
    const unpacked = unpackProfileMetadata(updated);
    return res.json({ success: true, profile: { ...unpacked, requiredXP: getRequiredXP(unpacked.current_level) } });
  } catch (err) {
    console.error('❌ [updateProfile] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to update profile.' });
  }
};

/**
 * POST /api/progress/shop/buy
 * Authoritatively buy an item from the shop with currency & duplicate checks
 */
export const buyShopItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, error: 'Item ID is required.' });
    }

    const item = getItemById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found in catalog.' });
    }

    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));
    let profile;
    if (isSupabaseConfigured && !isGuest) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      profile = unpackProfileMetadata(data);
    } else {
      profile = unpackProfileMetadata(localStore.getProfile(userId));
    }

    const cost = item.price || 0;
    const currency = item.currency || 'gold';
    const currentGold = Number(profile.gold ?? 850);
    const currentDiamonds = Number(profile.diamonds ?? 50);
    const currentInventory = Array.isArray(profile.inventory) ? profile.inventory : ['frame-fire', 'badge-bronze'];
    const currentShields = Number(profile.streak_shields ?? 0);

    // Validate funds
    if (currency === 'gold' && currentGold < cost) {
      return res.status(400).json({ success: false, error: `Insufficient Gold. You need ${cost} Gold.` });
    }
    if (currency === 'diamonds' && currentDiamonds < cost) {
      return res.status(400).json({ success: false, error: `Insufficient Diamonds. You need ${cost} Diamonds.` });
    }

    const updates = {};
    if (currency === 'gold') {
      updates.gold = Math.max(0, currentGold - cost);
    } else {
      updates.diamonds = Math.max(0, currentDiamonds - cost);
    }

    let nextShields = currentShields;
    let nextEquippedShield = profile.equipped_streak_shield;
    let nextInventory = currentInventory;

    if (item.isConsumable || item.type === 'streak_shield') {
      if (currentShields >= (item.maxStack || 5)) {
        return res.status(400).json({ success: false, error: `Streak Shields max capacity (${item.maxStack || 5}) reached.` });
      }
      nextShields = currentShields + 1;
      nextEquippedShield = true;
    } else {
      if (currentInventory.includes(item.id)) {
        return res.status(400).json({ success: false, error: 'You already own this item!' });
      }
      nextInventory = [...currentInventory, item.id];
    }

    let updatedProfile;
    if (isSupabaseConfigured && !isGuest) {
      const packedInv = packProfileInventory(nextInventory, {
        streak_shields: nextShields,
        equipped_streak_shield: nextEquippedShield,
        equipped_aura: profile.equipped_aura,
        equipped_completion_effect: profile.equipped_completion_effect,
        equipped_victory_emote: profile.equipped_victory_emote,
        equipped_streak_flame: profile.equipped_streak_flame
      });

      const dbUpdates = sanitizeSupabaseUpdates({
        ...updates,
        inventory: packedInv
      });

      const { data, error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId).select().single();
      if (error) throw error;
      updatedProfile = unpackProfileMetadata(data);
    } else {
      updatedProfile = unpackProfileMetadata(localStore.updateProfile(userId, {
        ...updates,
        inventory: nextInventory,
        streak_shields: nextShields,
        equipped_streak_shield: nextEquippedShield
      }));
    }

    return res.json({
      success: true,
      message: `Successfully acquired ${item.name}!`,
      item,
      profile: {
        ...updatedProfile,
        requiredXP: getRequiredXP(updatedProfile.current_level)
      }
    });
  } catch (err) {
    console.error('❌ [buyShopItem] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to purchase item.' });
  }
};

/**
 * POST /api/progress/shop/equip
 * Authoritatively equip an item with ownership validation
 */
export const equipCosmetic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, itemName, type } = req.body;

    const item = itemId ? getItemById(itemId) : getItemByName(itemName);
    if (!item && type !== 'streak_shield') {
      return res.status(404).json({ success: false, error: 'Item not found in catalog.' });
    }

    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));
    let profile;
    if (isSupabaseConfigured && !isGuest) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      profile = unpackProfileMetadata(data);
    } else {
      profile = unpackProfileMetadata(localStore.getProfile(userId));
    }

    const currentInventory = Array.isArray(profile.inventory) ? profile.inventory : ['frame-fire', 'badge-bronze'];
    const currentShields = Number(profile.streak_shields ?? 0);

    // Validate ownership
    if (item?.isConsumable || type === 'streak_shield') {
      if (currentShields <= 0) {
        return res.status(403).json({ success: false, error: 'You have no Streak Shields to equip! Buy one in Shop.' });
      }
    } else if (!item?.isStarter) {
      if (!currentInventory.includes(item.id)) {
        return res.status(403).json({ success: false, error: `You do not own ${item.name}! Purchase it first.` });
      }
    }

    const itemType = item ? item.type : type;
    const itemNameVal = item ? item.name : 'Aegis Streak Shield';

    const updates = {};
    const metaUpdates = {
      streak_shields: profile.streak_shields,
      equipped_streak_shield: profile.equipped_streak_shield,
      equipped_aura: profile.equipped_aura,
      equipped_completion_effect: profile.equipped_completion_effect,
      equipped_victory_emote: profile.equipped_victory_emote,
      equipped_streak_flame: profile.equipped_streak_flame
    };

    if (itemType === 'frame') updates.equipped_frame = itemNameVal;
    else if (itemType === 'theme') updates.equipped_theme = itemNameVal;
    else if (itemType === 'badge') updates.equipped_badge = itemNameVal;
    else if (itemType === 'aura') metaUpdates.equipped_aura = itemNameVal;
    else if (itemType === 'completion_effect') metaUpdates.equipped_completion_effect = itemNameVal;
    else if (itemType === 'victory_emote') metaUpdates.equipped_victory_emote = itemNameVal;
    else if (itemType === 'streak_flame') metaUpdates.equipped_streak_flame = itemNameVal;
    else if (itemType === 'streak_shield') {
      metaUpdates.equipped_streak_shield = true;
      metaUpdates.equipped_aura = itemNameVal;
    }

    let updatedProfile;
    if (isSupabaseConfigured && !isGuest) {
      const packedInv = packProfileInventory(currentInventory, metaUpdates);
      const dbUpdates = sanitizeSupabaseUpdates({
        ...updates,
        inventory: packedInv
      });
      const { data, error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId).select().single();
      if (error) throw error;
      updatedProfile = unpackProfileMetadata(data);
    } else {
      updatedProfile = unpackProfileMetadata(localStore.updateProfile(userId, {
        ...updates,
        ...metaUpdates
      }));
    }

    return res.json({
      success: true,
      message: `Equipped ${itemNameVal}!`,
      profile: {
        ...updatedProfile,
        requiredXP: getRequiredXP(updatedProfile.current_level)
      }
    });
  } catch (err) {
    console.error('❌ [equipCosmetic] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to equip item.' });
  }
};

/**
 * POST /api/progress/shop/unequip
 * Authoritatively unequip an item category
 */
export const unequipCosmetic = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.body;

    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));
    let profile;
    if (isSupabaseConfigured && !isGuest) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      profile = unpackProfileMetadata(data);
    } else {
      profile = unpackProfileMetadata(localStore.getProfile(userId));
    }

    const updates = {};
    const metaUpdates = {
      streak_shields: profile.streak_shields,
      equipped_streak_shield: profile.equipped_streak_shield,
      equipped_aura: profile.equipped_aura,
      equipped_completion_effect: profile.equipped_completion_effect,
      equipped_victory_emote: profile.equipped_victory_emote,
      equipped_streak_flame: profile.equipped_streak_flame
    };

    if (type === 'frame') updates.equipped_frame = 'Fire Frame';
    else if (type === 'badge') updates.equipped_badge = null;
    else if (type === 'theme') updates.equipped_theme = null;
    else if (type === 'aura') metaUpdates.equipped_aura = null;
    else if (type === 'completion_effect') metaUpdates.equipped_completion_effect = null;
    else if (type === 'victory_emote') metaUpdates.equipped_victory_emote = null;
    else if (type === 'streak_flame') metaUpdates.equipped_streak_flame = null;
    else if (type === 'streak_shield') {
      metaUpdates.equipped_streak_shield = false;
      if (profile.equipped_aura && (profile.equipped_aura.toLowerCase().includes('shield') || profile.equipped_aura.toLowerCase().includes('aegis'))) {
        metaUpdates.equipped_aura = null;
      }
    }

    let updatedProfile;
    if (isSupabaseConfigured && !isGuest) {
      const packedInv = packProfileInventory(profile.inventory, metaUpdates);
      const dbUpdates = sanitizeSupabaseUpdates({
        ...updates,
        inventory: packedInv
      });
      const { data, error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId).select().single();
      if (error) throw error;
      updatedProfile = unpackProfileMetadata(data);
    } else {
      updatedProfile = unpackProfileMetadata(localStore.updateProfile(userId, {
        ...updates,
        ...metaUpdates
      }));
    }

    return res.json({
      success: true,
      message: `Unequipped ${type}.`,
      profile: {
        ...updatedProfile,
        requiredXP: getRequiredXP(updatedProfile.current_level)
      }
    });
  } catch (err) {
    console.error('❌ [unequipCosmetic] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to unequip item.' });
  }
};

// High-performance In-Memory Cache for Leaderboard rankings (instant <5ms responses)
const leaderboardCache = {
  Weekly: { data: null, timestamp: 0 },
  Monthly: { data: null, timestamp: 0 }
};
const LEADERBOARD_CACHE_TTL = 30 * 1000; // 30 seconds fresh cache

/**
 * GET /api/progress/leaderboard
 * Returns REAL ranked leaderboard of registered users from database
 * Query param: ?period=Weekly | Monthly&force=true
 */
export const getLeaderboard = async (req, res) => {
  const period = req.query.period === 'Monthly' ? 'Monthly' : 'Weekly';
  const currentUserId = req.user?.id || null;
  const forceRefresh = req.query.force === 'true';

  // 1. Instant Cache Hit: Serve fresh cached leaderboard in <5ms
  const cached = leaderboardCache[period];
  if (!forceRefresh && cached?.data && cached.data.length >= 2 && (Date.now() - cached.timestamp < LEADERBOARD_CACHE_TTL)) {
    const personalized = cached.data.map(p => ({
      ...p,
      isYou: p.id === currentUserId
    }));
    return res.json({
      success: true,
      period,
      rankings: personalized,
      totalAdventurers: personalized.length,
      cached: true
    });
  }

  try {
    if (isSupabaseConfigured && supabase) {
      const now = new Date();
      const daysBack = period === 'Weekly' ? 7 : 30;
      const startDate = new Date(now.getTime() - daysBack * 86400000).toISOString().split('T')[0];

      // Run queries with generous 12s timeout for cold starts
      const fetchWithTimeout = (promise, ms = 12000) =>
        Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase network timeout')), ms))
        ]);

      const [profilesRes, completionsRes, authUsersRes] = await fetchWithTimeout(
        Promise.all([
          Promise.resolve(
            supabase
              .from('profiles')
              .select('id, username, display_name, avatar_url, current_xp, current_level, current_streak, created_at')
          ).catch(() => ({ data: [] })),
          Promise.resolve(
            supabase
              .from('quest_completions')
              .select('user_id, xp_awarded')
              .gte('completion_date', startDate)
          ).catch(() => ({ data: [] })),
          Promise.resolve(supabase.auth.admin.listUsers()).catch(() => ({ data: { users: [] } }))
        ])
      );

      const dbProfiles = profilesRes?.data || [];
      const authUsers = authUsersRes?.data?.users || [];
      const completions = completionsRes?.data || [];

      // Map profiles by ID
      const profileMap = new Map();
      dbProfiles.forEach(p => {
        if (p?.id) profileMap.set(p.id, p);
      });

      // Merge any registered auth users who don't have a profile row yet
      for (const u of authUsers) {
        if (!profileMap.has(u.id)) {
          const uName = u.user_metadata?.username || u.email?.split('@')[0] || 'Adventurer';
          const dName = u.user_metadata?.display_name || uName;
          const newProf = {
            id: u.id,
            username: uName,
            display_name: dName,
            avatar_url: null,
            current_xp: 0,
            current_level: 1,
            current_streak: 0,
            created_at: u.created_at
          };
          profileMap.set(u.id, newProf);

          // Silently upsert to database
          supabase.from('profiles').insert(newProf).catch(() => {});
        }
      }

      // Strictly filter out any automated test or fake accounts
      const profileList = Array.from(profileMap.values()).filter(p => {
        const u = (p.username || '').toLowerCase();
        const d = (p.display_name || '').toLowerCase();
        if (u.startsWith('test') || d.startsWith('test')) return false;
        if (u.startsWith('warrior_') || u.startsWith('heroine_')) return false;
        if (u.startsWith('demo-') || u === 'adventurer_demo-') return false;
        return true;
      });

      // Aggregate XP per user for the period
      const periodXpMap = {};
      completions.forEach(c => {
        periodXpMap[c.user_id] = (periodXpMap[c.user_id] || 0) + (c.xp_awarded || 0);
      });

      // Map profiles with their real scores
      const rankedPlayers = profileList.map(p => {
        const periodXp = periodXpMap[p.id];
        const displayXp = periodXp !== undefined ? periodXp : (p.current_xp || 0);

        return {
          id: p.id,
          name: p.display_name || p.username || 'Adventurer',
          username: p.username,
          level: p.current_level || 1,
          xp: displayXp,
          totalXp: p.current_xp || 0,
          streak: p.current_streak || 0,
          avatarUrl: p.avatar_url,
          isYou: p.id === currentUserId
        };
      });

      // Sort descending by XP, then level, then totalXp
      rankedPlayers.sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp;
        if ((b.level || 1) !== (a.level || 1)) return (b.level || 1) - (a.level || 1);
        return (b.totalXp || 0) - (a.totalXp || 0);
      });

      // Assign ranks and medals
      const finalRankings = rankedPlayers.map((player, idx) => {
        const rank = idx + 1;
        let medal = `${rank}`;
        if (rank === 1) medal = '👑';
        else if (rank === 2) medal = '🥈';
        else if (rank === 3) medal = '🥉';

        return {
          ...player,
          rank,
          medal
        };
      });

      // Save to memory cache for subsequent instant loads
      leaderboardCache[period] = {
        data: finalRankings,
        timestamp: Date.now()
      };

      return res.json({
        success: true,
        period,
        rankings: finalRankings,
        totalAdventurers: finalRankings.length
      });
    }

    // Local fallback store: only real users
    const allProfiles = localStore.getAllProfiles ? localStore.getAllProfiles() : [localStore.getProfile(currentUserId || 'demo-user-123')];
    const finalRankings = (allProfiles || []).map((p, idx) => ({
      id: p.id || currentUserId,
      name: p.display_name || p.username || 'Adventurer',
      username: p.username,
      level: p.current_level || 1,
      xp: p.current_xp || 0,
      totalXp: p.current_xp || 0,
      streak: p.current_streak || 0,
      isYou: p.id === currentUserId,
      rank: idx + 1,
      medal: idx === 0 ? '👑' : `${idx + 1}`
    }));

    return res.json({
      success: true,
      period,
      rankings: finalRankings,
      totalAdventurers: finalRankings.length
    });
  } catch (err) {
    console.warn('⚠️ [getLeaderboard] Supabase slow or offline, using fallback:', err.message);
    
    // If we have stale cache, serve it immediately
    if (cached?.data) {
      const personalized = cached.data.map(p => ({
        ...p,
        isYou: p.id === currentUserId
      }));
      return res.json({
        success: true,
        period,
        rankings: personalized,
        totalAdventurers: personalized.length,
        fallback: true
      });
    }

    // Local store fallback
    const allProfiles = localStore.getAllProfiles ? localStore.getAllProfiles() : [localStore.getProfile(currentUserId || 'demo-user-123')];
    const fallbackRankings = (allProfiles || []).map((p, idx) => ({
      id: p.id || currentUserId,
      name: p.display_name || p.username || 'Adventurer',
      username: p.username,
      level: p.current_level || 1,
      xp: p.current_xp || 0,
      totalXp: p.current_xp || 0,
      streak: p.current_streak || 0,
      isYou: p.id === currentUserId,
      rank: idx + 1,
      medal: idx === 0 ? '👑' : `${idx + 1}`
    }));

    return res.json({
      success: true,
      period,
      rankings: fallbackRankings,
      totalAdventurers: fallbackRankings.length,
      fallback: true
    });
  }
};

/**
 * POST /api/progress/convert-currency
 * Authoritatively convert Gold into Diamonds
 */
export const convertCurrency = async (req, res) => {
  try {
    const userId = req.user.id;
    const { goldAmount, diamondsAmount } = req.body;

    const goldToSpend = Number(goldAmount);
    const diamondsToReceive = Number(diamondsAmount);

    if (!goldToSpend || goldToSpend <= 0 || !diamondsToReceive || diamondsToReceive <= 0) {
      return res.status(400).json({ success: false, error: 'Valid gold and diamond amounts are required.' });
    }

    const isGuest = Boolean(req.user?.isGuest || userId === 'demo-user-123' || userId?.startsWith('demo-'));
    let profile;
    if (isSupabaseConfigured && !isGuest) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) throw error;
      profile = unpackProfileMetadata(data);
    } else {
      profile = unpackProfileMetadata(localStore.getProfile(userId));
    }

    const currentGold = Number(profile.gold ?? 0);
    const currentDiamonds = Number(profile.diamonds ?? 0);

    if (currentGold < goldToSpend) {
      return res.status(400).json({
        success: false,
        error: `Insufficient Gold! You have ${currentGold.toLocaleString()} Gold, but need ${goldToSpend.toLocaleString()} Gold.`
      });
    }

    const newGold = Math.max(0, currentGold - goldToSpend);
    const newDiamonds = currentDiamonds + diamondsToReceive;

    let updatedProfile;
    if (isSupabaseConfigured && !isGuest) {
      const dbUpdates = sanitizeSupabaseUpdates({
        gold: newGold,
        diamonds: newDiamonds
      });

      const { data, error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId).select().single();
      if (error) throw error;
      updatedProfile = unpackProfileMetadata(data);
    } else {
      updatedProfile = unpackProfileMetadata(localStore.updateProfile(userId, {
        gold: newGold,
        diamonds: newDiamonds
      }));
    }

    return res.json({
      success: true,
      message: `Successfully converted ${goldToSpend.toLocaleString()} Gold into ${diamondsToReceive.toLocaleString()} Diamonds!`,
      profile: {
        ...updatedProfile,
        gold: newGold,
        diamonds: newDiamonds,
        requiredXP: getRequiredXP(updatedProfile.current_level)
      }
    });
  } catch (err) {
    console.error('❌ [convertCurrency] Error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Failed to convert currency.' });
  }
};

