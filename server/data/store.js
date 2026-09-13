import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRandomDailyQuests } from './questTemplates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'local_db.json');

// Default initial state
const defaultState = {
  profiles: {
    'demo-user-123': {
      id: 'demo-user-123',
      username: 'CyberRunner',
      display_name: 'Cyber Runner',
      avatar_url: 'cyber-avatar-1',
      current_xp: 350,
      current_level: 3,
      current_streak: 5,
      longest_streak: 9,
      last_activity_date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
      intellect: 45,
      strength: 32,
      discipline: 38,
      knowledge: 40,
      sound_enabled: true,
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  quests: {
    'q-1': {
      id: 'q-1',
      user_id: 'demo-user-123',
      title: 'Master JavaScript Async Patterns',
      description: 'Implement Promise combinators and async generators for high-throughput pipeline.',
      category: 'Coding',
      difficulty: 'Hard',
      xp_reward: 200,
      is_active: true,
      created_at: new Date().toISOString()
    },
    'q-2': {
      id: 'q-2',
      user_id: 'demo-user-123',
      title: 'HIIT Cyber Workout Session',
      description: '30 minutes high-intensity kettlebell and bodyweight circuit.',
      category: 'Fitness',
      difficulty: 'Medium',
      xp_reward: 120,
      is_active: true,
      created_at: new Date().toISOString()
    },
    'q-3': {
      id: 'q-3',
      user_id: 'demo-user-123',
      title: 'Read 25 Pages: Designing Data-Intensive Applications',
      description: 'Chapter on replication strategies, partition tolerance, and consensus.',
      category: 'Reading',
      difficulty: 'Medium',
      xp_reward: 100,
      is_active: true,
      created_at: new Date().toISOString()
    },
    'q-4': {
      id: 'q-4',
      user_id: 'demo-user-123',
      title: 'Neural Reset Meditation',
      description: '15 minutes mindfulness breathing and binaural audio focus.',
      category: 'Mindfulness',
      difficulty: 'Easy',
      xp_reward: 80,
      is_active: true,
      created_at: new Date().toISOString()
    },
    'q-5': {
      id: 'q-5',
      user_id: 'demo-user-123',
      title: 'System Architecture Review',
      description: 'Document API contracts, RLS rules, and rate-limiting schemas.',
      category: 'Coding',
      difficulty: 'Epic',
      xp_reward: 350,
      is_active: true,
      created_at: new Date().toISOString()
    }
  },
  quest_completions: [
    {
      id: 'comp-1',
      user_id: 'demo-user-123',
      quest_id: 'q-2',
      xp_awarded: 120,
      completed_at: new Date(Date.now() - 86400000).toISOString(),
      completion_date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    }
  ]
};

// Load data from file or initialize
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('⚠️ [Store] Error reading local_db.json, using defaults:', err.message);
  }
  saveData(defaultState);
  return defaultState;
}

function saveData(data) {
  try {
    if (!fs.existsSync(__dirname)) {
      fs.mkdirSync(__dirname, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('⚠️ [Store] Error writing local_db.json:', err.message);
  }
}

export const localStore = {
  getProfile: (userId) => {
    const data = loadData();
    if (!data.profiles[userId]) {
      data.profiles[userId] = {
        id: userId,
        username: 'Adventurer_' + userId.slice(0, 5),
        display_name: 'Cyber Adventurer',
        avatar_url: '/avatar-alex.jpg',
        current_xp: 0,
        current_level: 1,
        current_streak: 0,
        longest_streak: 0,
        last_activity_date: null,
        intellect: 10,
        strength: 10,
        discipline: 10,
        knowledge: 10,
        gold: 850,
        diamonds: 50,
        streak_shields: 0,
        equipped_streak_shield: false,
        equipped_frame: 'Fire Frame',
        equipped_badge: 'Novice Adventurer',
        equipped_aura: null,
        equipped_completion_effect: null,
        equipped_victory_emote: null,
        equipped_streak_flame: null,
        inventory: ['frame-fire', 'badge-bronze'],
        sound_enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      saveData(data);
    } else {
      // Backfill any missing fields on existing profiles
      const p = data.profiles[userId];
      let needsSave = false;
      if (p.gold === undefined) { p.gold = 850; needsSave = true; }
      if (p.diamonds === undefined) { p.diamonds = 50; needsSave = true; }
      if (p.streak_shields === undefined) { p.streak_shields = 0; needsSave = true; }
      if (p.equipped_streak_shield === undefined) { p.equipped_streak_shield = false; needsSave = true; }
      if (!p.equipped_frame) { p.equipped_frame = 'Fire Frame'; needsSave = true; }
      if (!p.equipped_badge) { p.equipped_badge = 'Novice Adventurer'; needsSave = true; }
      if (!Array.isArray(p.inventory)) { p.inventory = ['frame-fire', 'badge-bronze']; needsSave = true; }
      if (needsSave) saveData(data);
    }
    return data.profiles[userId];
  },

  updateProfile: (userId, updates) => {
    const data = loadData();
    if (!data.profiles[userId]) {
      localStore.getProfile(userId);
    }
    data.profiles[userId] = {
      ...data.profiles[userId],
      ...updates,
      updated_at: new Date().toISOString()
    };
    saveData(data);
    return data.profiles[userId];
  },

  getQuests: (userId) => {
    const data = loadData();
    const list = Object.values(data.quests).filter(q => q.user_id === userId);
    if (list.length === 0) {
      // Create initial balanced quests covering Intellect, Strength, Knowledge & Mind (Meditation etc.)
      const starters = getRandomDailyQuests(userId, 5);
      starters.forEach(q => { data.quests[q.id] = q; });
      saveData(data);
      return starters;
    }
    return list;
  },

  createQuest: (userId, questData) => {
    const data = loadData();
    const id = `q-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newQuest = {
      id,
      user_id: userId,
      title: questData.title,
      description: questData.description || '',
      category: questData.category || 'Coding',
      difficulty: questData.difficulty || 'Medium',
      duration: questData.duration || '30 min',
      xp_reward: Number(questData.xp_reward) || 100,
      is_active: true,
      created_at: new Date().toISOString()
    };
    data.quests[id] = newQuest;
    saveData(data);
    return newQuest;
  },

  updateQuest: (userId, questId, updates) => {
    const data = loadData();
    const quest = data.quests[questId];
    if (!quest || quest.user_id !== userId) return null;
    data.quests[questId] = {
      ...quest,
      ...updates
    };
    saveData(data);
    return data.quests[questId];
  },

  deleteQuest: (userId, questId) => {
    const data = loadData();
    const quest = data.quests[questId];
    if (!quest || quest.user_id !== userId) return false;
    delete data.quests[questId];
    saveData(data);
    return true;
  },

  getCompletions: (userId) => {
    const data = loadData();
    return (data.quest_completions || []).filter(c => c.user_id === userId);
  },

  recordCompletion: (userId, questId, xp) => {
    const data = loadData();
    const comp = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: userId,
      quest_id: questId,
      xp_awarded: xp,
      completed_at: new Date().toISOString(),
      completion_date: new Date().toISOString().split('T')[0]
    };
    if (!data.quest_completions) data.quest_completions = [];
    data.quest_completions.push(comp);
    saveData(data);
    return comp;
  }
};
