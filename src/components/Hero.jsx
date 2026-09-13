import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../lib/soundEffects';

export const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Background Anime Image - Crystal Clear and Vibrant */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url("/home-bg.jpg")' }}
      >
        {/* Minimal soft gradient overlay so anime art is 100% visible and vivid */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Main Content Area - Glassmorphic Hero Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10 w-full flex-grow flex items-center">
        <div className="max-w-xl p-6 sm:p-8 rounded-3xl bg-[#0b0e17]/70 backdrop-blur-md border border-white/15 shadow-[0_16px_50px_rgba(0,0,0,0.6)] space-y-6">
          
          {/* Overline Badge / Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-xs sm:text-sm font-bold tracking-widest uppercase text-cyan-300 font-sans shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-3.5 h-3.5" />
            LEVEL UP YOUR REAL LIFE
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white leading-[1.1]">
            TURN YOUR LIFE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#c084fc] drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">
              INTO A GAME.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed">
            Complete real-world quests. Earn XP. <br className="hidden sm:inline" />
            Build your streak. Level up your life.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => soundFx.playClick()}
                className="px-8 py-3.5 rounded-xl font-heading font-bold text-sm sm:text-base text-white bg-[#6d5df6] hover:bg-[#5b4ae3] shadow-[0_4px_25px_rgba(109,93,246,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
              >
                <span>CONTINUE JOURNEY</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  onClick={() => soundFx.playClick()}
                  className="px-8 py-3.5 rounded-xl font-heading font-bold text-sm sm:text-base text-white bg-[#6d5df6] hover:bg-[#5b4ae3] shadow-[0_4px_25px_rgba(109,93,246,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <span>START YOUR JOURNEY</span>
                </Link>

                <Link
                  to="/login"
                  onClick={() => soundFx.playClick()}
                  className="px-7 py-3.5 rounded-xl font-heading font-bold text-sm sm:text-base text-slate-200 bg-[#121829]/90 border border-slate-600/80 hover:bg-[#182035] hover:border-slate-400 transition-all flex items-center gap-2 backdrop-blur-md active:scale-95 shadow-lg"
                >
                  <span>LOGIN</span>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Features Strip with Translucent Frosted Glass */}
      <div className="relative z-10 border-t border-white/10 bg-[#0b0e17]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Feature 1: Earn XP */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-500/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                <Star className="w-5 h-5 fill-amber-400/30 text-amber-400" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white">
                  Earn XP
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Complete daily quests
                </p>
              </div>
            </div>

            {/* Feature 2: Build Streaks */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-500/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                <Shield className="w-5 h-5 fill-purple-400/20 text-purple-400" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white">
                  Build Streaks
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Stay consistent
                </p>
              </div>
            </div>

            {/* Feature 3: Level Up */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-white">
                  Level Up
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Unlock new rewards
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};
