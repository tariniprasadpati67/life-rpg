import React from 'react';
import { 
  Code, 
  Dumbbell, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Star
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Sidebar } from '../components/Sidebar';
import { CharacterStats } from '../components/CharacterStats';

export const Progress = () => {
  const { profile, recentCompletions } = useGame();

  const currentLevel = profile?.current_level ?? 5;
  const currentXP = profile?.current_xp ?? 820;
  const requiredXP = profile?.requiredXP ?? 1000;
  const progressPercent = Math.min(100, Math.round((currentXP / requiredXP) * 100));
  const nextLevelXP = Math.max(0, requiredXP - currentXP);

  // Sample activities matching reference screenshot if recent completions is empty
  const defaultActivities = [
    { id: 'act-1', title: 'Study JavaScript', time: 'Just now', xp: 100, icon: Code, color: 'text-cyan-400 bg-cyan-500/15' },
    { id: 'act-2', title: 'Workout', time: '2 hours ago', xp: 80, icon: Dumbbell, color: 'text-red-400 bg-red-500/15' },
    { id: 'act-3', title: 'Read 20 Pages', time: '5 hours ago', xp: 60, icon: BookOpen, color: 'text-amber-400 bg-amber-500/15' },
    { id: 'act-4', title: 'Meditation', time: '1 day ago', xp: 70, icon: Sparkles, color: 'text-purple-400 bg-purple-500/15' }
  ];

  const activities = recentCompletions.length > 0 
    ? recentCompletions.map(c => ({
        id: c.id,
        title: c.quests?.title || 'Completed Quest',
        time: c.completion_date || 'Recent',
        xp: c.xp_awarded || 50,
        icon: CheckCircle2,
        color: 'text-emerald-400 bg-emerald-500/15'
      }))
    : defaultActivities;

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

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto space-y-6 relative z-10">
        
        {/* Top Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-black text-white drop-shadow">
            Progress & Attributes
          </h1>
          <p className="text-xs text-slate-300">
            Track your overall RPG progression, character statistics, and recent activity.
          </p>
        </div>

        {/* 1. Overall Progress Card matching reference image */}
        <div className="bg-[#0a1020]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xs text-slate-400 uppercase tracking-wider">
              Overall Progress
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left 8 Cols: Level & Bar */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-baseline justify-between">
                <div className="font-heading font-black text-2xl sm:text-3xl text-white">
                  Level {currentLevel}
                </div>
                <div className="text-sm font-semibold text-slate-300">
                  {currentXP} / {requiredXP} XP
                </div>
              </div>

              {/* Big Vibrant Purple-Blue Progress Bar */}
              <div className="w-full h-4 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-400 shadow-[0_0_15px_rgba(124,58,237,0.6)] transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="text-xs text-slate-400">
                Next level: {nextLevelXP} XP
              </div>
            </div>

            {/* Right 4 Cols: XP Required & Progress % */}
            <div className="md:col-span-4 flex items-center justify-around md:border-l md:border-white/10 md:pl-6 py-2">
              <div className="text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold mb-0.5">
                  XP Required
                </div>
                <div className="font-heading font-black text-2xl text-white">
                  {requiredXP.toLocaleString()}
                </div>
              </div>

              <div className="text-center">
                <div className="text-[11px] text-slate-400 uppercase font-semibold mb-0.5">
                  Progress
                </div>
                <div className="font-heading font-black text-2xl text-cyan-400">
                  {progressPercent}%
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2 Columns: Attributes (Left) and Recent Activity (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Attributes Panel */}
          <div className="lg:col-span-6">
            <CharacterStats profile={profile} />
          </div>

          {/* Recent Activity Panel */}
          <div className="lg:col-span-6 bg-[#0a1020]/80 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                Recent Activity
              </h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3">
              {activities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-violet-500/40 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${act.color} border border-white/10 shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-heading font-bold text-sm text-white">
                          {act.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {act.time}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>+{act.xp} XP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};
