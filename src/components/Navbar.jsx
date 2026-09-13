import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  LogOut, 
  Sparkles,
  ChevronDown,
  Shield,
  Home,
  CheckSquare,
  User,
  ShoppingBag,
  Trophy,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { soundFx } from '../lib/soundEffects';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationDropdown } from './NotificationDropdown';
import { HowItWorksModal } from './HowItWorksModal';
import { getStreakFlameStyle } from '../lib/cosmetics';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { profile, soundMuted, toggleSound } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = () => {
    soundFx.playClick();
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    soundFx.playClick();
    await signOut();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Equipped streak flame
  const flameStyle = getStreakFlameStyle(profile?.equipped_streak_flame);
  const isHyperFlame = flameStyle?.id === 'flame-hyper';
  const isInfernoFlame = flameStyle?.id === 'flame-inferno';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#070b14]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        
        {/* Brand Logo with Crown */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-xl border border-[#1a233a] text-slate-300 hover:text-white shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link 
            to={user ? "/dashboard" : "/login"} 
            onClick={handleNavClick}
            className="flex items-center gap-1.5 sm:gap-2.5 group focus:outline-none shrink-0"
            aria-label="Life RPG"
          >
            <img 
              src="/app-logo.png" 
              alt="Life RPG Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.75)] group-hover:scale-105 transition-transform shrink-0" 
            />
            <span className="font-heading font-black text-sm sm:text-xl text-white tracking-wide whitespace-nowrap hidden min-[360px]:inline">
              LIFE <span className="text-blue-400">RPG</span>
            </span>
          </Link>
        </div>

        {/* Right Status Capsule: Streak, Gold, Diamonds, Notifications, Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {user && (
            <>
              {/* Streak Pill with Equipped Flame & Shield styling */}
              <Link
                to="/streak"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#141b2e] text-xs font-semibold transition-all shrink-0 ${
                  isHyperFlame 
                    ? 'border border-cyan-500/40 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.35)] hover:border-cyan-400' 
                    : isInfernoFlame
                      ? 'border border-red-500/40 text-red-300 shadow-[0_0_14px_rgba(239,68,68,0.35)] hover:border-red-400'
                      : 'border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)] hover:border-amber-500/60'
                }`}
                title={`Current Streak: ${profile?.current_streak || 7} Days`}
              >
                <Flame className={`w-3.5 h-3.5 animate-pulse ${
                  isHyperFlame 
                    ? 'fill-cyan-400 text-cyan-400' 
                    : isInfernoFlame
                      ? 'fill-red-500 text-red-500'
                      : 'fill-amber-400 text-amber-400'
                }`} />
                <span>{profile?.current_streak || 7} Day Streak</span>
              </Link>

              {/* Gold Pill */}
              <Link
                to="/shop"
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#141b2e] border border-amber-500/30 text-amber-300 text-[11px] sm:text-xs font-bold hover:border-amber-400/60 transition-colors shrink-0"
                title="Gold Balance"
              >
                <span className="text-amber-400 text-xs sm:text-sm">🪙</span>
                <span>{profile?.gold ?? 850}</span>
              </Link>

              {/* Diamonds Pill */}
              <Link
                to="/shop"
                className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#141b2e] border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-bold hover:border-cyan-400/60 transition-colors shrink-0"
                title="Diamonds Balance"
              >
                <span className="text-cyan-400 text-xs sm:text-sm">💎</span>
                <span>{profile?.diamonds ?? 40}</span>
              </Link>

              {/* Interactive RPG Notification Center */}
              <NotificationDropdown />
            </>
          )}

          {/* Sound Synthesizer Toggle (Desktop/Tablet - on mobile accessible in drawer) */}
          <button
            onClick={toggleSound}
            className="hidden sm:flex p-2 rounded-xl border border-[#1a233a] bg-[#141b2e] text-slate-400 hover:text-blue-400 transition-all shrink-0"
            aria-label={soundMuted ? "Unmute sound effects" : "Mute sound effects"}
            title={soundMuted ? "Audio Muted" : "SFX Active"}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>

          {user ? (
            /* Logged-in Character Dropdown */
            <ProfileDropdown />
          ) : (
            /* Public Auth Buttons */
            <div className="flex items-center gap-2.5">
              <Link
                to="/signup"
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#2b59ff] hover:bg-blue-600 shadow-[0_4px_14px_rgba(43,89,255,0.4)] transition-all"
              >
                Login
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#1e263d] bg-[#0c101d]/95 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-3 animate-fadeIn">
          <nav aria-label="Mobile Main Navigation" className="flex flex-col space-y-1.5 text-sm font-medium">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={handleNavClick}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive('/dashboard') || location.pathname === '/' 
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/quests"
                  onClick={handleNavClick}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive('/quests')
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 shrink-0" />
                  <span>Quests</span>
                </Link>

                <Link
                  to="/character"
                  onClick={handleNavClick}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive('/character')
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>Character</span>
                </Link>

                <Link
                  to="/streak"
                  onClick={handleNavClick}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                    isActive('/streak')
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Flame className={`w-4 h-4 shrink-0 animate-pulse ${
                      isHyperFlame ? 'text-cyan-400 fill-cyan-400' : isInfernoFlame ? 'text-red-500 fill-red-500' : 'text-amber-400 fill-amber-400'
                    }`} />
                    <span>Streak</span>
                  </div>
                  <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {profile?.current_streak || 7} Days
                  </span>
                </Link>

                <Link
                  to="/shop"
                  onClick={handleNavClick}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                    isActive('/shop')
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>Shop & Marketplace</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="text-amber-300">🪙 {profile?.gold ?? 850}</span>
                    <span className="text-cyan-300">💎 {profile?.diamonds ?? 40}</span>
                  </div>
                </Link>

                <Link
                  to="/leaderboard"
                  onClick={handleNavClick}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive('/leaderboard')
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Trophy className="w-4 h-4 shrink-0" />
                  <span>Leaderboard</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={handleNavClick}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive('/profile')
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <span>Hero Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={handleNavClick}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive('/settings')
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-md' 
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>Settings</span>
                </Link>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between px-3.5 py-2">
                  <span className="text-xs font-semibold text-slate-400">Game Audio / SFX</span>
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      toggleSound();
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-[#141b2e] text-xs font-semibold text-slate-200"
                  >
                    {soundMuted ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-rose-300">Muted</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-blue-300">Active</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full min-h-[44px] text-left px-3.5 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 transition-colors"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setMobileMenuOpen(false);
                    setHowItWorksOpen(true);
                  }}
                  className="w-full min-h-[44px] text-center py-2.5 rounded-xl border border-[#1e263d] text-slate-200 hover:bg-white/[0.06] transition-colors"
                >
                  How It Works
                </button>
                <Link
                  to="/login"
                  onClick={handleNavClick}
                  className="w-full min-h-[44px] flex items-center justify-center rounded-xl border border-[#1e263d] text-slate-200 hover:bg-white/[0.06] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={handleNavClick}
                  className="w-full min-h-[44px] flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-600/30"
                >
                  Start Journey
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* How It Works Guide Modal */}
      <HowItWorksModal
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />
    </header>
  );
};
