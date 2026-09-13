import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, KeyRound, X, CheckCircle2, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { soundFx } from '../lib/soundEffects';
import { LoginCharacter } from '../components/LoginCharacter';
import { SEOHead } from '../components/SEOHead';

export const Login = () => {
  const { signIn, resetPassword, loginGuest } = useAuth();
  const { soundMuted, toggleSound } = useGame();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState(null);

  // Forgot password modal state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please provide all credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      soundFx.playClick();
      await signIn(identifier.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError(null);
    try {
      soundFx.playClick();
      await loginGuest();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Guest access sequence failed.');
    } finally {
      setGuestLoading(false);
    }
  };

  const handleOpenReset = () => {
    soundFx.playClick();
    setResetEmail(identifier.includes('@') ? identifier.trim() : '');
    setNewPassword('');
    setResetError(null);
    setResetSuccess(null);
    setIsResetOpen(true);
  };

  const handleCloseReset = () => {
    setIsResetOpen(false);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim() || !newPassword) {
      setResetError('Email and new password are required.');
      return;
    }
    if (newPassword.length < 6) {
      setResetError('Password must be at least 6 characters long.');
      return;
    }

    setResetLoading(true);
    setResetError(null);
    try {
      await resetPassword(resetEmail, newPassword);
      setResetSuccess('Password updated successfully! You can now log in with your new password.');
      setPassword(newPassword);
      if (!identifier) setIdentifier(resetEmail.trim());
    } catch (err) {
      setResetError(err.message || 'Failed to reset password.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#090d16] relative overflow-x-hidden overflow-y-auto">
      <SEOHead
        title="Sign In"
        description="Log in to Life RPG to continue your daily streak, complete habit quests, earn XP, and level up your real life."
        canonical="/login"
      />
      
      {/* Floating Sound Synthesizer Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-2xl border border-white/10 bg-[#101726]/80 backdrop-blur-md text-slate-400 hover:text-blue-400 transition-all shadow-xl"
          title={soundMuted ? "Unmute sound effects" : "Mute sound effects"}
          aria-label="Toggle Sound"
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
        </button>
      </div>

      {/* Background with Ambient Gradients */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/80 to-[#090d16]/40 pointer-events-none" />

      {/* Main Staging Wrapper: Animated Character + Split Login Card */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 w-full max-w-5xl z-10 relative">
        
        {/* Animated RPG Character Companion (Visible on Desktop / Large screens) */}
        <div className="hidden lg:flex items-center justify-center shrink-0">
          <LoginCharacter />
        </div>

        {/* Main Container */}
        <div className="w-full max-w-4xl bg-[#101726]/95 border border-[#1b253b] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10 animate-login-card">
          
          {/* Left Half: Art Banner + Brand + Floating Script Text (Desktop/Tablet Only) */}
          <div 
            className="hidden md:flex md:col-span-6 p-8 sm:p-10 relative flex-col justify-between min-h-[480px] bg-cover bg-center"
            style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
          >
            {/* Subtle gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-black/40 to-black/60" />

            {/* Top Brand with Crown Logo */}
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/app-logo.png" 
                  alt="Black Bulls Emblem" 
                  className="w-10 h-10 object-contain drop-shadow-[0_0_14px_rgba(245,158,11,0.8)]" 
                />
                <span className="font-heading font-black text-2xl text-white tracking-wide">
                  LIFE <span className="text-blue-400">RPG</span>
                </span>
              </div>
              <p className="text-xs text-blue-300/90 font-semibold tracking-wider uppercase">
                Beyond Your Limit
              </p>
            </div>

            {/* Middle/Bottom Floating Script Text */}
            <div className="relative z-10 my-auto py-6">
              <p className="font-serif italic text-3xl sm:text-4xl text-amber-300 drop-shadow-[0_0_20px_rgba(252,211,77,0.7)] font-black tracking-wide">
                Beyond Your Limit
              </p>
            </div>

            <div className="relative z-10 text-[11px] text-slate-400">
              © 2026 Life RPG. All rights reserved.
            </div>
          </div>

          {/* Right Half: Dark Glass Login Card */}
          <div className="col-span-12 md:col-span-6 p-6 sm:p-10 bg-[#0e1424] flex flex-col justify-center space-y-5">
            
            {/* Mobile Header with Logo (Mobile Only) */}
            <div className="md:hidden flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/app-logo.png" 
                  alt="Black Bulls Emblem" 
                  className="w-8 h-8 object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" 
                />
                <span className="font-heading font-black text-xl text-white tracking-wide">
                  LIFE <span className="text-blue-400">RPG</span>
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-400/90 tracking-wider uppercase">
                Beyond Your Limit
              </span>
            </div>

            {/* 1. Header (Staggered Entrance) */}
            <div className="space-y-1 animate-login-field-1">
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
                Welcome Back!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                Push beyond your limit • Continue your journey
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* 2. Email or Username (Staggered Entrance) */}
              <div className="space-y-1 animate-login-field-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Email or Username
                </label>
                <div className="relative group/input transition-transform duration-200 focus-within:scale-[1.01]">
                  <Mail className="w-4 h-4 text-slate-500 group-focus-within/input:text-blue-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. tariniprasadpati2023@gmail.com"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] hover:border-slate-600 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                </div>
              </div>

              {/* 3. Password (Staggered Entrance) */}
              <div className="space-y-1 animate-login-field-3">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative group/input transition-transform duration-200 focus-within:scale-[1.01]">
                  <Lock className="w-4 h-4 text-slate-500 group-focus-within/input:text-blue-400 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] hover:border-slate-600 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. Remember Me & Forgot Password Row (Staggered Entrance) */}
              <div className="flex items-center justify-between text-xs animate-login-field-4 pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white transition-colors select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#1e2a47] bg-[#141c2e] text-blue-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleOpenReset}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* 5. Login Button (Staggered Entrance Pop) */}
              <div className="animate-login-btn pt-1 space-y-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-heading font-bold text-sm text-white bg-gradient-to-r from-[#2b59ff] via-[#4f46e5] to-[#7c3aed] hover:from-blue-600 hover:to-purple-600 shadow-[0_4px_18px_rgba(43,89,255,0.4)] hover:shadow-[0_6px_24px_rgba(43,89,255,0.6)] transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Entering realm...' : 'Login'}
                </button>

                {/* Instant 1-Click Demo / Guest Pass */}
                <div className="relative flex items-center justify-center py-1">
                  <div className="border-t border-white/10 w-full" />
                  <span className="bg-[#0e1424] px-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
                    or explore now
                  </span>
                  <div className="border-t border-white/10 w-full" />
                </div>

                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={guestLoading || loading}
                  className="w-full py-2.5 rounded-xl font-heading font-semibold text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400/50 shadow-[0_2px_12px_rgba(245,158,11,0.15)] transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{guestLoading ? 'Summoning Demo Hero...' : '1-Click Guest Login / Demo Hero'}</span>
                </button>
              </div>

            </form>

            {/* 6. Footer Link (Staggered Entrance) */}
            <div className="pt-1 text-center text-xs text-slate-400 animate-login-footer">
              <span>Don't have an account? </span>
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                Sign Up
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Reset Password Modal */}
      {isResetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#101726] border border-[#1e2a47] rounded-3xl p-6 shadow-2xl relative space-y-5">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsResetOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-white">
                  Reset Password
                </h3>
                <p className="text-xs text-slate-400">
                  Set a new password for your Life RPG account
                </p>
              </div>
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            {resetSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold">
                  Account Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. tariniprasadpati2023@gmail.com"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-semibold">
                  New Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-[#141c2e] border border-[#1e2a47] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-2.5 rounded-xl font-heading font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_4px_14px_rgba(37,99,235,0.4)] transition-all disabled:opacity-50"
                >
                  {resetLoading ? 'Updating...' : 'Set New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};
