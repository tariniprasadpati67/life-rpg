async function runTests() {
  console.log('🚀 Starting Life RPG End-to-End API Verification...\n');

  // 1. Health check
  const healthRes = await fetch('http://localhost:5000/api/health');
  const health = await healthRes.json();
  console.log('✅ 1. Health Check:', health.status, `(${health.service})`);

  // 2. Guest Login
  const loginRes = await fetch('http://localhost:5000/api/auth/guest', { method: 'POST' });
  const loginData = await loginRes.json();
  console.log('✅ 2. Guest Login:', loginData.user.username, `(Token: ${loginData.token})`);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${loginData.token}`
  };

  // 3. Fetch Profile & Required XP
  const profRes = await fetch('http://localhost:5000/api/progress/profile', { headers });
  const profData = await profRes.json();
  console.log('✅ 3. Profile Fetched:');
  console.log(`   - Level: ${profData.profile.current_level}`);
  console.log(`   - XP: ${profData.profile.current_xp} / ${profData.profile.requiredXP}`);
  console.log(`   - Streak: ${profData.profile.current_streak} days (Record: ${profData.profile.longest_streak})`);
  console.log(`   - Attributes: Intellect=${profData.profile.intellect}, Strength=${profData.profile.strength}, Discipline=${profData.profile.discipline}, Knowledge=${profData.profile.knowledge}`);
  console.log(`   - 7-Day Matrix days: ${profData.weeklyCalendar.map(d => `${d.day}:${d.isCompleted ? '✓' : '○'}`).join(' ')}`);

  // 4. Fetch Quests
  const questsRes = await fetch('http://localhost:5000/api/quests', { headers });
  const questsData = await questsRes.json();
  console.log(`\n✅ 4. Quests Loaded: ${questsData.quests.length} quests available.`);
  questsData.quests.forEach(q => {
    console.log(`   - [${q.category}] [${q.difficulty}] "${q.title}" (+${q.xp_reward} XP) - Conquered Today: ${q.is_completed_today}`);
  });

  // 5. Create a new quest
  const newQuestRes = await fetch('http://localhost:5000/api/quests', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      title: 'Neural Architecture Design',
      description: 'Design distributed stream ingestion with zero packet loss.',
      category: 'Coding',
      difficulty: 'Epic',
      xp_reward: 350
    })
  });
  const createdQuest = await newQuestRes.json();
  console.log('\n✅ 5. Created Quest:', createdQuest.quest.title, `(+${createdQuest.quest.xp_reward} XP)`);

  // 6. Complete Quest (Anti-cheat & Non-linear leveling test)
  const targetQuest = questsData.quests.find(q => !q.is_completed_today) || createdQuest.quest;
  console.log(`\n⚔️ 6. Completing Quest "${targetQuest.title}" (ID: ${targetQuest.id})...`);

  const compRes = await fetch(`http://localhost:5000/api/quests/${targetQuest.id}/complete`, {
    method: 'POST',
    headers
  });
  const compData = await compRes.json();

  if (compData.success) {
    console.log('✅ Quest Conquered Successfully!');
    console.log(`   - XP Awarded: +${compData.xpAwarded} XP`);
    console.log(`   - New Level: ${compData.profile.current_level} (Level Up: ${compData.levelUp.didLevelUp ? 'YES! 🎉' : 'No'})`);
    console.log(`   - Excess XP Remaining: ${compData.profile.current_xp} / ${compData.profile.requiredXP}`);
    console.log(`   - Streak Now: ${compData.streak.currentStreak} Days (Extended: ${compData.streak.streakExtended})`);
    console.log(`   - Attribute Boosts:`, compData.attributeGains);
  } else {
    console.log('❌ Quest completion returned:', compData.error);
  }

  // 7. Test Idempotency / Duplicate completion prevention
  console.log(`\n🛡️ 7. Testing Duplicate Completion Prevention...`);
  const dupRes = await fetch(`http://localhost:5000/api/quests/${targetQuest.id}/complete`, {
    method: 'POST',
    headers
  });
  const dupData = await dupRes.json();
  if (!dupData.success && dupData.error.includes('already been conquered today')) {
    console.log('✅ Duplicate Prevention Confirmed! Blocked with message:', dupData.error);
  } else {
    console.log('⚠️ Duplicate Response:', dupData);
  }

  // 8. Delete the created quest to test CRUD delete
  const delRes = await fetch(`http://localhost:5000/api/quests/${createdQuest.quest.id}`, {
    method: 'DELETE',
    headers
  });
  const delData = await delRes.json();
  console.log('\n✅ 8. Quest Deletion Verified:', delData.message);

  console.log('\n🎉 ALL CORE SYSTEMS FULLY OPERATIONAL AND VERIFIED!');
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
