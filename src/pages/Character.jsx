import React, { useState } from 'react';
import { 
  Brain, 
  Dumbbell, 
  BookOpen, 
  Sparkles, 
  Shield, 
  Check, 
  Flame, 
  Crown,
  Award,
  Camera
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Sidebar } from '../components/Sidebar';
import { soundFx } from '../lib/soundEffects';
import { getFrameStyle } from '../lib/cosmetics';
import { getAttributeLevelAndXP } from '../lib/xpSystem';
import { AvatarModal } from '../components/AvatarModal';
import { AvatarFrame } from '../components/AvatarFrame';
import { BadgeGraphic } from '../components/BadgeGraphic';
import { SEOHead } from '../components/SEOHead';

export const Character = () => {
  const { profile } = useGame();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const frameStyle = getFrameStyle(profile?.equipped_frame);

  const currentLevel = profile?.current_level ?? 1;
  const currentXP = profile?.current_xp ?? 0;
  const requiredXP = profile?.requiredXP ?? 100;
  const xpPercentage = Math.min(100, Math.round((currentXP / requiredXP) * 100));

  const intellectData = getAttributeLevelAndXP(profile?.intellect);
  const strengthData = getAttributeLevelAndXP(profile?.strength);
  const knowledgeData = getAttributeLevelAndXP(profile?.knowledge);
  const mindData = getAttributeLevelAndXP(profile?.mind);

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
          title="Character Attributes & Level Progress"
          description="Check your hero level, attribute stats (Strength, Intellect, Mind, Knowledge), XP progression, and equipped gear."
          canonical="/character"
        />
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Character
          </h1>
          <p className="text-xs text-slate-300">
            View your hero statistics, attributes, and equipped cosmetics.
          </p>
        </div>

        {/* Top 2 Cards: Hero Avatar Card (Left) & Attributes Card (Right) */}
        <section aria-label="Hero Overview & Attributes" className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Left Avatar Showcase Card */}
          <div className="md:col-span-5 bg-[#0a1020]/75 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-violet-500/40 flex flex-col items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all duration-500">
            {/* Ambient flame glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-violet-950/20 pointer-events-none" />
            <div className="absolute -top-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Ornamental Frame with Equipped Style */}
            <div 
              onClick={() => {
                soundFx.playClick();
                setAvatarModalOpen(true);
              }}
              className="relative mt-3 z-10 cursor-pointer group/avatar"
              title="Click to Change Profile Picture (DP)"
            >
              <AvatarFrame
                frameName={profile?.equipped_frame}
                avatarUrl={profile?.avatar_url}
                auraName={profile?.equipped_aura}
                orbitName={profile?.equipped_aura}
                badgeName={profile?.equipped_badge || 'Novice Adventurer'}
                equippedStreakShield={Boolean(profile?.equipped_streak_shield && (Number(profile?.streak_shields) || 0) > 0)}
                size="xl"
                className="group-hover/avatar:scale-105 transition-all duration-300 drop-shadow-[0_0_25px_rgba(245,158,11,0.3)]"
              />

              {/* Floating Camera Edit Chip at Top-Right */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  setAvatarModalOpen(true);
                }}
                className="absolute top-2 right-2 p-2 rounded-full bg-violet-600/90 hover:bg-violet-500 text-white shadow-xl border border-white/20 hover:scale-110 active:scale-95 transition-all z-30 backdrop-blur-sm"
                title="Change Profile Picture (DP)"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Level & Explorer with Change DP pill */}
            <div className="text-center mt-4 space-y-2 z-10">
              <div className="font-heading font-black text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Lv. {currentLevel}
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#16203a]/90 backdrop-blur-md border border-indigo-400/30 text-indigo-300 text-xs font-semibold shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                  {profile?.title || 'Explorer'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setAvatarModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 hover:bg-violet-600/35 border border-violet-500/40 text-violet-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change DP</span>
                </button>
              </div>
            </div>

            {/* XP Progress */}
            <div className="w-full mt-6 space-y-1.5 z-10">
              <div className="flex justify-between text-xs font-semibold text-slate-200">
                <span>XP</span>
                <span className="text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">{currentXP} / {requiredXP} XP</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/40 backdrop-blur-sm overflow-hidden p-0.5 border border-white/10 shadow-inner">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>

            {/* Quote at bottom of left card */}
            <div className="mt-6 pt-4 border-t border-white/10 w-full text-center z-10">
              <p className="text-xs text-slate-300 italic font-medium">
                “Your potential is limitless.”
              </p>
            </div>
          </div>

          {/* Right Attributes Card with Demon Asta Background */}
          <div className="md:col-span-7 bg-[#0a1020]/75 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-red-500/30 flex flex-col justify-between shadow-[0_12px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all duration-500">
            {/* Demon Asta Background */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 pointer-events-none opacity-25"
              style={{ backgroundImage: 'url("/asta-attributes-bg.png")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1020]/90 via-[#0a1020]/70 to-[#0a1020]/90 pointer-events-none" />

            <div className="space-y-1 relative z-10">
              <h2 className="font-heading font-bold text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Attributes
              </h2>
              <p className="text-xs text-slate-300">
                Points are automatically earned upon quest completion.
              </p>
            </div>

            <div className="space-y-4 my-auto py-4 relative z-10">
              {attributes.map((attr) => {
                const Icon = attr.icon;
                const pct = Math.min(100, Math.round((attr.xp / attr.maxXP) * 100));

                return (
                  <div key={attr.name} className="space-y-2 p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/5 hover:border-white/15 transition-all">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${attr.bgColor} shadow-sm`}>
                          <Icon className={`w-4 h-4 ${attr.textColor}`} />
                        </div>
                        <span className="font-heading font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{attr.name}</span>
                        <span className="text-[11px] font-bold text-slate-300">Lv. {attr.level}</span>
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-300">
                        {attr.xp} / {attr.maxXP}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2.5 rounded-full bg-black/50 overflow-hidden border border-white/5 shadow-inner">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${attr.color} transition-all duration-500 shadow-sm`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 relative z-10">
              <span>Next Attribute Boost in:</span>
              <span className="text-cyan-300 font-semibold">1 Quest</span>
            </div>
          </div>

        </section>

        {/* Bottom Equipped Cosmetics Strip */}
        <section aria-labelledby="equipped-cosmetics-heading" className="bg-[#0a1020]/75 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="equipped-cosmetics-heading" className="font-heading font-bold text-base text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Equipped Cosmetics
            </h2>
            <span className="text-xs text-slate-300">Manage via Shop</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Item 1: Avatar Frame */}
            <div className="bg-white/[0.04] rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full p-1 bg-gradient-to-tr ${frameStyle.gradient} flex items-center justify-center shrink-0 text-xl shadow-md`}>
                {frameStyle.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase font-bold text-slate-300">Avatar Frame</div>
                <div className="font-heading font-bold text-sm text-white truncate">{frameStyle.name}</div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" /> Equipped
                </span>
              </div>
            </div>

            {/* Item 2: Badge */}
            <div className="bg-white/[0.04] rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all flex items-center gap-4">
              <BadgeGraphic
                badgeName={profile?.equipped_badge || 'Novice Adventurer'}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase font-bold text-slate-300">Badge</div>
                <div className="font-heading font-bold text-sm text-white truncate">{profile?.equipped_badge || 'Novice Adventurer'}</div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" /> Equipped
                </span>
              </div>
            </div>

            {/* Item 3: Avatar Orbit & Relic */}
            <div className="bg-white/[0.04] rounded-2xl p-4 border border-white/10 hover:border-violet-500/30 transition-all flex items-center gap-4">
              <div className="w-12 h-12 rounded-full p-1 bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 text-xl shadow-md shadow-violet-600/30">
                🪐
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase font-bold text-slate-300">Avatar Orbit</div>
                <div className="font-heading font-bold text-sm text-white truncate">
                  {profile?.equipped_aura || (profile?.equipped_streak_shield && (Number(profile?.streak_shields) || 0) > 0 ? 'Aegis Streak Shield Orbit' : 'None Equipped')}
                </div>
                {Boolean(profile?.equipped_aura || (profile?.equipped_streak_shield && (Number(profile?.streak_shields) || 0) > 0)) ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" /> Active Orbit
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 mt-0.5">
                    Equip via Shop
                  </span>
                )}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Avatar Change Modal */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />
    </div>
  );
};
