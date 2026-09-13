import React from 'react';
import { X, Sparkles, Star } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const LevelUpModal = () => {
  const { profile, levelUpData, closeLevelUpModal } = useGame();

  if (!levelUpData) return null;

  const { newLevel = 6, xpGained = 180 } = levelUpData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Golden & Purple glow behind card */}
      <div className="absolute w-80 h-80 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute w-72 h-72 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Modal Card matching reference image */}
      <div className="w-full max-w-sm rounded-3xl bg-[#0e1424] border border-[#232e4d] p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl animate-level-up-modal">
        
        {/* Close 'X' Button */}
        <button
          onClick={closeLevelUpModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Victory Emote Banner & Animation (if equipped) */}
        {(() => {
          const emoteName = levelUpData.equipped_victory_emote || profile?.equipped_victory_emote;
          if (!emoteName) return null;
          const isPhoenix = emoteName.toLowerCase().includes('phoenix');

          return (
            <div className="mb-4 flex flex-col items-center">
              <div className={`px-3.5 py-1.5 rounded-full border text-xs font-heading font-black tracking-wide inline-flex items-center gap-2 shadow-lg animate-bounce ${
                isPhoenix 
                  ? 'bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-red-500/25 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-gradient-to-r from-blue-500/25 via-cyan-500/25 to-blue-500/25 border-blue-400 text-cyan-300 shadow-[0_0_20px_rgba(59,130,246,0.4)]'
              }`}>
                <span>{isPhoenix ? '🦅' : '⚔️'}</span>
                <span>{isPhoenix ? 'PHOENIX ASCENSION ACTIVATED!' : 'HONOR BLADES SALUTE ACTIVATED!'}</span>
              </div>

              {/* Animated Graphic Element */}
              <div className="w-20 h-20 my-1 relative flex items-center justify-center pointer-events-none">
                {isPhoenix ? (
                  <div className="w-full h-full filter drop-shadow-[0_0_20px_rgba(245,158,11,0.9)] animate-pulse">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-amber-300 stroke-2">
                      <path d="M50 18 Q28 32 12 24 Q32 60 50 86 Q68 60 88 24 Q72 32 50 18 Z" fill="url(#modalPhoenixGrad)" />
                      <defs>
                        <linearGradient id="modalPhoenixGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="50%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#dc2626" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                ) : (
                  <div className="w-full h-full filter drop-shadow-[0_0_20px_rgba(59,130,246,0.9)] animate-pulse">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <line x1="20" y1="20" x2="80" y2="80" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                      <line x1="80" y1="20" x2="20" y2="80" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
                      <circle cx="50" cy="50" r="10" fill="#2563eb" stroke="#60a5fa" strokeWidth="2" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Header: LEVEL UP! */}
        <div className="text-amber-400 font-heading font-black text-2xl tracking-wider mb-3 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]">
          LEVEL UP!
        </div>

        {/* Golden Wings / Laurel Shield Badge matching reference image */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="relative w-48 h-32 flex items-center justify-center">
            {/* Laurel wings & shield SVG */}
            <img
              src="/level-up-badge.svg"
              alt="Level Up Crest"
              className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            />
            {/* Big Level Number inside shield */}
            <div className="absolute inset-0 flex items-center justify-center pt-2">
              <span className="font-heading font-black text-4xl text-amber-300 drop-shadow-[0_0_8px_rgba(254,240,138,0.8)]">
                {newLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Level Name */}
        <div className="font-heading font-bold text-xl text-white mb-1">
          Level {newLevel}
        </div>

        {/* XP Bonus */}
        <div className="text-sm font-semibold text-amber-400 mb-6 flex items-center justify-center gap-1">
          <Star className="w-4 h-4 fill-amber-400" />
          <span>+{xpGained} XP</span>
        </div>

        {/* Continue Button matching reference image (purple) */}
        <button
          onClick={closeLevelUpModal}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-[#6d5df6] hover:bg-[#5b4ae3] shadow-[0_4px_16px_rgba(109,93,246,0.4)] active:scale-95 transition-all"
        >
          Continue
        </button>

      </div>
    </div>
  );
};
