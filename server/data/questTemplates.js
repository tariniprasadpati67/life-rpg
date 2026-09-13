/**
 * RPG Quest Templates Pool (Server)
 * Balanced across the 4 core Character Attributes:
 * 1. 🧠 Intellect (Coding, Study, Problem Solving)
 * 2. 🏋️ Strength (Fitness, Gym, Workout, Cardio)
 * 3. 📖 Knowledge (Reading, Books, Research, Case Studies)
 * 4. ✨ Mind (Meditation, Mindfulness, Breathwork, Digital Detox)
 */

export const QUEST_CATALOG = [
  // ================= 1. INTELLECT =================
  {
    title: 'Solve Algorithmic Challenge',
    description: 'Tackle a problem on LeetCode or HackerRank to sharpen algorithmic logic.',
    category: 'Coding',
    difficulty: 'Medium',
    duration: '40 min',
    xp_reward: 60,
    gold_reward: 120,
    attribute: 'intellect'
  },
  {
    title: 'Code Refactoring & Clean Architecture',
    description: 'Refactor complex code, improve test coverage, or study system design.',
    category: 'Coding',
    difficulty: 'Hard',
    duration: '60 min',
    xp_reward: 85,
    gold_reward: 170,
    attribute: 'intellect'
  },
  {
    title: 'Math & Logic Brain Training',
    description: 'Solve 3 mathematical or logic reasoning puzzles to activate critical thinking.',
    category: 'Study',
    difficulty: 'Easy',
    duration: '25 min',
    xp_reward: 40,
    gold_reward: 80,
    attribute: 'intellect'
  },
  {
    title: 'Deep Focus Study Session',
    description: 'Uninterrupted deep work studying tech documentation or lecture materials.',
    category: 'Study',
    difficulty: 'Medium',
    duration: '45 min',
    xp_reward: 65,
    gold_reward: 130,
    attribute: 'intellect'
  },

  // ================= 2. STRENGTH =================
  {
    title: 'Gym / Strength Training Workout',
    description: 'Heavy compound lifts, dumbbell circuit, or machine resistance training.',
    category: 'Fitness',
    difficulty: 'Hard',
    duration: '50 min',
    xp_reward: 75,
    gold_reward: 150,
    attribute: 'strength'
  },
  {
    title: 'Calisthenics & Pushups Circuit',
    description: 'Pushups, pull-ups, squats, and core plank holds for muscular endurance.',
    category: 'Fitness',
    difficulty: 'Medium',
    duration: '30 min',
    xp_reward: 50,
    gold_reward: 100,
    attribute: 'strength'
  },
  {
    title: '5km Outdoor Run / Cardio Burn',
    description: 'Hit the pavement or treadmill for a steady-state cardio session.',
    category: 'Fitness',
    difficulty: 'Medium',
    duration: '35 min',
    xp_reward: 55,
    gold_reward: 110,
    attribute: 'strength'
  },
  {
    title: 'Core Strength & Posture Routine',
    description: 'Core stabilization drills, deadbugs, and posterior chain alignment.',
    category: 'Fitness',
    difficulty: 'Easy',
    duration: '20 min',
    xp_reward: 35,
    gold_reward: 70,
    attribute: 'strength'
  },

  // ================= 3. KNOWLEDGE =================
  {
    title: 'Read 20 Pages of a Book',
    description: 'Deep non-fiction or philosophy reading with all notifications silenced.',
    category: 'Knowledge',
    difficulty: 'Easy',
    duration: '30 min',
    xp_reward: 45,
    gold_reward: 90,
    attribute: 'knowledge'
  },
  {
    title: 'Listen to Insightful Tech Podcast',
    description: 'Listen to an in-depth interview or educational lecture on science/tech.',
    category: 'Knowledge',
    difficulty: 'Easy',
    duration: '30 min',
    xp_reward: 35,
    gold_reward: 70,
    attribute: 'knowledge'
  },
  {
    title: 'System Design / Research Case Study',
    description: 'Analyze how high-scale systems solve distributed caching and database latency.',
    category: 'Knowledge',
    difficulty: 'Medium',
    duration: '35 min',
    xp_reward: 55,
    gold_reward: 110,
    attribute: 'knowledge'
  },
  {
    title: 'Language Vocabulary Practice',
    description: 'Drill 25 new vocabulary words and phrases in a foreign language.',
    category: 'Knowledge',
    difficulty: 'Easy',
    duration: '20 min',
    xp_reward: 30,
    gold_reward: 60,
    attribute: 'knowledge'
  },

  // ================= 4. MIND =================
  {
    title: 'Morning Deep Meditation',
    description: '15 minutes of guided mindfulness or breath awareness for calm focus.',
    category: 'Mind',
    difficulty: 'Easy',
    duration: '15 min',
    xp_reward: 40,
    gold_reward: 80,
    attribute: 'mind'
  },
  {
    title: 'Evening Reflection & Gratitude Journal',
    description: 'Reflect on the day, write down 3 victories and 1 key lesson learned.',
    category: 'Mind',
    difficulty: 'Easy',
    duration: '15 min',
    xp_reward: 35,
    gold_reward: 70,
    attribute: 'mind'
  },
  {
    title: '1-Hour Digital Detox Walk',
    description: 'Outdoor nature walk without looking at your smartphone or checking feeds.',
    category: 'Mind',
    difficulty: 'Medium',
    duration: '45 min',
    xp_reward: 50,
    gold_reward: 100,
    attribute: 'mind'
  },
  {
    title: 'Box Breathing & Stress Reset',
    description: '4-4-4-4 box breathing cycles to lower heart rate and enter deep flow state.',
    category: 'Mind',
    difficulty: 'Easy',
    duration: '10 min',
    xp_reward: 25,
    gold_reward: 50,
    attribute: 'mind'
  }
];

export const getRandomDailyQuests = (userId = 'guest', count = 5) => {
  const intellectList = QUEST_CATALOG.filter(q => q.attribute === 'intellect');
  const strengthList = QUEST_CATALOG.filter(q => q.attribute === 'strength');
  const knowledgeList = QUEST_CATALOG.filter(q => q.attribute === 'knowledge');
  const mindList = QUEST_CATALOG.filter(q => q.attribute === 'mind');

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Ensure at least 1 from each attribute
  const picked = [
    pickRandom(intellectList),
    pickRandom(strengthList),
    pickRandom(knowledgeList),
    pickRandom(mindList)
  ];

  // Pick 1 extra from any category that hasn't been picked yet
  const remaining = QUEST_CATALOG.filter(q => !picked.some(p => p.title === q.title));
  if (remaining.length > 0 && count > 4) {
    picked.push(pickRandom(remaining));
  }

  // Map to quest instances
  return picked.map((t, idx) => ({
    id: `q-${Date.now()}-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
    user_id: userId,
    title: t.title,
    description: t.description,
    category: t.category,
    difficulty: t.difficulty,
    duration: t.duration,
    xp_reward: t.xp_reward,
    gold_reward: t.gold_reward,
    is_completed_today: false,
    is_active: idx === 0,
    created_at: new Date().toISOString()
  }));
};
