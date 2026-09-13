import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { soundFx } from '../lib/soundEffects';
import { SEOHead } from '../components/SEOHead';

export const Signup = () => {
  const { signUp } = useAuth();
  const { soundMuted, toggleSound } = useGame();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (fullName || email.split('@')[0]).trim();

    if (!cleanEmail || !password) {
      setError('Please provide email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      soundFx.playClick();
      await signUp(cleanEmail, password, cleanName);
      navigate('/dashboard');
    } catch (err) {
      let msg = err.message || 'Registration failed.';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        msg = 'An account with this email already exists. Please log in directly.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#090d16] relative overflow-hidden">
      <SEOHead
        title="Create Your Hero Account"
        description="Join Life RPG today. Gamify your daily routine, turn tasks into epic RPG quests, build streaks, and level up your life."
        canonical="/signup"
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

      {/* Ambient background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
        style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-[#090d16]/80 to-[#090d16]/40 pointer-events-none" />

      {/* Main Split Container */}
      <div className="w-full max-w-4xl bg-[#101726]/90 border border-[#1b253b] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative z-10">
        
        {/* Left Half: Art Banner + Brand */}
        <div 
          className="md:col-span-6 p-8 sm:p-10 relative flex flex-col justify-between min-h-[340px] md:min-h-[500px] bg-cover bg-center"
          style={{ backgroundImage: 'url("/hero-bg.jpg")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-black/40 to-black/60" />

          {/* Crown Logo */}
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

          {/* Floating Script */}
          <div className="relative z-10 my-auto py-6">
            <p className="font-serif italic text-3xl sm:text-4xl text-amber-300 drop-shadow-[0_0_20px_rgba(252,211,77,0.7)] font-black tracking-wide">
              Beyond Your Limit
            </p>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400">
            © 2026 Life RPG. All rights reserved.
          </div>
        </div>

        {/* Right Half: Sign Up Form */}
        <div className="md:col-span-6 p-8 sm:p-10 bg-[#0e1424] flex flex-col justify-center space-y-6">
          
          <div className="space-y-1.5">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
              Create Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Join thousands ascending daily routines.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Hero Name / Username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#141c2e] border border-[#1e2a47] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-heading font-bold text-sm text-white bg-gradient-to-r from-[#2b59ff] via-[#4f46e5] to-[#7c3aed] hover:from-blue-600 hover:to-purple-600 shadow-[0_4px_18px_rgba(43,89,255,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Initiating Campaign...' : 'Begin Journey'}
            </button>

          </form>

          <div className="pt-2 text-center text-xs text-slate-400">
            <span>Already have an account? </span>
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
              Login
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
};
