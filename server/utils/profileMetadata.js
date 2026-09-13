/**
 * Profile Metadata Helper
 * Safely packs & unpacks cosmetics/shields into Supabase inventory array
 * avoiding missing column errors (PGRST204) while providing full persistence.
 */

export const META_PREFIX = 'meta:';

export const unpackProfileMetadata = (rawProfile) => {
  if (!rawProfile) return rawProfile;
  const inventory = Array.isArray(rawProfile.inventory) ? rawProfile.inventory : ['frame-fire', 'badge-bronze'];
  
  let streak_shields = rawProfile.streak_shields !== undefined ? Number(rawProfile.streak_shields) : 0;
  let equipped_streak_shield = rawProfile.equipped_streak_shield !== undefined ? Boolean(rawProfile.equipped_streak_shield) : false;
  let equipped_aura = rawProfile.equipped_aura || null;
  let equipped_completion_effect = rawProfile.equipped_completion_effect || null;
  let equipped_victory_emote = rawProfile.equipped_victory_emote || null;
  let equipped_streak_flame = rawProfile.equipped_streak_flame || null;

  const cleanInventory = [];

  for (const item of inventory) {
    if (typeof item === 'string' && item.startsWith(META_PREFIX)) {
      const rest = item.slice(META_PREFIX.length);
      const firstColon = rest.indexOf(':');
      if (firstColon !== -1) {
        const key = rest.slice(0, firstColon);
        const val = rest.slice(firstColon + 1);
        if (key === 'shields') streak_shields = Math.max(0, Number(val) || 0);
        else if (key === 'equipped_shield') equipped_streak_shield = (val === 'true');
        else if (key === 'equipped_aura') equipped_aura = val || null;
        else if (key === 'equipped_completion_effect') equipped_completion_effect = val || null;
        else if (key === 'equipped_victory_emote') equipped_victory_emote = val || null;
        else if (key === 'equipped_streak_flame') equipped_streak_flame = val || null;
      }
    } else {
      cleanInventory.push(item);
    }
  }

  // If user has shields, default equipped_streak_shield to true if not explicitly false
  if (streak_shields > 0 && rawProfile.equipped_streak_shield === undefined && !inventory.some(i => typeof i === 'string' && i.startsWith('meta:equipped_shield:'))) {
    equipped_streak_shield = true;
  }

  return {
    ...rawProfile,
    streak_shields,
    equipped_streak_shield: equipped_streak_shield && streak_shields > 0,
    equipped_aura,
    equipped_completion_effect,
    equipped_victory_emote,
    equipped_streak_flame,
    inventory: cleanInventory
  };
};

export const packProfileInventory = (cleanInventory, meta = {}) => {
  const inv = (cleanInventory || []).filter(item => typeof item === 'string' && !item.startsWith(META_PREFIX));
  
  if (meta.streak_shields !== undefined) {
    inv.push(`${META_PREFIX}shields:${Math.max(0, Number(meta.streak_shields))}`);
  }
  if (meta.equipped_streak_shield !== undefined) {
    inv.push(`${META_PREFIX}equipped_shield:${Boolean(meta.equipped_streak_shield)}`);
  }
  if (meta.equipped_aura !== undefined) {
    if (meta.equipped_aura) inv.push(`${META_PREFIX}equipped_aura:${meta.equipped_aura}`);
  }
  if (meta.equipped_completion_effect !== undefined) {
    if (meta.equipped_completion_effect) inv.push(`${META_PREFIX}equipped_completion_effect:${meta.equipped_completion_effect}`);
  }
  if (meta.equipped_victory_emote !== undefined) {
    if (meta.equipped_victory_emote) inv.push(`${META_PREFIX}equipped_victory_emote:${meta.equipped_victory_emote}`);
  }
  if (meta.equipped_streak_flame !== undefined) {
    if (meta.equipped_streak_flame) inv.push(`${META_PREFIX}equipped_streak_flame:${meta.equipped_streak_flame}`);
  }

  return inv;
};

// Known valid Supabase profiles table columns
const VALID_SUPABASE_COLUMNS = new Set([
  'id', 'username', 'display_name', 'avatar_url',
  'current_xp', 'current_level', 'current_streak', 'longest_streak',
  'last_activity_date', 'intellect', 'strength', 'discipline',
  'knowledge', 'mind', 'gold', 'diamonds',
  'equipped_frame', 'equipped_theme', 'equipped_badge',
  'inventory', 'sound_enabled', 'created_at', 'updated_at'
]);

export const sanitizeSupabaseUpdates = (updates) => {
  const clean = {};
  for (const [key, val] of Object.entries(updates)) {
    if (VALID_SUPABASE_COLUMNS.has(key)) {
      clean[key] = val;
    }
  }
  return clean;
};
