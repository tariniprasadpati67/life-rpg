import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Home, 
  CheckSquare, 
  BarChart3, 
  LogOut, 
  Volume2, 
  VolumeX, 
  Edit2, 
  Check, 
  X, 
  Flame, 
  Star, 
  Camera,
  User,
  Shield,
  ShoppingBag,
  Trophy,
  Settings 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { soundFx } from '../lib/soundEffects';
import { AvatarModal } from './AvatarModal';
import { AvatarFrame } from './AvatarFrame';
import { getFrameStyle } from '../lib/cosmetics';

export const ProfileDropdown = () => {
  const { user, signOut } = useAuth();
  const { profile, soundMuted, toggleSound, fetchGameData } = useGame();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Alex';
  const avatarUrl = profile?.avatar_url || '/avatar-alex.jpg';
  const frameStyle = getFrameStyle(profile?.equipped_frame);
  const currentLevel = profile?.current_level ?? 5;
  const streakDays = profile?.current_streak ?? 7;
  const totalXP = profile?.total_xp ?? 1820;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsEditingName(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    soundFx.playClick();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setNewName(displayName);
    }
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setSaving(true);
    try {
      soundFx.playClick();
      // Update in localStorage
      const savedUser = localStorage.getItem('rpg_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        parsed.user_metadata = { ...parsed.user_metadata, display_name: newName.trim() };
        localStorage.setItem('rpg_auth_user', JSON.stringify(parsed));
      }

      // Update on server
      await fetch('/api/progress/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('rpg_auth_token') || 'demo-user-123'}`
        },
        body: JSON.stringify({ display_name: newName.trim() })
      });

      await fetchGameData();
      setIsEditingName(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    soundFx.playClick();
    setIsOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        {/* Clickable Profile Pill */}
        <button
          onClick={handleToggle}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#111625] hover:bg-[#161d30] border border-[#1e263d] hover:border-purple-500/50 transition-all focus:outline-none cursor-pointer group shadow-sm active:scale-95"
          aria-label="User menu"
          aria-expanded={isOpen}
        >
          <div className="relative flex items-center justify-center">
            <AvatarFrame
              frameName={profile?.equipped_frame}
              avatarUrl={avatarUrl}
              auraName={profile?.equipped_aura}
              orbitName={profile?.equipped_aura}
              equippedStreakShield={Boolean(profile?.equipped_streak_shield && (Number(profile?.streak_shields) || 0) > 0)}
              size="sm"
              alt={displayName}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#111625] z-30" />
          </div>

          <span className="text-xs font-semibold text-white max-w-[120px] truncate text-left">
            {displayName}
          </span>

          <ChevronDown 
            className={`w-3.5 h-3.5 text-slate-400 group-hover:text-purple-300 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-purple-400' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#0e1424] border border-[#232e4d] shadow-[0_10px_35px_rgba(0,0,0,0.7)] py-3 z-50 animate-fadeIn space-y-3">
            
            {/* Header Card */}
            <div className="px-4 pb-3 border-b border-[#1e263d] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="relative group/avatar cursor-pointer flex items-center justify-center" 
                    onClick={() => {
                      setIsOpen(false);
                      setAvatarModalOpen(true);
                    }}
                    title="Click to Change Photo / DP"
                  >
                    <AvatarFrame
                      frameName={profile?.equipped_frame}
                      avatarUrl={avatarUrl}
                      auraName={profile?.equipped_aura}
                      orbitName={profile?.equipped_aura}
                      equippedStreakShield={Boolean(profile?.equipped_streak_shield && (Number(profile?.streak_shields) || 0) > 0)}
                      size="sm"
                      alt={displayName}
                      className="group-hover/avatar:scale-105 transition-all"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity z-30">
                      <Camera className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    {isEditingName ? (
                      <form onSubmit={handleSaveName} className="flex items-center gap-1.5 mt-1">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="New codename"
                          className="w-28 px-2 py-0.5 rounded-lg bg-[#0b0e17] border border-purple-500 text-xs text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={saving}
                          className="p-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white"
                          title="Save name"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingName(false)}
                          className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <div className="font-heading font-bold text-sm text-white truncate max-w-[120px]">
                          {displayName}
                        </div>
                        <button
                          onClick={() => {
                            setNewName(displayName);
                            setIsEditingName(true);
                          }}
                          className="text-slate-500 hover:text-purple-300 p-0.5"
                          title="Edit display name"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setAvatarModalOpen(true);
                      }}
                      className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 mt-0.5"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Change DP Photo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats Strip */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-[#0b0e17] border border-[#1e263d] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase">Streak</div>
                    <div className="font-bold text-xs text-white">{streakDays} Days</div>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-[#0b0e17] border border-[#1e263d] flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <div>
                    <div className="text-[9px] text-slate-400 uppercase">Total XP</div>
                    <div className="font-bold text-xs text-white">{totalXP.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav Items */}
            <div className="px-2 space-y-1 text-xs font-medium">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setAvatarModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-purple-300 hover:text-white hover:bg-[#161d30] transition-colors text-left font-semibold"
              >
                <Camera className="w-4 h-4 text-purple-400" />
                <span>Upload Custom Photo / DP</span>
              </button>

              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#161d30] transition-colors"
              >
                <Home className="w-4 h-4 text-blue-400" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#161d30] transition-colors"
              >
                <User className="w-4 h-4 text-purple-400" />
                <span>My Profile</span>
              </Link>

              <Link
                to="/quests"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#161d30] transition-colors"
              >
                <CheckSquare className="w-4 h-4 text-cyan-400" />
                <span>Quests Log</span>
              </Link>

              <Link
                to="/character"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#161d30] transition-colors"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Character & Attributes</span>
              </Link>

              <Link
                to="/streak"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#161d30] transition-colors"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Streak Matrix</span>
              </Link>

              <Link
                to="/shop"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#161d30] transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-amber-300" />
                <span>Shop & Cosmetics</span>
              </Link>

              <Link
                to="/leaderboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#161d30] transition-colors"
              >
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>Leaderboard</span>
              </Link>

              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#161d30] transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Settings</span>
              </Link>

              {/* Audio Toggle */}
              <button
                onClick={toggleSound}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#161d30] transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                  <span>Sound FX Audio</span>
                </div>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${soundMuted ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                  {soundMuted ? 'OFF' : 'ON'}
                </span>
              </button>
            </div>

            {/* Footer: Sign Out */}
            <div className="pt-2 px-2 border-t border-[#1e263d]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-medium text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out / Exit Session</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* DP Avatar Upload Modal */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />
    </>
  );
};
