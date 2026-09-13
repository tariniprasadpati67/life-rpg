import React from 'react';
import { 
  Code, 
  Dumbbell, 
  ShieldCheck, 
  BookOpen, 
  Sparkles 
} from 'lucide-react';

export const CharacterStats = ({ profile }) => {
  const intellect = typeof profile?.intellect === 'number' ? profile.intellect : (profile?.intellect?.xp ?? 0);
  const strength = typeof profile?.strength === 'number' ? profile.strength : (profile?.strength?.xp ?? 0);
  const discipline = typeof profile?.discipline === 'number' ? profile.discipline : 0;
  const knowledge = typeof profile?.knowledge === 'number' ? profile.knowledge : (profile?.knowledge?.xp ?? 0);
  const mind = typeof profile?.mind === 'number' ? profile.mind : (profile?.mind?.xp ?? 0);

  const stats = [
    {
      name: 'Intellect',
      value: intellect % 100,
      max: 100,
      icon: Code,
      iconBg: 'bg-[#0ea5e9]/20 text-[#38bdf8]',
      barColor: 'bg-[#0ea5e9]',
    },
    {
      name: 'Strength',
      value: strength % 100,
      max: 100,
      icon: Dumbbell,
      iconBg: 'bg-[#ef4444]/20 text-[#f87171]',
      barColor: 'bg-[#ef4444]',
    },
    {
      name: 'Discipline',
      value: discipline % 100,
      max: 100,
      icon: ShieldCheck,
      iconBg: 'bg-[#10b981]/20 text-[#34d399]',
      barColor: 'bg-[#10b981]',
    },
    {
      name: 'Knowledge',
      value: knowledge % 100,
      max: 100,
      icon: BookOpen,
      iconBg: 'bg-[#8b5cf6]/20 text-[#a78bfa]',
      barColor: 'bg-[#8b5cf6]',
    },
    {
      name: 'Mind',
      value: mind % 100,
      max: 100,
      icon: Sparkles,
      iconBg: 'bg-[#10b981]/20 text-[#34d399]',
      barColor: 'bg-[#10b981]',
    }
  ];

  return (
    <div className="rounded-2xl p-5 sm:p-6 border border-[#222d48] relative overflow-hidden shadow-xl group">
      {/* Demon Asta Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        style={{ backgroundImage: 'url("/asta-attributes-bg.png")' }}
      />
      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b101e]/85 via-[#0b101e]/65 to-[#0b101e]/85 pointer-events-none" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="font-heading font-bold text-base sm:text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          Character Stats
        </h3>
      </div>

      <div className="space-y-4 relative z-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const pct = Math.min(100, Math.round((stat.value / stat.max) * 100));

          return (
            <div key={stat.name} className="space-y-2 p-2 rounded-xl bg-[#0b101e]/60 backdrop-blur-sm border border-white/5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${stat.iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-slate-200">{stat.name}</span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {stat.value}/{stat.max}
                </span>
              </div>

              {/* Stat Progress Bar */}
              <div className="w-full h-2 rounded-full bg-[#182035] overflow-hidden">
                <div
                  className={`h-full ${stat.barColor} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
