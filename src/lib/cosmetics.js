// Centralized cosmetics styling helper and catalogs for Life RPG

export const AVATAR_FRAMES_CATALOG = [
  {
    id: 'frame-fire',
    name: 'Fire Frame',
    type: 'frame',
    category: 'frame',
    price: 500,
    currency: 'gold',
    rarity: 'Common',
    lore: 'Obsidian chassis with flame-forged horns and breathing ember channel.',
    icon: '🔥'
  },
  {
    id: 'frame-galaxy',
    name: 'Galaxy Frame',
    type: 'frame',
    category: 'frame',
    price: 800,
    currency: 'gold',
    rarity: 'Rare',
    lore: 'Astral chrome with compass star, orbital rings & cosmic starlight.',
    icon: '🌌'
  },
  {
    id: 'frame-cyber',
    name: 'Cyber Frame',
    type: 'frame',
    category: 'frame',
    price: 1000,
    currency: 'diamonds',
    rarity: 'Epic',
    lore: 'Neo-HUD octagonal armor with telemetry calipers & energy scanning.',
    icon: '⚡'
  },
  {
    id: 'frame-nature',
    name: 'Nature Frame',
    type: 'frame',
    category: 'frame',
    price: 600,
    currency: 'gold',
    rarity: 'Rare',
    lore: 'Elderwood bark with Celtic golden leaf clasps & drifting sylvan pollen.',
    icon: '🌿'
  },
  {
    id: 'frame-royal',
    name: 'Royal Frame',
    type: 'frame',
    category: 'frame',
    price: 1200,
    currency: 'gold',
    rarity: 'Legendary',
    lore: 'Imperial 24K gold with 3D sovereign crown crest & ruby gems.',
    icon: '👑'
  }
];

export const getFrameStyle = (frameName) => {
  const name = (frameName || 'Fire Frame').toLowerCase();
  
  if (name.includes('nature')) {
    return {
      id: 'frame-nature',
      name: 'Nature Frame',
      gradient: 'from-emerald-400 via-green-500 to-lime-400',
      glow: 'shadow-[0_0_28px_rgba(16,185,129,0.65)]',
      border: 'border-emerald-500',
      accentColor: '#10b981',
      icon: '🌿'
    };
  }
  
  if (name.includes('galaxy')) {
    return {
      id: 'frame-galaxy',
      name: 'Galaxy Frame',
      gradient: 'from-purple-600 via-indigo-500 to-cyan-400',
      glow: 'shadow-[0_0_28px_rgba(147,51,234,0.65)]',
      border: 'border-purple-500',
      accentColor: '#9333ea',
      icon: '🌌'
    };
  }
  
  if (name.includes('cyber')) {
    return {
      id: 'frame-cyber',
      name: 'Cyber Frame',
      gradient: 'from-cyan-400 via-blue-500 to-teal-400',
      glow: 'shadow-[0_0_28px_rgba(56,189,248,0.65)]',
      border: 'border-cyan-400',
      accentColor: '#38bdf8',
      icon: '⚡'
    };
  }
  
  if (name.includes('royal')) {
    return {
      id: 'frame-royal',
      name: 'Royal Frame',
      gradient: 'from-amber-300 via-yellow-400 to-amber-600',
      glow: 'shadow-[0_0_28px_rgba(234,179,8,0.7)]',
      border: 'border-yellow-400',
      accentColor: '#eab308',
      icon: '👑'
    };
  }

  // Default to Fire Frame
  return {
    id: 'frame-fire',
    name: 'Fire Frame',
    gradient: 'from-amber-500 via-yellow-400 to-red-500',
    glow: 'shadow-[0_0_28px_rgba(245,158,11,0.65)]',
    border: 'border-amber-500',
    accentColor: '#f59e0b',
    icon: '🔥'
  };
};

export const BADGE_CATALOG = [
  {
    id: 'badge-novice',
    name: 'Novice Adventurer',
    type: 'badge',
    category: 'badge',
    price: 0,
    currency: 'gold',
    tier: 'Bronze Rank',
    rarity: 'Common',
    iconUrl: '/badges/badge-novice.png',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    lore: 'Ironwood and bronze shield with warm amber crystal core.'
  },
  {
    id: 'badge-silver',
    name: 'Silver Vanguard',
    type: 'badge',
    category: 'badge',
    price: 250,
    currency: 'gold',
    tier: 'Silver Rank',
    rarity: 'Rare',
    iconUrl: '/badges/badge-silver.png',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    lore: 'Polished steel shield with silver wings and amethyst gem.'
  },
  {
    id: 'badge-7day',
    name: 'Streak Master',
    type: 'badge',
    category: 'badge',
    price: 500,
    currency: 'gold',
    tier: 'Warrior Rank',
    rarity: 'Epic',
    iconUrl: '/badges/badge-warrior.png',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    lore: 'Burnished copper shield with blazing wings and ruby core.'
  },
  {
    id: 'badge-cyber',
    name: 'XP Hunter',
    type: 'badge',
    category: 'badge',
    price: 800,
    currency: 'diamonds',
    tier: 'Platinum Rank',
    rarity: 'Epic',
    iconUrl: '/badges/badge-cyber.png',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    lore: 'Chrome platinum shield with radiant wings and sapphire core.'
  },
  {
    id: 'badge-master',
    name: 'Weekly Champion',
    type: 'badge',
    category: 'badge',
    price: 1200,
    currency: 'gold',
    tier: 'Gold Rank',
    rarity: 'Legendary',
    iconUrl: '/badges/badge-champion.png',
    glowColor: 'rgba(234, 179, 8, 0.55)',
    lore: '24K imperial gold shield with twin crossed swords and sunstone.'
  },
  {
    id: 'badge-mythic',
    name: 'Mythic Sovereign',
    type: 'badge',
    category: 'badge',
    price: 2000,
    currency: 'diamonds',
    tier: 'Mythic Rank',
    rarity: 'Mythic',
    iconUrl: '/badges/badge-mythic.png',
    glowColor: 'rgba(192, 132, 252, 0.6)',
    lore: 'Celestial radiant crest with twin enchanted blades and cosmic crystal.'
  }
];

export const getBadgeStyle = (badgeName) => {
  const name = (badgeName || 'Novice Adventurer').toLowerCase();
  
  if (name.includes('silver') || name.includes('vanguard')) {
    return BADGE_CATALOG[1];
  }
  if (name.includes('7 day') || name.includes('warrior') || name.includes('streak')) {
    return BADGE_CATALOG[2];
  }
  if (name.includes('cyber') || name.includes('slayer') || name.includes('hunter')) {
    return BADGE_CATALOG[3];
  }
  if (name.includes('champion') || name.includes('master') || name.includes('weekly')) {
    return BADGE_CATALOG[4];
  }
  if (name.includes('mythic') || name.includes('sovereign')) {
    return BADGE_CATALOG[5];
  }

  // Default to Novice Adventurer
  return BADGE_CATALOG[0];
};

/* =========================================================================
   SPECIAL ITEMS (5 Core Items)
   ========================================================================= */
export const SPECIAL_ITEMS_CATALOG = [
  // 1. AEGIS STREAK SHIELD ORBIT
  {
    id: 'item-streak-shield',
    name: 'Aegis Streak Shield Orbit',
    type: 'streak_shield',
    orbitType: 'shield',
    category: 'orbit',
    price: 300,
    currency: 'gold',
    icon: '🛡️',
    rarity: 'Epic',
    lore: 'Ancient celestial Aegis shield revolving around your hero avatar while guarding your active streak.',
    description: 'A glowing 3D mystic shield orbiting your avatar that also automatically protects 1 missed streak day. Stacks up to 5.',
    isConsumable: true,
    maxStack: 5
  },

  // 2. ASTRAL VOID COSMIC ORBIT
  {
    id: 'item-aura-cosmic',
    name: 'Astral Void Cosmic Orbit',
    type: 'aura',
    orbitType: 'cosmic',
    category: 'orbit',
    price: 800,
    currency: 'gold',
    icon: '🪐',
    rarity: 'Legendary',
    lore: 'Drifting celestial stardust, orbital rings, and lunar satellites revolving around your avatar.',
    description: 'Deep space cosmic nebula rings and crescent moon orbiting the outer avatar perimeter in real-time.',
    glowColor: 'rgba(168, 85, 247, 0.5)'
  },

  // 3. KINETIC PULSE ORBIT
  {
    id: 'item-aura-energy',
    name: 'Kinetic Pulse Orbit',
    type: 'aura',
    orbitType: 'kinetic',
    category: 'orbit',
    price: 500,
    currency: 'gold',
    icon: '⚡',
    rarity: 'Rare',
    lore: 'High-speed rotating electric cyan telemetry ring with micro-pulse calipers orbiting your avatar.',
    description: 'Futuristic HUD kinetic energy field with rotating cyber nodes orbiting your avatar perimeter.',
    glowColor: 'rgba(6, 182, 212, 0.5)'
  },

  // 4. SUPERNOVA STAR ORBIT
  {
    id: 'item-effect-supernova',
    name: 'Supernova Star Orbit',
    type: 'aura',
    orbitType: 'supernova',
    category: 'orbit',
    price: 750,
    currency: 'gold',
    icon: '💥',
    rarity: 'Legendary',
    lore: 'Spinning stellar nova stars and pulsar shockwaves orbiting gracefully around your avatar.',
    description: 'Radiant 4-point celestial nova stars orbiting in 3D around your avatar with trailing starlight particles.',
    glowColor: 'rgba(56, 189, 248, 0.6)'
  },

  // 5. PRISMATIC CRYSTAL ORBIT
  {
    id: 'item-effect-xpburst',
    name: 'Prismatic Crystal Orbit',
    type: 'aura',
    orbitType: 'prismatic',
    category: 'orbit',
    price: 400,
    currency: 'gold',
    icon: '✨',
    rarity: 'Rare',
    lore: 'Radiant golden diamond shards and rainbow gemstone crystals revolving around your avatar.',
    description: 'Floating faceted gem crystals orbiting your avatar with glittering golden prism reflections.',
    glowColor: 'rgba(234, 179, 8, 0.6)'
  },

  // 6. PHOENIX ASCENSION ORBIT
  {
    id: 'item-emote-phoenix',
    name: 'Phoenix Ascension Orbit',
    type: 'aura',
    orbitType: 'phoenix',
    category: 'orbit',
    price: 60,
    currency: 'diamonds',
    icon: '🦅',
    rarity: 'Mythic',
    lore: 'Ascending solar golden phoenix feathers and sacred flame embers orbiting your avatar.',
    description: 'Majestic solar phoenix feather arcs spinning around the avatar with ascending flame embers.',
    glowColor: 'rgba(245, 158, 11, 0.6)'
  },

  // 7. HONOR BLADES ORBIT
  {
    id: 'item-emote-champion',
    name: 'Honor Blades Orbit',
    type: 'aura',
    orbitType: 'blades',
    category: 'orbit',
    price: 900,
    currency: 'gold',
    icon: '⚔️',
    rarity: 'Epic',
    lore: 'Twin enchanted celestial knight blades orbiting in tandem around the hero avatar.',
    description: 'Radiant sapphire & silver enchanted swords revolving in continuous orbit around your avatar.',
    glowColor: 'rgba(59, 130, 246, 0.6)'
  },

  // 8. HYPERDRIVE PLASMA ORBIT
  {
    id: 'item-flame-hyper',
    name: 'Hyperdrive Plasma Orbit',
    type: 'aura',
    orbitType: 'hyper',
    category: 'orbit',
    price: 40,
    currency: 'diamonds',
    icon: '🌀',
    rarity: 'Legendary',
    lore: 'High-velocity neon cobalt plasma fireballs and ion particles orbiting the avatar.',
    description: 'Dual cobalt plasma comet orbs with curving ion light streaks orbiting at hyperdrive speed.',
    glowColor: 'rgba(14, 165, 233, 0.6)'
  },

  // 9. DRAGONFIRE INFERNO ORBIT
  {
    id: 'item-flame-inferno',
    name: 'Dragonfire Inferno Orbit',
    type: 'aura',
    orbitType: 'inferno',
    category: 'orbit',
    price: 600,
    currency: 'gold',
    icon: '🔥',
    rarity: 'Epic',
    lore: 'Dual molten dragon fireballs with fiery particle smoke revolving around your avatar.',
    description: 'Molten dragonfire orbs with blazing crimson and orange flame trails circling your avatar.',
    glowColor: 'rgba(239, 68, 68, 0.6)'
  }
];

export const getAuraStyle = (auraName) => {
  if (!auraName) return null;
  const name = auraName.toLowerCase();

  if (name.includes('kinetic') || name.includes('energy') || name.includes('pulse')) {
    return {
      id: 'aura-kinetic',
      name: 'Kinetic Pulse Aura',
      color: '#06b6d4',
      ringClass: 'border-cyan-400 animate-spin-slow',
      glowClass: 'shadow-[0_0_24px_rgba(6,182,212,0.6)]',
      particleColor: '#22d3ee'
    };
  }

  if (name.includes('flame') || name.includes('solar')) {
    return {
      id: 'aura-flame',
      name: 'Solar Flare Aura',
      color: '#f59e0b',
      ringClass: 'border-amber-500 animate-pulse',
      glowClass: 'shadow-[0_0_24px_rgba(245,158,11,0.6)]',
      particleColor: '#fbbf24'
    };
  }

  // Default to Astral Void Aura
  return {
    id: 'aura-cosmic',
    name: 'Astral Void Aura',
    color: '#a855f7',
    ringClass: 'border-purple-400 animate-spin-reverse',
    glowClass: 'shadow-[0_0_24px_rgba(168,85,247,0.6)]',
    particleColor: '#c084fc'
  };
};

export const getCompletionEffectStyle = (effectName) => {
  if (!effectName) return null;
  const name = effectName.toLowerCase();

  if (name.includes('prismatic') || name.includes('gold')) {
    return {
      id: 'effect-prismatic',
      name: 'Prismatic XP Nova',
      primaryColor: '#eab308',
      secondaryColor: '#10b981',
      burstGlow: 'rgba(234, 179, 8, 0.7)'
    };
  }

  return {
    id: 'effect-supernova',
    name: 'Supernova XP Burst',
    primaryColor: '#38bdf8',
    secondaryColor: '#a855f7',
    burstGlow: 'rgba(56, 189, 248, 0.75)'
  };
};

export const getVictoryEmoteStyle = (emoteName) => {
  if (!emoteName) return null;
  const name = emoteName.toLowerCase();

  if (name.includes('blade') || name.includes('salute') || name.includes('honor')) {
    return {
      id: 'emote-blades',
      name: 'Honor Blades Salute',
      icon: '⚔️',
      color: 'text-blue-400',
      title: 'KNIGHT HONOR SALUTE'
    };
  }

  return {
    id: 'emote-phoenix',
    name: 'Phoenix Ascension Emote',
    icon: '🦅',
    color: 'text-amber-400',
    title: 'PHOENIX ASCENSION'
  };
};

export const getStreakFlameStyle = (flameName) => {
  if (!flameName) return null;
  const name = flameName.toLowerCase();

  if (name.includes('hyper') || name.includes('blue') || name.includes('plasma')) {
    return {
      id: 'flame-hyper',
      name: 'Hyperdrive Blue Flame',
      color: 'text-cyan-400',
      shadow: 'drop-shadow(0 0 16px #00f0ff)',
      text: 'HYPERDRIVE PLASMA',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
    };
  }

  if (name.includes('dragon') || name.includes('inferno') || name.includes('blaze')) {
    return {
      id: 'flame-inferno',
      name: 'Dragonfire Blaze',
      color: 'text-red-500',
      shadow: 'drop-shadow(0 0 16px #ef4444)',
      text: 'DRAGONFIRE INFERNO',
      badgeBg: 'bg-red-500/20 text-red-300 border-red-500'
    };
  }

  return null;
};
