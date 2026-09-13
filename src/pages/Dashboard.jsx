import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Brain,
  Dumbbell,
  BookOpen,
  Sparkles,
  Check,
  Play,
  CheckCircle2,
  Code
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { AvatarModal } from '../components/AvatarModal';
import { QuestModal } from '../components/QuestModal';
import { AvatarFrame } from '../components/AvatarFrame';
import { QuestTimerWidget } from '../components/QuestTimerWidget';
import { soundFx } from '../lib/soundEffects';
import { getFrameStyle } from '../lib/cosmetics';
import { getAttributeLevelAndXP } from '../lib/xpSystem';
import { SEOHead } from '../components/SEOHead';

export const Dashboard = () => {
  const { user } = useAuth();
  const { 
    profile, 
    quests, 
    completeQuest,
    startQuest
  } = useGame();

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Hero';
  const currentLevel = profile?.current_level ?? 1;
  const currentXP = profile?.current_xp ?? 0;
  const requiredXP = profile?.requiredXP ?? 100;
  const xpPercentage = Math.min(100, Math.round((currentXP / requiredXP) * 100));
  const frameStyle = getFrameStyle(profile?.equipped_frame);

  const intellectData = getAttributeLevelAndXP(profile?.intellect);
  const strengthData = getAttributeLevelAndXP(profile?.strength);
  const knowledgeData = getAttributeLevelAndXP(profile?.knowledge);
  const mindData = getAttributeLevelAndXP(profile?.mind);

  // Attributes data
  const attributes = [
    { 
      name: 'Intellect', 
      level: intellectData.level, 
      xp: intellectData.xp, 
      maxXP: intellectData.maxXP, 
      icon: Brain, 
      color: 'from-cyan-500 to-blue-500', 
      textColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30'
    },
    { 
      name: 'Strength', 
      level: strengthData.level, 
      xp: strengthData.xp, 
      maxXP: strengthData.maxXP, 
      icon: Dumbbell, 
      color: 'from-amber-500 to-orange-500', 
      textColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/30'
    },
    { 
      name: 'Knowledge', 
      level: knowledgeData.level, 
      xp: knowledgeData.xp, 
      maxXP: knowledgeData.maxXP, 
      icon: BookOpen, 
      color: 'from-blue-500 to-indigo-500', 
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/30'
    },
    { 
      name: 'Mind', 
      level: mindData.level, 
      xp: mindData.xp, 
      maxXP: mindData.maxXP, 
      icon: Sparkles, 
      color: 'from-emerald-400 to-teal-500', 
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30'
    }
  ];

  // Helper for quest category icon
  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('study') || cat.includes('math')) return BookOpen;
    if (cat.includes('code') || cat.includes('dev')) return Code;
    if (cat.includes('fit') || cat.includes('gym')) return Dumbbell;
    return Sparkles;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-[#090d16] relative overflow-hidden">
      {/* Ambient Home Artwork Backdrop - Clearly Visible */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-25 z-0"
        style={{ backgroundImage: 'url("/home-bg.jpg")' }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-[#090d16]/50 pointer-events-none z-0" />

      {/* Left Sidebar */}
      <Sidebar className="hidden md:flex relative z-10" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto space-y-6 relative z-10">
        <SEOHead
          title="Hero Dashboard"
          description="Track daily quests, level progression, streak status, and character attributes in Life RPG."
          canonical="/dashboard"
        />
        
        {/* Top Greeting Header with Atmospheric Glow */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Hello, {displayName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            Small steps make big changes.
          </p>
        </div>

        {/* 3-Column Hero Row matching Black Clover Anime Aesthetic */}
        <section aria-label="Hero Overview & Quests" className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Col 1: Hero Character Card (col-span-4) */}
          <div className="md:col-span-4 bg-[#0a1020]/75 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-violet-500/40 flex flex-col items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all duration-500">
            {/* Ambient Inner Gradient & Flame Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-violet-950/20 pointer-events-none" />
            <div className="absolute -top-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Avatar with Equipped Frame */}
            <div 
              onClick={() => setAvatarModalOpen(true)}
              className="relative cursor-pointer mt-2 group/avatar z-10 flex items-center justify-center"
              title="Change Avatar"
            >
              <AvatarFrame
                frameName={profile?.equipped_frame}
                avatarUrl={profile?.avatar_url}
                auraName={profile?.equipped_aura}
                orbitName={profile?.equipped_aura}
                badgeName={profile?.equipped_badge || 'Novice Adventurer'}
                equippedStreakShield={Boolean(profile?.equipped_streak_shield && (Number(profile?.streak_shields) || 0) > 0)}
                size="lg"
                alt={displayName}
                className="group-hover/avatar:scale-105 transition-all duration-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              />
            </div>

            {/* Level & Explorer Badge */}
            <div className="text-center mt-4 space-y-1.5 z-10">
              <div className="font-heading font-black text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Lv. {currentLevel}
              </div>
              <div className="inline-block px-3.5 py-1 rounded-full bg-[#16203a]/90 backdrop-blur-md border border-indigo-400/30 text-indigo-300 text-xs font-semibold shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                {profile?.title || 'Explorer'}
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full mt-5 space-y-1.5 z-10">
              <div className="flex justify-between text-[11px] font-semibold text-slate-200">
                <span>XP Progress</span>
                <span className="text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">{currentXP} / {requiredXP} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/40 backdrop-blur-sm overflow-hidden p-0.5 border border-white/10 shadow-inner">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.7)] transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Col 2: Character Attributes Card with Demon Asta Artwork (col-span-4) */}
          <div className="md:col-span-4 bg-[#0a1020]/75 backdrop-blur-xl rounded-3xl p-6 border border-red-500/30 hover:border-red-400/50 flex flex-col justify-between shadow-[0_12px_40px_rgba(239,68,68,0.15)] relative overflow-hidden group transition-all duration-500">
            {/* Demon Asta Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              style={{ backgroundImage: 'url("/asta-attributes-bg.png")' }}
            />

            {/* Translucent gradient overlay so Asta demon art is vibrant & visible, while stat text remains clear */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b101e]/80 via-[#0b101e]/55 to-[#0b101e]/85 pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="relative z-10 flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Character Attributes
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                CORE STATS
              </span>
            </div>

            <div className="space-y-3.5 my-auto py-3 relative z-10">
              {attributes.map((attr) => {
                const Icon = attr.icon;
                const pct = Math.min(100, Math.round((attr.xp / attr.maxXP) * 100));

                return (
                  <div key={attr.name} className="space-y-1.5 p-2 rounded-xl bg-[#090e1c]/70 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${attr.bgColor} shadow-sm`}>
                          <Icon className={`w-3.5 h-3.5 ${attr.textColor}`} />
                        </div>
                        <span className="font-semibold text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{attr.name}</span>
                      </div>
                      <span className="font-bold text-slate-300 text-[11px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        Lv. {attr.level}
                      </span>
                    </div>

                    {/* Stat Bar */}
                    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/10 shadow-inner">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${attr.color} transition-all duration-500 shadow-sm`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 3: Motivation Card (col-span-4) */}
          <div className="md:col-span-4 bg-[#0a1020]/75 backdrop-blur-xl rounded-3xl border border-purple-500/30 hover:border-purple-400/50 shadow-[0_12px_40px_rgba(168,85,247,0.2)] relative overflow-hidden flex flex-col justify-between p-6 group transition-all duration-500">
            {/* Full vibrant color background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url("/home-bg.jpg")' }}
            />
            {/* Gentle translucent gradient to keep text readable while letting full colors shine */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b16]/90 via-[#070b16]/40 to-[#070b16]/60 pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Content on top */}
            <div className="relative z-10 space-y-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-[10px] uppercase font-black tracking-wider text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] backdrop-blur-sm">
                Daily Creed
              </span>
              <p className="font-heading font-extrabold text-lg sm:text-xl text-white leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                “Beyond<br />Your Limits.”
              </p>
            </div>

            <div className="relative z-10 pt-10 flex items-center justify-between text-xs font-semibold backdrop-blur-[2px]">
              <span className="text-slate-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">Black Bulls Squad</span>
              <span className="text-amber-300 font-bold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
                <span>Streak Active</span>
                <span>🔥</span>
              </span>
            </div>
          </div>

        </section>

        {/* Today's Quests Section with Color-Graded Glassmorphism */}
        <section aria-labelledby="todays-quests-heading" className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 id="todays-quests-heading" className="font-heading font-black text-xl text-white flex items-center gap-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              <span>Today's Quests</span>
            </h2>
            <Link
              to="/quests"
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all shadow-sm"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quests List */}
          <div className="space-y-3">
            {quests.map((quest) => {
              const Icon = getCategoryIcon(quest.category);
              const isDone = quest.is_completed_today;

              return (
                <div
                  key={quest.id}
                  className="bg-[#0a1020]/75 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-[#11182c]/85 hover:border-violet-500/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.18)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    {/* Category squircle icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-indigo-500/15 border border-violet-400/25 flex items-center justify-center text-violet-300 group-hover:scale-105 transition-transform shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className={`font-heading font-bold text-base ${isDone ? 'line-through text-slate-400 decoration-slate-400 decoration-2' : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'}`}>
                        {quest.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs mt-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/5 text-slate-300 font-medium">{quest.duration || '45 min'}</span>
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-bold shadow-sm">+{quest.xp_reward || 60} XP</span>
                        {quest.gold_reward && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 font-bold shadow-sm">🪙 +{quest.gold_reward} Gold</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Button: Start with Timer, Complete, Edit & Delete */}
                  <div>
                    <QuestTimerWidget 
                      quest={quest} 
                      onEdit={(q) => {
                        setEditingQuest(q);
                        setQuestModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* Avatar Modal */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />

      {/* Quest Modal */}
      <QuestModal
        isOpen={questModalOpen}
        onClose={() => {
          setQuestModalOpen(false);
          setEditingQuest(null);
        }}
        initialQuest={editingQuest}
      />
    </div>
  );
};
