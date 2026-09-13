import React, { useState } from 'react';
import { 
  Plus, 
  BookOpen, 
  Code, 
  Dumbbell, 
  Sparkles, 
  Check, 
  Play,
  Flame,
  CheckCircle2,
  Dices
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Sidebar } from '../components/Sidebar';
import { QuestModal } from '../components/QuestModal';
import { QuestTimerWidget } from '../components/QuestTimerWidget';
import { soundFx } from '../lib/soundEffects';
import { SEOHead } from '../components/SEOHead';

export const Quests = () => {
  const { quests, completeQuest, startQuest, rollDailyQuests } = useGame();

  const [activeTab, setActiveTab] = useState('All'); // 'Active' | 'Completed' | 'All'
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuest, setEditingQuest] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const completedCount = quests.filter(q => q.is_completed_today).length;
  const totalCount = quests.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 50;

  // Filter based on activeTab
  const filteredQuests = quests.filter((q) => {
    if (activeTab === 'Active') return !q.is_completed_today;
    if (activeTab === 'Completed') return q.is_completed_today;
    return true;
  });

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('study') || cat.includes('math')) return BookOpen;
    if (cat.includes('code') || cat.includes('dev')) return Code;
    if (cat.includes('fit') || cat.includes('gym') || cat.includes('run') || cat.includes('strength')) return Dumbbell;
    if (cat.includes('read') || cat.includes('book') || cat.includes('know')) return BookOpen;
    return Sparkles;
  };

  const getAttributeBadge = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('cod') || cat.includes('math') || cat.includes('study') || cat.includes('intellect') || cat.includes('logic')) {
      return { label: '🧠 Intellect', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
    }
    if (cat.includes('fit') || cat.includes('gym') || cat.includes('work') || cat.includes('strength') || cat.includes('run')) {
      return { label: '🏋️ Strength', color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' };
    }
    if (cat.includes('read') || cat.includes('book') || cat.includes('know') || cat.includes('learn')) {
      return { label: '📖 Knowledge', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    }
    return { label: '✨ Mind', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-[#070b14] relative overflow-hidden">
      {/* Ambient Anime Artwork Backdrop with Rich Color Grading */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-30 z-0"
        style={{ backgroundImage: 'url("/home-bg.jpg")' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#070b14]/75 via-[#070b14]/55 to-[#070b14]/85 pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar className="hidden md:flex relative z-10" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl overflow-y-auto space-y-6 relative z-10">
        <SEOHead
          title="Quest Log & Daily Tasks"
          description="Manage and conquer your daily habits, study goals, fitness milestones, and productivity quests with RPG timers and rewards."
          canonical="/quests"
        />
        
        {/* Top Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Quests
              </h1>
              <h2 className="sr-only">Daily Habit Quests and Active Missions</h2>
            </div>

            {/* Tabs: Active, Completed, All */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a1020]/80 backdrop-blur-xl border border-white/10">
              {['Active', 'Completed', 'All'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      soundFx.playClick();
                      setActiveTab(tab);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-[0_2px_12px_rgba(139,92,246,0.4)] border border-white/20'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Roll Daily Tasks Button */}
            <button
              onClick={async () => {
                setIsRolling(true);
                try {
                  await rollDailyQuests();
                  soundFx.playLevelUp();
                } finally {
                  setTimeout(() => setIsRolling(false), 500);
                }
              }}
              disabled={isRolling}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-md"
              title="Generate fresh balanced daily quests for Intellect, Strength, Knowledge & Mind"
            >
              <Dices className={`w-4 h-4 text-amber-400 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'Rolling...' : 'Roll Daily Tasks'}</span>
            </button>

            {/* + Create New Quest Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setEditingQuest(null);
                setModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-[0_4px_16px_rgba(124,58,237,0.4)] border border-white/20 flex items-center gap-2 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Quest</span>
            </button>
          </div>
        </div>

        {/* Attribute Focus Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs bg-[#0a1020]/75 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-200 font-bold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Daily Attribute Focus:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold">🧠 Intellect (Coding/Study)</span>
            <span className="px-2 py-0.5 rounded-lg bg-orange-500/15 text-orange-300 border border-orange-500/30 text-[11px] font-semibold">🏋️ Strength (Workout/Gym)</span>
            <span className="px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">📖 Knowledge (Reading/Books)</span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">✨ Mind (Meditation/Zen)</span>
          </div>
        </div>

        {/* Today's Progress Card */}
        <div className="bg-[#0a1020]/75 backdrop-blur-xl rounded-2xl p-5 border border-white/10 space-y-2.5 shadow-[0_8px_25px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-200">Today's Progress</span>
            <span className="text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">{completedCount}/{totalCount} Completed</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-black/40 backdrop-blur-sm overflow-hidden p-0.5 border border-white/10 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Quests List */}
        <section aria-label="Daily Quests List" className="space-y-3">
          {filteredQuests.length > 0 ? (
            filteredQuests.map((quest) => {
              const Icon = getCategoryIcon(quest.category);
              const isDone = quest.is_completed_today;
              const attrBadge = getAttributeBadge(quest.category);

              return (
                <article
                  key={quest.id}
                  className="bg-[#0a1020]/75 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/10 hover:bg-[#11182c]/85 hover:border-violet-500/40 hover:shadow-[0_8px_30px_rgba(139,92,246,0.18)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group shadow-md"
                >
                  <div className="flex items-center gap-4">
                    {/* Category Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-indigo-500/15 border border-violet-400/25 flex items-center justify-center text-violet-300 group-hover:scale-105 transition-transform shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className={`font-heading font-bold text-base ${isDone ? 'line-through text-slate-400 decoration-slate-400 decoration-2' : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]'}`}>
                        {quest.title}
                      </h3>
                      {quest.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {quest.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-slate-400 mt-1.5">
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${attrBadge.color}`}>
                          {attrBadge.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/5 text-slate-300 font-medium">{quest.category || 'General'}</span>
                        <span>•</span>
                        <span>{quest.duration || '40 min'}</span>
                        <span>•</span>
                        <span className="text-cyan-400 font-semibold">+{quest.xp_reward || 60} XP</span>
                        {quest.gold_reward && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">🪙 +{quest.gold_reward} Gold</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Timer, Complete, Edit & Delete */}
                  <div>
                    <QuestTimerWidget 
                      quest={quest} 
                      onEdit={(q) => {
                        setEditingQuest(q);
                        setModalOpen(true);
                      }}
                    />
                  </div>
                </article>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#0a1020]/75 backdrop-blur-xl border border-white/10 space-y-3">
              <p className="text-sm text-slate-400">No quests found under "{activeTab}".</p>
            </div>
          )}
        </section>

      </main>

      {/* Quest Modal */}
      <QuestModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingQuest(null);
        }}
        initialQuest={editingQuest}
      />
    </div>
  );
};
