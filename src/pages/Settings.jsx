import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Eye, 
  EyeOff,
  Package, 
  HelpCircle, 
  LogOut, 
  Camera, 
  Lock, 
  Check, 
  Bell, 
  ShieldCheck, 
  Palette,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { AvatarModal } from '../components/AvatarModal';
import { AvatarFrame } from '../components/AvatarFrame';
import { soundFx } from '../lib/soundEffects';
import { getFrameStyle } from '../lib/cosmetics';
import { SEOHead } from '../components/SEOHead';

export const Settings = () => {
  const { profile, updateProfile } = useGame();
  const { signOut, token } = useAuth();
  const navigate = useNavigate();

  const frameStyle = getFrameStyle(profile?.equipped_frame);

  const [activeTab, setActiveTab] = useState('Account'); // 'Account' | 'Appearance' | 'Notifications' | 'Privacy'
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [username, setUsername] = useState(profile?.username || 'Hero');
  const [email, setEmail] = useState(profile?.email || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);
    soundFx.playClick();

    try {
      const activeToken = token || localStorage.getItem('rpg_auth_token') || (profile?.id ? `token-${profile.id}` : null);
      
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setPasswordSuccess(true);
      if (soundFx.playLevelUp) {
        soundFx.playLevelUp();
      } else {
        soundFx.playClick();
      }
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordChange(false);
        setPasswordSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Password update error:', err);
      setPasswordError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    soundFx.playClick();
    updateProfile({
      username: username,
      display_name: username,
      email: email
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = async () => {
    soundFx.playClick();
    await signOut();
    navigate('/login');
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
          title="Settings & Preferences"
          description="Configure your sound effects, notification preferences, and account security settings in Life RPG."
          canonical="/settings"
        />
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-heading font-black text-white drop-shadow">
            Settings
          </h1>
          <p className="text-xs text-slate-300">
            Manage your account settings, avatar, and app preferences.
          </p>
        </div>

        {/* Tabs: Account, Appearance, Notifications, Privacy matching Screen 9 */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a1020]/75 backdrop-blur-xl border border-white/10 w-fit shadow-lg">
          {['Account', 'Appearance', 'Notifications', 'Privacy'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab);
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-violet-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Main 2-Column Content: Account Settings Form (Left) & Quick Actions (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left: Account Settings Form matching Screen 9 */}
          <div className="md:col-span-8 bg-[#0a1020]/80 backdrop-blur-xl rounded-3xl p-6 sm:p-7 border border-white/10 shadow-2xl space-y-6">
            
            {/* Avatar & Change Photo */}
            <div className="flex items-center gap-4 pb-6 border-b border-[#1b253b]">
              <div 
                onClick={() => setAvatarModalOpen(true)}
                className="relative cursor-pointer group/avatar flex items-center justify-center shrink-0"
                title="Change Photo"
              >
                <AvatarFrame
                  frameName={profile?.equipped_frame}
                  avatarUrl={profile?.avatar_url}
                  auraName={profile?.equipped_aura}
                  orbitName={profile?.equipped_aura}
                  badgeName={profile?.equipped_badge}
                  equippedStreakShield={Boolean(profile?.equipped_streak_shield && (Number(profile?.streak_shields) || 0) > 0)}
                  size="md"
                  className="group-hover/avatar:scale-105 transition-all duration-300"
                />
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#2b59ff] text-white border-2 border-[#101726] shadow z-30">
                  <Camera className="w-3 h-3" />
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-white">
                  {profile?.username || 'Kunu'}
                </h3>
                <p className="text-xs text-slate-400">
                  {profile?.email || 'user@email.com'}
                </p>
                <button
                  onClick={() => setAvatarModalOpen(true)}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors mt-1 block"
                >
                  Change Photo
                </button>
              </div>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleSaveAccount} className="space-y-4">
              
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Password Section */}
              {!showPasswordChange ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      disabled
                      value="••••••••••••"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-slate-400 select-none cursor-not-allowed tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setShowPasswordChange(true);
                        setPasswordError('');
                        setPasswordSuccess(false);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#18233a] hover:bg-[#202e4d] border border-blue-500/40 text-blue-300 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Change</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#0c121e] border border-blue-500/40 space-y-3.5 shadow-xl transition-all">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1a243a]">
                    <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                      <KeyRound className="w-4 h-4 text-blue-400" />
                      <span>Change Password</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setShowPasswordChange(false);
                        setPasswordError('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>

                  {passwordError && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-400">
                      <Check className="w-4 h-4 shrink-0 stroke-[3]" />
                      <span>Password changed successfully!</span>
                    </div>
                  )}

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playClick();
                        setShowPasswordChange(false);
                        setPasswordError('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={passwordLoading}
                      onClick={handleUpdatePassword}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2b59ff] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_12px_rgba(43,89,255,0.4)] transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      {passwordLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-3 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#2b59ff] hover:bg-blue-600 shadow-[0_4px_16px_rgba(43,89,255,0.4)] transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Save Changes</span>
                </button>

                {savedSuccess && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Saved successfully!
                  </span>
                )}
              </div>

            </form>

          </div>

          {/* Right: Quick Actions */}
          <div className="md:col-span-4 bg-[#0a1020]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
            <h2 className="font-heading font-bold text-base text-white">
              Quick Actions
            </h2>

            <div className="space-y-2.5">
              
              {/* View Profile */}
              <Link
                to="/profile"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-violet-500/40 transition-all group shadow-sm"
              >
                <User className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">View Profile</span>
              </Link>

              {/* Inventory / Shop */}
              <Link
                to="/shop"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-amber-500/40 transition-all group shadow-sm"
              >
                <Package className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Inventory & Cosmetics</span>
              </Link>

              {/* Help & Support */}
              <button
                onClick={() => alert('Support available 24/7 at support@liferpg.app')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all text-left group shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold">Help & Support</span>
              </button>

              {/* Log Out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 transition-all text-left group shadow-sm"
              >
                <LogOut className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold">Log Out</span>
              </button>

            </div>
          </div>

        </div>

      </main>

      {/* Avatar Modal */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />
    </div>
  );
};
