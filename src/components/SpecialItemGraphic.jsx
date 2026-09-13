import React from 'react';

/**
 * SpecialItemGraphic
 * Premium 3D RPG artwork component for the 5 Special Items:
 * - Streak Shield (Aegis Artifact)
 * - Avatar Aura (Cosmic Void & Kinetic Pulse)
 * - Completion Effect (Supernova & Prismatic Nova)
 * - Victory Emote (Phoenix Ascension & Honor Blades)
 * - Streak Flame (Hyperdrive Plasma & Dragonfire Blaze)
 */
export const SpecialItemGraphic = ({ itemId = '', itemName = '', size = 'lg', className = '' }) => {
  const id = (itemId || '').toLowerCase();
  const name = (itemName || '').toLowerCase();

  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36'
  };

  const containerSize = sizeMap[size] || sizeMap.lg;

  // 1. STREAK SHIELD (3D Aegis Shield Artifact)
  if (id.includes('shield') || name.includes('shield')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
        <div className="absolute inset-2 rounded-full bg-cyan-500/30 blur-md animate-pulse pointer-events-none" />
        <img
          src="/items/item-shield.png"
          alt="Streak Shield"
          className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(6,182,212,0.65)] hover:scale-105 transition-transform duration-300 relative z-10"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 2. ASTRAL VOID AURA (3D Celestial Nebula Orb)
  if (id.includes('aura-cosmic') || name.includes('astral') || name.includes('void')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
        <div className="absolute inset-2 rounded-full bg-purple-600/35 blur-md animate-pulse pointer-events-none" />
        <img
          src="/items/item-aura.png"
          alt="Astral Void Aura"
          className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(168,85,247,0.65)] hover:scale-105 transition-transform duration-300 relative z-10"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 3. KINETIC PULSE AURA (High-Tech Holographic Energy Core)
  if (id.includes('aura-energy') || name.includes('kinetic')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
        <div className="absolute inset-2 rounded-full bg-cyan-500/25 blur-lg animate-pulse" />
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_18px_rgba(6,182,212,0.75)] relative z-10">
          <defs>
            <linearGradient id="kineticCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
            <radialGradient id="plasmaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>
          {/* Outer Gyroscope Rings */}
          <circle cx="60" cy="60" r="52" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="14 8 4 8" opacity="0.8" className="animate-spin-slow" style={{ transformOrigin: '60px 60px' }} />
          <circle cx="60" cy="60" r="44" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="20 10" opacity="0.9" className="animate-spin-reverse" style={{ transformOrigin: '60px 60px' }} />
          {/* Hexagonal Armor Brackets */}
          <polygon points="60,22 88,38 88,72 60,88 32,72 32,38" fill="url(#kineticCoreGrad)" stroke="#38bdf8" strokeWidth="2" />
          {/* Glowing Plasma Sphere */}
          <circle cx="60" cy="60" r="18" fill="url(#plasmaGlow)" className="animate-pulse" />
          <circle cx="60" cy="60" r="8" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // 4. SUPERNOVA XP BURST (Exploding Celestial Nova Star)
  if (id.includes('supernova') || name.includes('supernova')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
        <div className="absolute inset-1 rounded-full bg-cyan-500/30 blur-xl animate-pulse" />
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_22px_rgba(56,189,248,0.85)] relative z-10">
          <defs>
            <radialGradient id="supernovaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="beamCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          {/* Radiating Shockwave Beams */}
          <g className="animate-spin-slow" style={{ transformOrigin: '60px 60px' }}>
            <polygon points="60,4 64,54 60,60 56,54" fill="url(#beamCyan)" />
            <polygon points="60,116 64,66 60,60 56,66" fill="url(#beamCyan)" />
            <polygon points="4,60 54,56 60,60 54,64" fill="url(#beamCyan)" />
            <polygon points="116,60 66,56 60,60 66,64" fill="url(#beamCyan)" />
            <polygon points="20,20 54,54 60,60 54,60" fill="url(#beamCyan)" opacity="0.8" />
            <polygon points="100,100 66,66 60,60 66,60" fill="url(#beamCyan)" opacity="0.8" />
            <polygon points="100,20 66,54 60,60 60,54" fill="url(#beamCyan)" opacity="0.8" />
            <polygon points="20,100 54,66 60,60 60,66" fill="url(#beamCyan)" opacity="0.8" />
          </g>
          {/* Shockwave Rings */}
          <circle cx="60" cy="60" r="38" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 6 3 6" opacity="0.8" />
          {/* Blazing Core */}
          <circle cx="60" cy="60" r="22" fill="url(#supernovaGrad)" className="animate-pulse" />
          <circle cx="60" cy="60" r="10" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // 5. PRISMATIC XP NOVA (Golden Starburst & Radiant Crystals)
  if (id.includes('prismatic') || name.includes('prismatic') || name.includes('xpburst')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
        <div className="absolute inset-1 rounded-full bg-amber-500/30 blur-xl animate-pulse" />
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_20px_rgba(245,158,11,0.85)] relative z-10">
          <defs>
            <radialGradient id="prismaticGoldGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="goldSpikeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          {/* 8-Point Diamond Star Crystal */}
          <g className="animate-pulse">
            <polygon points="60,8 68,48 108,48 76,70 88,110 60,84 32,110 44,70 12,48 52,48" fill="url(#goldSpikeGrad)" stroke="#fef08a" strokeWidth="1.5" />
          </g>
          {/* Inner Facet Lines */}
          <circle cx="60" cy="60" r="18" fill="url(#prismaticGoldGrad)" />
          <circle cx="60" cy="60" r="8" fill="#ffffff" />
          {/* Orbiting Emerald Shards */}
          <polygon points="26,26 32,20 30,30" fill="#10b981" />
          <polygon points="94,26 100,20 98,30" fill="#10b981" />
          <polygon points="26,94 32,100 30,90" fill="#10b981" />
          <polygon points="94,94 100,100 98,90" fill="#10b981" />
        </svg>
      </div>
    );
  }

  // 6. PHOENIX ASCENSION EMOTE (3D Flaming Golden Phoenix)
  if (id.includes('phoenix') || name.includes('phoenix')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
        <div className="absolute inset-1 rounded-full bg-orange-500/30 blur-xl animate-pulse" />
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_22px_rgba(249,115,22,0.85)] relative z-10">
          <defs>
            <linearGradient id="phoenixWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#fbbf24" />
              <stop offset="70%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <radialGradient id="phoenixEyeGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
          </defs>
          {/* Phoenix Wings Upward Unfurled */}
          <path
            d="M60,18 C72,28 92,26 106,12 C104,32 94,54 82,68 C74,76 66,88 60,106 C54,88 46,76 38,68 C26,54 16,32 14,12 C28,26 48,28 60,18 Z"
            fill="url(#phoenixWingGrad)"
            stroke="#fef08a"
            strokeWidth="1.8"
            className="animate-pulse"
          />
          {/* Inner Wing Feathers */}
          <path d="M60,34 C70,44 84,46 94,36 C88,54 78,68 60,86 C42,68 32,54 26,36 C36,46 50,44 60,34 Z" fill="#b91c1c" opacity="0.6" />
          {/* Phoenix Head Crest */}
          <polygon points="60,20 64,36 60,40 56,36" fill="#fef08a" />
          <circle cx="60" cy="42" r="7" fill="url(#phoenixEyeGrad)" />
          {/* Floating Embers */}
          <circle cx="60" cy="8" r="2.5" fill="#fef08a" className="animate-bounce" />
          <circle cx="38" cy="22" r="2" fill="#fbbf24" />
          <circle cx="82" cy="22" r="2" fill="#fbbf24" />
        </svg>
      </div>
    );
  }

  // 7. HONOR BLADES SALUTE (Twin Crossed Enchanted Swords)
  if (id.includes('blade') || name.includes('blade') || name.includes('salute') || name.includes('champion')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
        <div className="absolute inset-1 rounded-full bg-blue-600/30 blur-xl animate-pulse" />
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_20px_rgba(59,130,246,0.85)] relative z-10">
          <defs>
            <linearGradient id="bladeSteelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#93c5fd" />
              <stop offset="70%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="bladeGoldHilt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>
          {/* Sword 1: Top-Left to Bottom-Right */}
          <g transform="translate(60,60) rotate(-45) translate(-60,-60)">
            <polygon points="57,12 60,6 63,12 63,80 57,80" fill="url(#bladeSteelGrad)" stroke="#60a5fa" strokeWidth="1" />
            <line x1="60" y1="10" x2="60" y2="78" stroke="#ffffff" strokeWidth="1.2" />
            {/* Crossguard & Pommel */}
            <rect x="46" y="80" width="28" height="6" rx="2" fill="url(#bladeGoldHilt)" stroke="#78350f" strokeWidth="1" />
            <rect x="57" y="86" width="6" height="18" rx="1" fill="#475569" />
            <circle cx="60" cy="108" r="5" fill="url(#bladeGoldHilt)" />
          </g>
          {/* Sword 2: Top-Right to Bottom-Left */}
          <g transform="translate(60,60) rotate(45) translate(-60,-60)">
            <polygon points="57,12 60,6 63,12 63,80 57,80" fill="url(#bladeSteelGrad)" stroke="#60a5fa" strokeWidth="1" />
            <line x1="60" y1="10" x2="60" y2="78" stroke="#ffffff" strokeWidth="1.2" />
            {/* Crossguard & Pommel */}
            <rect x="46" y="80" width="28" height="6" rx="2" fill="url(#bladeGoldHilt)" stroke="#78350f" strokeWidth="1" />
            <rect x="57" y="86" width="6" height="18" rx="1" fill="#475569" />
            <circle cx="60" cy="108" r="5" fill="url(#bladeGoldHilt)" />
          </g>
          {/* Center Energy Spark */}
          <circle cx="60" cy="60" r="7" fill="#60a5fa" className="animate-ping" />
          <circle cx="60" cy="60" r="4" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // 8. HYPERDRIVE BLUE FLAME (Plasma Ionic Fireball)
  if (id.includes('flame-hyper') || name.includes('hyper') || name.includes('blue')) {
    return (
      <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
        <div className="absolute inset-1 rounded-full bg-cyan-500/35 blur-xl animate-pulse" />
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_24px_rgba(6,182,212,0.9)] relative z-10">
          <defs>
            <linearGradient id="hyperFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
            <radialGradient id="plasmaHeart" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>
          </defs>
          {/* Outer Cobalt Fire Shape */}
          <path
            d="M60,10 C66,24 88,40 88,68 C88,88 74,106 60,106 C46,106 32,88 32,68 C32,46 52,28 60,10 Z"
            fill="url(#hyperFlameGrad)"
            stroke="#38bdf8"
            strokeWidth="2"
            className="animate-pulse"
          />
          {/* Middle Cyan Flame Tongue */}
          <path
            d="M60,28 C64,38 78,50 78,72 C78,86 70,98 60,98 C50,98 42,86 42,72 C42,56 54,42 60,28 Z"
            fill="#0ea5e9"
            opacity="0.8"
          />
          {/* White-Hot Electric Flame Core */}
          <path
            d="M60,44 C62,52 70,62 70,76 C70,86 65,92 60,92 C55,92 50,86 50,76 C50,66 58,54 60,44 Z"
            fill="url(#plasmaHeart)"
          />
          {/* Micro Energy Arcs */}
          <circle cx="60" cy="98" r="2.5" fill="#38bdf8" />
          <circle cx="34" cy="50" r="2" fill="#22d3ee" className="animate-ping" />
          <circle cx="86" cy="50" r="2" fill="#22d3ee" className="animate-ping" />
        </svg>
      </div>
    );
  }

  // 9. DRAGONFIRE BLAZE (Molten Crimson Fire)
  return (
    <div className={`relative flex items-center justify-center select-none ${containerSize} ${className}`}>
      <div className="absolute inset-1 rounded-full bg-red-600/35 blur-xl animate-pulse" />
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_24px_rgba(239,68,68,0.9)] relative z-10">
        <defs>
          <linearGradient id="dragonFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </linearGradient>
          <radialGradient id="moltenCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ea580c" />
          </radialGradient>
        </defs>
        {/* Outer Crimson Fire Shape */}
        <path
          d="M60,10 C68,26 90,42 90,70 C90,90 76,108 60,108 C44,108 30,90 30,70 C30,46 50,28 60,10 Z"
          fill="url(#dragonFlameGrad)"
          stroke="#f97316"
          strokeWidth="2"
          className="animate-pulse"
        />
        {/* Middle Orange Molten Tongue */}
        <path
          d="M60,26 C65,38 80,52 80,74 C80,88 71,100 60,100 C49,100 40,88 40,74 C40,58 53,42 60,26 Z"
          fill="#f97316"
          opacity="0.85"
        />
        {/* Inner Golden Heat Core */}
        <path
          d="M60,42 C63,52 71,62 71,78 C71,88 66,94 60,94 C54,94 49,88 49,78 C49,66 57,54 60,42 Z"
          fill="url(#moltenCore)"
        />
        {/* Soaring Embers */}
        <circle cx="60" cy="6" r="2.5" fill="#fef08a" className="animate-bounce" />
        <circle cx="28" cy="48" r="2" fill="#f59e0b" />
        <circle cx="92" cy="48" r="2" fill="#f59e0b" />
      </svg>
    </div>
  );
};
