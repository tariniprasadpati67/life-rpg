import React from 'react';
import { Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const FloatingXP = () => {
  const { floatingXPs } = useGame();

  if (!floatingXPs || floatingXPs.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {floatingXPs.map((item) => (
        <div
          key={item.id}
          className="absolute animate-floating-xp select-none"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
          }}
        >
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-cyan-950/90 border border-cyan-400 text-cyan-300 font-heading text-sm font-extrabold shadow-neon-cyan backdrop-blur-md">
            <Zap className="w-4 h-4 fill-cyan-400 text-cyan-400" />
            <span>+{item.xp} XP</span>
          </div>
        </div>
      ))}
    </div>
  );
};
