import React from 'react';
import { X, Trophy, Flame } from 'lucide-react';

export const VictoryEmoteOverlay = ({ emoteName = 'Phoenix Ascension Emote', onClose = null }) => {
  if (!emoteName) return null;

  const name = emoteName.toLowerCase();
  const isPhoenix = name.includes('phoenix');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Glow aura behind card */}
      <div className={`absolute w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40 ${
        isPhoenix ? 'bg-amber-500' : 'bg-blue-600'
      }`} />

      {/* Modal Emote Container */}
      <div className="w-full max-w-sm rounded-3xl bg-[#0e1424] border border-[#232e4d] p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl animate-level-up-modal">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Emote Category Label */}
        <div className="text-[10px] font-rpg font-bold tracking-widest text-amber-400 uppercase mb-1">
          VICTORY EMOTE PREVIEW
        </div>

        <div className="font-heading font-black text-xl text-white mb-4">
          {emoteName}
        </div>

        {/* Dynamic Graphic */}
        <div className="relative my-6 flex flex-col items-center justify-center">
          {isPhoenix ? (
            <div className="relative flex flex-col items-center animate-bounce">
              {/* Phoenix SVG Illustration */}
              <div className="w-32 h-32 flex items-center justify-center filter drop-shadow-[0_0_24px_rgba(245,158,11,0.8)]">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-amber-400 stroke-2">
                  <path d="M50 20 Q30 35 15 25 Q35 60 50 85 Q65 60 85 25 Q70 35 50 20 Z" fill="url(#phoenixGrad)" />
                  <defs>
                    <linearGradient id="phoenixGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-heading font-bold text-sm mt-3">
                <Flame className="w-4 h-4 text-orange-400 animate-spin" />
                <span>PHOENIX ASCENSION</span>
              </div>
            </div>
          ) : (
            <div className="relative flex flex-col items-center animate-bounce">
              {/* Crossed Blades SVG */}
              <div className="w-32 h-32 flex items-center justify-center filter drop-shadow-[0_0_24px_rgba(59,130,246,0.8)]">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-blue-400 stroke-2">
                  <line x1="20" y1="20" x2="80" y2="80" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                  <line x1="80" y1="20" x2="20" y2="80" stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="10" fill="#3b82f6" />
                </svg>
              </div>
              <div className="flex items-center gap-1.5 text-blue-300 font-heading font-bold text-sm mt-3">
                <Trophy className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>KNIGHT HONOR SALUTE</span>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 mb-6">
          This celebration effect automatically activates during major milestones and character level-ups!
        </p>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-[#2b59ff] hover:bg-blue-600 transition-all active:scale-95"
          >
            Close Preview
          </button>
        )}
      </div>
    </div>
  );
};
