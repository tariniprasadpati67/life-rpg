import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Check, 
  Edit3, 
  Camera,
  Shield,
  Crown
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Sidebar } from '../components/Sidebar';
import { AvatarModal } from '../components/AvatarModal';
import { AvatarFrame } from '../components/AvatarFrame';
import { BadgeGraphic } from '../components/BadgeGraphic';
import { soundFx } from '../lib/soundEffects';
import { getFrameStyle } from '../lib/cosmetics';
import { SEOHead } from '../components/SEOHead';

export const Profile = () => {
  const { profile, updateProfile } = useGame();

  const frameStyle = getFrameStyle(profile?.equipped_frame);

  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.username || 'Hero');

  const displayName = profile?.display_name || profile?.username || 'Hero';
  const currentLevel = profile?.current_level ?? 1;

  const handleSaveName = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      updateProfile({
        username: newName.trim(),
        display_name: newName.trim()
      });
      setIsEditingName(false);
    }
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
          title={`${displayName || 'Hero'} Profile`}
          description="Customize your hero avatar, title, and display identity in Life RPG."
          canonical="/profile"
        />
        
        {/* Profile Card with Landscape Banner matching Screen 8 */}
        <section aria-label="Hero Identity & Banner" className="bg-[#0a1020]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
          
          {/* Panoramic RPG Banner */}
          <div 
            className="h-44 sm:h-52 w-full bg-cover bg-center relative border-b border-white/10"
            style={{ backgroundImage: 'url("/home-bg.jpg")' }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#070b14]/50 to-[#0a1020]" />
            
            {/* Edit Profile Button at top right */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsEditingName(!isEditingName)}
                className="px-4 py-2 rounded-xl bg-[#0a1020]/75 hover:bg-[#0a1020] backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="px-6 pb-8 pt-0 relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            
            {/* Left: Avatar with Equipped Frame */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div 
                onClick={() => setAvatarModalOpen(true)}
                className="relative cursor-pointer group/avatar flex items-center justify-center"
                title="Change Avatar / Upload Photo"
              >
                {/* Equipped Frame Component with Rank Crest */}
                <AvatarFrame
                  frameName={profile?.equipped_frame}
                  avatarUrl={profile?.avatar_url}
                  auraName={profile?.equipped_aura}
                  orbitName={profile?.equipped_aura}
                  badgeName={profile?.equipped_badge || 'Novice Adventurer'}
                  equippedStreakShield={Boolean(profile?.equipped_streak_shield && (Number(profile?.streak_shields) || 0) > 0)}
                  size="lg"
                  alt={displayName}
                  className="group-hover/avatar:scale-105 transition-all duration-300"
                />
                <div 
                  className="absolute top-1 right-1 p-1.5 rounded-full bg-[#141c2e]/90 hover:bg-blue-600 text-slate-300 hover:text-white border border-white/20 shadow z-30 transition-all hover:scale-110"
                  title="Change Avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Name & Title */}
              <div className="space-y-1">
                {isEditingName ? (
                  <>
                    <h1 className="sr-only">Edit Hero Profile — {displayName}</h1>
                    <form onSubmit={handleSaveName} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="px-3 py-1 bg-[#141c2e] border border-blue-500 rounded-lg text-white text-sm font-bold focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-[#2b59ff] text-white text-xs font-bold rounded-lg"
                      >
                        Save
                      </button>
                    </form>
                  </>
                ) : (
                  <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
                    {displayName}
                  </h1>
                )}
                <div className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="text-blue-400 font-bold">{profile?.title || 'Explorer'}</span>
                  <span>•</span>
                  <span>Lv. {currentLevel}</span>
                </div>
              </div>
            </div>

            {/* Right: Stats Row (Streak, Gold, Diamonds) */}
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 sm:p-3 shadow-lg shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1 text-amber-400 font-heading font-bold text-xs sm:text-sm border-r border-white/10">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>{profile?.current_streak || 7} <span className="text-[10px] font-normal text-slate-400">Day Streak</span></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 text-amber-300 font-heading font-bold text-xs sm:text-sm border-r border-white/10">
                <span>🪙</span>
                <span>{profile?.gold ?? 850} <span className="text-[10px] font-normal text-slate-400">Gold</span></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 text-cyan-300 font-heading font-bold text-xs sm:text-sm">
                <span>💎</span>
                <span>{profile?.diamonds ?? 40} <span className="text-[10px] font-normal text-slate-400">Diamonds</span></span>
              </div>
            </div>

          </div>

          {/* Equipped Cosmetics Row & Quote Card */}
          <div className="p-6 sm:p-8 border-t border-white/10 bg-black/30 backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left 8 Cols: Equipped Cosmetics */}
            <div className="md:col-span-8 space-y-3">
              <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-400">
                Equipped Cosmetics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* Frame */}
                <div className="bg-white/[0.04] rounded-2xl p-3.5 border border-white/10 hover:border-violet-500/40 transition-all flex items-center gap-3 shadow-sm">
                  <div className={`w-10 h-10 rounded-full p-1 bg-gradient-to-tr ${frameStyle.gradient} flex items-center justify-center shrink-0 text-lg shadow-sm`}>
                    {frameStyle.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Avatar Frame</div>
                    <div className="font-heading font-bold text-xs text-white truncate">{frameStyle.name}</div>
                  </div>
                </div>

                {/* Badge */}
                <div className="bg-white/[0.04] rounded-2xl p-3.5 border border-white/10 hover:border-violet-500/40 transition-all flex items-center gap-3 shadow-sm">
                  <BadgeGraphic
                    badgeName={profile?.equipped_badge || 'Novice Adventurer'}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Badge</div>
                    <div className="font-heading font-bold text-xs text-white truncate">{profile?.equipped_badge || 'Novice Adventurer'}</div>
                  </div>
                </div>

                {/* Orbit */}
                <div className="bg-white/[0.04] rounded-2xl p-3.5 border border-white/10 hover:border-violet-500/40 transition-all flex items-center gap-3 shadow-sm">
                  <div className="w-10 h-10 rounded-full p-1 bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center shrink-0 text-lg shadow-sm">
                    🪐
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Avatar Orbit</div>
                    <div className="font-heading font-bold text-xs text-white truncate">
                      {profile?.equipped_aura || (profile?.equipped_streak_shield && (Number(profile?.streak_shields) || 0) > 0 ? 'Aegis Streak Shield Orbit' : 'None Equipped')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Motivational Motto Quote */}
            <div className="md:col-span-4 p-5 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-center space-y-1">
              <p className="font-heading font-extrabold text-white text-base sm:text-lg italic">
                “Discipline builds dreams.”
              </p>
              <p className="text-[11px] text-violet-300 font-semibold">
                Path of Continuous Ascendance
              </p>
            </div>

          </div>

        </section>

      </main>

      {/* Avatar Modal */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />
    </div>
  );
};
