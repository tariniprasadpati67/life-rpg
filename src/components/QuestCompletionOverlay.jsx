import React from 'react';
import { Sparkles, Zap, Award } from 'lucide-react';

export const QuestCompletionOverlay = ({ effectName = 'Supernova XP Burst', onFinish }) => {
  if (!effectName) return null;

  const name = effectName.toLowerCase();
  const isSupernova = name.includes('supernova');
  const isPrismatic = name.includes('prismatic') || name.includes('gold');

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* 1. Subtle Dark Radial Backdrop that quickly dissolves */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-fade-out" style={{ animationDuration: '2.4s' }} />

      {/* 2. Visual Particle & Shockwave Container */}
      <div className="relative flex flex-col items-center justify-center select-none scale-100 animate-scale-up">
        
        {/* Shockwave Energy Ring */}
        <div 
          className={`w-64 h-64 rounded-full border-4 animate-ping opacity-75 ${
            isSupernova 
              ? 'border-cyan-400 shadow-[0_0_60px_rgba(6,182,212,0.8)]' 
              : 'border-amber-400 shadow-[0_0_60px_rgba(245,158,11,0.8)]'
          }`} 
          style={{ animationDuration: '1.2s' }}
        />

        {/* Center Burst Icon & Sparks */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`p-4 rounded-3xl border shadow-2xl animate-bounce ${
            isSupernova
              ? 'bg-[#0f172a]/90 border-cyan-400/50 text-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.6)]'
              : 'bg-[#18181b]/90 border-amber-400/50 text-amber-300 shadow-[0_0_40px_rgba(245,158,11,0.6)]'
          }`}>
            {isSupernova ? (
              <Zap className="w-12 h-12 stroke-[2.5] animate-pulse" />
            ) : (
              <Sparkles className="w-12 h-12 stroke-[2.5] animate-pulse" />
            )}
          </div>

          {/* Banner Tag */}
          <div className="mt-4 px-4 py-1 rounded-full bg-[#0c101b]/95 border border-white/20 text-white font-heading font-black text-sm tracking-wider uppercase shadow-xl">
            {effectName}
          </div>
          <div className="text-xs text-amber-300 font-semibold tracking-widest uppercase mt-1">
            QUEST CONQUERED!
          </div>
        </div>

        {/* Orbiting Starlight Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: `rotate(${deg}deg) translate(90px) rotate(-${deg}deg)`,
                backgroundColor: isSupernova ? (i % 2 === 0 ? '#38bdf8' : '#c084fc') : '#fef08a',
                boxShadow: isSupernova ? '0 0 12px #38bdf8' : '0 0 12px #fef08a'
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
