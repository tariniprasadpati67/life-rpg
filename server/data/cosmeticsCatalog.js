/**
 * Authoritative Server-Side Cosmetics Catalog for Life RPG
 */

export const CATALOG_ITEMS = {
  // Avatar Frames
  'frame-fire': { id: 'frame-fire', name: 'Fire Frame', type: 'frame', price: 500, currency: 'gold', isStarter: true },
  'frame-galaxy': { id: 'frame-galaxy', name: 'Galaxy Frame', type: 'frame', price: 800, currency: 'gold' },
  'frame-cyber': { id: 'frame-cyber', name: 'Cyber Frame', type: 'frame', price: 1000, currency: 'diamonds' },
  'frame-nature': { id: 'frame-nature', name: 'Nature Frame', type: 'frame', price: 600, currency: 'gold' },
  'frame-royal': { id: 'frame-royal', name: 'Royal Frame', type: 'frame', price: 1200, currency: 'gold' },

  // Badges
  'badge-bronze': { id: 'badge-bronze', name: 'Novice Adventurer', type: 'badge', price: 0, currency: 'gold', isStarter: true },
  'badge-silver': { id: 'badge-silver', name: 'Silver Vanguard', type: 'badge', price: 300, currency: 'gold' },
  'badge-7day': { id: 'badge-7day', name: 'Streak Master', type: 'badge', price: 500, currency: 'gold' },
  'badge-cyber': { id: 'badge-cyber', name: 'XP Hunter', type: 'badge', price: 800, currency: 'diamonds' },
  'badge-master': { id: 'badge-master', name: 'Weekly Champion', type: 'badge', price: 1200, currency: 'gold' },
  'badge-mythic': { id: 'badge-mythic', name: 'Mythic Sovereign', type: 'badge', price: 2000, currency: 'diamonds' },

  // Special Items & Avatar Orbits
  'item-streak-shield': { 
    id: 'item-streak-shield', 
    name: 'Aegis Streak Shield Orbit', 
    type: 'streak_shield', 
    price: 300, 
    currency: 'gold', 
    isConsumable: true, 
    maxStack: 5 
  },
  'item-aura-cosmic': { id: 'item-aura-cosmic', name: 'Astral Void Cosmic Orbit', type: 'aura', price: 800, currency: 'gold' },
  'item-aura-energy': { id: 'item-aura-energy', name: 'Kinetic Pulse Orbit', type: 'aura', price: 500, currency: 'gold' },
  'item-effect-supernova': { id: 'item-effect-supernova', name: 'Supernova Star Orbit', type: 'aura', price: 750, currency: 'gold' },
  'item-effect-xpburst': { id: 'item-effect-xpburst', name: 'Prismatic Crystal Orbit', type: 'aura', price: 400, currency: 'gold' },
  'item-emote-phoenix': { id: 'item-emote-phoenix', name: 'Phoenix Ascension Orbit', type: 'aura', price: 60, currency: 'diamonds' },
  'item-emote-champion': { id: 'item-emote-champion', name: 'Honor Blades Orbit', type: 'aura', price: 900, currency: 'gold' },
  'item-flame-hyper': { id: 'item-flame-hyper', name: 'Hyperdrive Plasma Orbit', type: 'aura', price: 40, currency: 'diamonds' },
  'item-flame-inferno': { id: 'item-flame-inferno', name: 'Dragonfire Inferno Orbit', type: 'aura', price: 600, currency: 'gold' }
};

export const getItemById = (id) => CATALOG_ITEMS[id] || null;

export const getItemByName = (name) => {
  if (!name) return null;
  const target = name.toLowerCase().trim();
  return Object.values(CATALOG_ITEMS).find(item => {
    const itemName = item.name.toLowerCase();
    return itemName === target ||
      target.includes(itemName) ||
      itemName.includes(target) ||
      target.replace(' orbit', '') === itemName.replace(' orbit', '') ||
      target.replace(' aura', '') === itemName.replace(' aura', '') ||
      target.replace(' salute', '') === itemName.replace(' salute', '') ||
      target.replace(' burst', '') === itemName.replace(' burst', '');
  }) || null;
};
