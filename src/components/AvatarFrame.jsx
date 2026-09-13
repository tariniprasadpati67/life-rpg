import React from 'react';
import { BadgeGraphic } from './BadgeGraphic';
import { getBadgeStyle } from '../lib/cosmetics';

/**
 * Sizes map for AvatarFrame:
 * sm: 44px outer (32px inner avatar) - for dropdowns & compact headers
 * md: 88px outer (62px inner avatar) - for shop preview & settings
 * lg: 128px outer (92px inner avatar) - for dashboard & profile banners
 * xl: 168px outer (120px inner avatar) - for centerpiece hero/character screen
 */
const SIZE_CONFIG = {
  sm: {
    container: 'w-11 h-11',
    inner: 'w-[64%] h-[64%]',
    glow: 'blur-xs',
  },
  md: {
    container: 'w-24 h-24 sm:w-28 sm:h-28',
    inner: 'w-[64%] h-[64%]',
    glow: 'blur-sm',
  },
  lg: {
    container: 'w-32 h-32 sm:w-36 sm:h-36',
    inner: 'w-[64%] h-[64%]',
    glow: 'blur-md',
  },
  xl: {
    container: 'w-40 h-40 sm:w-48 sm:h-48',
    inner: 'w-[64%] h-[64%]',
    glow: 'blur-lg',
  }
};

export const AvatarFrame = ({
  frameName = 'Fire Frame',
  avatarUrl = '/avatar-alex.jpg',
  auraName = null,
  orbitName = null,
  badgeName = null,
  equippedStreakShield = false,
  size = 'md',
  className = '',
  alt = 'Avatar'
}) => {
  const normalized = (frameName || 'Fire Frame').toLowerCase();
  const config = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  let frameType = 'fire';
  if (normalized.includes('galaxy')) frameType = 'galaxy';
  else if (normalized.includes('cyber')) frameType = 'cyber';
  else if (normalized.includes('nature')) frameType = 'nature';
  else if (normalized.includes('royal')) frameType = 'royal';

  // Determine equipped orbit / aura archetype
  let rawOrbit = (orbitName || auraName || '').toLowerCase();
  if (!rawOrbit && equippedStreakShield) {
    rawOrbit = 'shield';
  }
  let orbitType = null;
  if (rawOrbit.includes('shield') || rawOrbit.includes('aegis')) {
    orbitType = 'shield';
  } else if (rawOrbit.includes('supernova')) {
    orbitType = 'supernova';
  } else if (rawOrbit.includes('prism') || rawOrbit.includes('crystal') || rawOrbit.includes('nova')) {
    orbitType = 'prismatic';
  } else if (rawOrbit.includes('phoenix') || rawOrbit.includes('ascension')) {
    orbitType = 'phoenix';
  } else if (rawOrbit.includes('blade') || rawOrbit.includes('champion') || rawOrbit.includes('salute') || rawOrbit.includes('sword') || rawOrbit.includes('honor')) {
    orbitType = 'blades';
  } else if (rawOrbit.includes('hyper') || rawOrbit.includes('hyperdrive')) {
    orbitType = 'hyper';
  } else if (rawOrbit.includes('dragon') || rawOrbit.includes('inferno') || rawOrbit.includes('blaze')) {
    orbitType = 'inferno';
  } else if (rawOrbit.includes('kinetic') || rawOrbit.includes('energy') || rawOrbit.includes('pulse')) {
    orbitType = 'kinetic';
  } else if (rawOrbit.includes('astral') || rawOrbit.includes('void') || rawOrbit.includes('cosmic')) {
    orbitType = 'cosmic';
  } else if (rawOrbit.includes('solar') || rawOrbit.includes('flame') || rawOrbit.includes('fire')) {
    orbitType = 'inferno';
  }

  const badgeStyle = badgeName ? getBadgeStyle(badgeName) : null;

  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none ${config.container} ${className}`}>
      
      {/* 0. Equipped Avatar Orbit (Dynamic Animated Relics & Energy Rings Orbiting the Avatar) */}
      {orbitType && (
        <div className="absolute -inset-3 sm:-inset-5 z-30 pointer-events-none flex items-center justify-center animate-fadeIn overflow-visible">
          {orbitType === 'shield' && <ShieldOrbitSvg />}
          {orbitType === 'cosmic' && <CosmicAuraSvg />}
          {orbitType === 'kinetic' && <KineticAuraSvg />}
          {orbitType === 'supernova' && <SupernovaOrbitSvg />}
          {orbitType === 'prismatic' && <PrismaticOrbitSvg />}
          {orbitType === 'phoenix' && <PhoenixOrbitSvg />}
          {orbitType === 'blades' && <BladesOrbitSvg />}
          {orbitType === 'hyper' && <HyperdriveOrbitSvg />}
          {orbitType === 'inferno' && <DragonfireOrbitSvg />}
        </div>
      )}

      {/* 1. Ambient Thematic Back-Glow (Concentric with metal chassis ring) */}
      <div 
        className={`absolute inset-0 m-auto w-[76%] h-[76%] rounded-full pointer-events-none transition-all duration-500 opacity-50 ${config.glow} ${
          frameType === 'fire' 
            ? 'bg-gradient-to-tr from-amber-600/40 via-red-600/30 to-orange-500/40 shadow-[0_0_22px_rgba(245,158,11,0.35)]'
            : frameType === 'galaxy'
              ? 'bg-gradient-to-tr from-purple-600/40 via-indigo-600/30 to-cyan-500/40 shadow-[0_0_22px_rgba(168,85,247,0.35)]'
              : frameType === 'cyber'
                ? 'bg-gradient-to-tr from-cyan-500/40 via-blue-600/30 to-teal-400/40 shadow-[0_0_22px_rgba(6,182,212,0.4)]'
                : frameType === 'nature'
                  ? 'bg-gradient-to-tr from-emerald-600/40 via-green-600/30 to-lime-500/40 shadow-[0_0_22px_rgba(16,185,129,0.35)]'
                  : 'bg-gradient-to-tr from-amber-400/40 via-yellow-500/35 to-amber-600/40 shadow-[0_0_24px_rgba(234,179,8,0.4)]'
        }`} 
      />

      {/* 2. Inner Avatar Mask (Strictly clipped and centered inside the frame ring opening) */}
      <div className={`absolute inset-0 m-auto z-10 rounded-full overflow-hidden bg-[#0a0e17] flex items-center justify-center shadow-inner ${config.inner}`}>
        <img
          src={avatarUrl || '/avatar-alex.jpg'}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover rounded-full select-none pointer-events-none"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/avatar-alex.jpg';
          }}
        />
      </div>

      {/* 3. Outer RPG Decorative Frame Layer (Vector Overlay) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        {frameType === 'fire' && <FireFrameSvg />}
        {frameType === 'galaxy' && <GalaxyFrameSvg />}
        {frameType === 'cyber' && <CyberFrameSvg />}
        {frameType === 'nature' && <NatureFrameSvg />}
        {frameType === 'royal' && <RoyalFrameSvg />}
      </div>

      {/* 4. Equipped Mini Corner Rank Badge Crest (Rank Pin Socket) */}
      {badgeStyle && size !== 'sm' && (
        <div 
          className={`absolute z-30 pointer-events-none transition-all duration-300 ${
            size === 'xl' 
              ? 'bottom-4 right-4 sm:bottom-5 sm:right-5' 
              : size === 'lg' 
                ? 'bottom-3 right-3 sm:bottom-3.5 sm:right-3.5' 
                : 'bottom-2 right-2'
          }`}
          title={`Equipped Crest: ${badgeStyle.name}`}
        >
          {/* Sculpted Metallic Socket Pedestal & 3D Metallic Crest */}
          <div className={`rounded-full bg-gradient-to-b from-[#1b253b] via-[#0d1424] to-[#080c14] border-2 border-slate-700/80 shadow-[0_4px_12px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.25)] flex items-center justify-center p-1 hover:scale-110 transition-transform ${
            size === 'xl' 
              ? 'w-11 h-11 sm:w-12 sm:h-12' 
              : size === 'lg' 
                ? 'w-8 h-8 sm:w-9 sm:h-9' 
                : 'w-6 h-6 sm:w-7 sm:h-7'
          }`}>
            <img
              src={badgeStyle.iconUrl}
              alt={badgeStyle.name}
              className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/badges/badge-novice.png';
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
};

/* =========================================================================
   1. FIRE FRAME (Infernal Forge - Dark Titanium, Horns & Magma Claws)
   ========================================================================= */
const FireFrameSvg = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] overflow-visible">
    <defs>
      <linearGradient id="fireMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3f3f46" />
        <stop offset="35%" stopColor="#18181b" />
        <stop offset="70%" stopColor="#27272a" />
        <stop offset="100%" stopColor="#09090b" />
      </linearGradient>
      <linearGradient id="fireEmberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#dc2626" />
      </linearGradient>
      <radialGradient id="fireCoreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
      <filter id="fireGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Outer Heavy Beveled Obsidian Ring */}
    <circle cx="100" cy="100" r="76" fill="none" stroke="url(#fireMetalGrad)" strokeWidth="12" filter="drop-shadow(0 2px 4px #000)" />
    
    {/* Inner Glowing Magma Trench (Breathing Ember Animation) */}
    <circle cx="100" cy="100" r="71" fill="none" stroke="url(#fireEmberGrad)" strokeWidth="2.5" className="animate-fire-ember" />
    <circle cx="100" cy="100" r="65" fill="none" stroke="#52525b" strokeWidth="1.5" opacity="0.7" />

    {/* 4 Cardinal Armor Studs */}
    <circle cx="100" cy="24" r="3.5" fill="#f59e0b" filter="url(#fireGlow)" />
    <circle cx="100" cy="176" r="3.5" fill="#f59e0b" filter="url(#fireGlow)" />
    <circle cx="24" cy="100" r="3.5" fill="#f59e0b" filter="url(#fireGlow)" />
    <circle cx="176" cy="100" r="3.5" fill="#f59e0b" filter="url(#fireGlow)" />

    {/* Top Forged Horn Crest (Subtle Animated Flame Movement) */}
    <g filter="url(#fireGlow)" className="animate-fire-crest" style={{ transformOrigin: '100px 28px' }}>
      {/* Left Horn */}
      <path
        d="M86 28 C74 15, 62 8, 48 10 C60 18, 70 26, 76 34 Z"
        fill="url(#fireMetalGrad)"
        stroke="#ea580c"
        strokeWidth="1.2"
      />
      {/* Right Horn */}
      <path
        d="M114 28 C126 15, 138 8, 152 10 C140 18, 130 26, 124 34 Z"
        fill="url(#fireMetalGrad)"
        stroke="#ea580c"
        strokeWidth="1.2"
      />
      {/* Central Flame Crest Spike */}
      <path
        d="M100 12 L106 27 L100 24 L94 27 Z"
        fill="url(#fireCoreGlow)"
        stroke="#fed7aa"
        strokeWidth="1"
      />
    </g>

    {/* Corner Magma Claws */}
    <g className="animate-fire-ember">
      {/* Top-Left */}
      <path d="M42 42 L34 32 L46 36 Z" fill="url(#fireEmberGrad)" />
      {/* Top-Right */}
      <path d="M158 42 L166 32 L154 36 Z" fill="url(#fireEmberGrad)" />
      {/* Bottom-Left */}
      <path d="M42 158 L34 168 L46 164 Z" fill="url(#fireEmberGrad)" />
      {/* Bottom-Right */}
      <path d="M158 158 L166 168 L154 164 Z" fill="url(#fireEmberGrad)" />
    </g>

    {/* Bottom Demon Rune Shield */}
    <g transform="translate(0, 154)">
      <path
        d="M88 6 L100 24 L112 6 L100 10 Z"
        fill="url(#fireMetalGrad)"
        stroke="#f97316"
        strokeWidth="1.5"
      />
      <circle cx="100" cy="14" r="2.5" fill="#fef08a" className="animate-fire-ember" />
    </g>

    {/* Micro Rising Sparks (Floating outside avatar perimeter) */}
    <g className="pointer-events-none" filter="url(#fireGlow)">
      <circle cx="86" cy="18" r="1.5" fill="#fef08a" className="animate-fire-spark-1" />
      <circle cx="114" cy="16" r="1.3" fill="#f97316" className="animate-fire-spark-2" />
      <circle cx="98" cy="10" r="1.1" fill="#fef08a" className="animate-fire-spark-1" />
    </g>
  </svg>
);

/* =========================================================================
   2. GALAXY FRAME (Astral Void - Cosmic Chrome, Orbital Rings & Compass Stars)
   ========================================================================= */
const GalaxyFrameSvg = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)] overflow-visible">
    <defs>
      <linearGradient id="cosmicSilver" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="35%" stopColor="#94a3b8" />
        <stop offset="70%" stopColor="#475569" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="nebulaViolet" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
      <radialGradient id="astralGem" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#4338ca" />
      </radialGradient>
      <filter id="astralGlow" x="-25%" y="-25%" width="150%" height="150%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Outer Gyroscope Orbital Ellipse (Slow-Moving Cosmic Rotation) */}
    <g className="animate-galaxy-orbit" style={{ transformOrigin: '100px 100px' }}>
      <ellipse
        cx="100"
        cy="100"
        rx="92"
        ry="78"
        fill="none"
        stroke="url(#nebulaViolet)"
        strokeWidth="1.5"
        opacity="0.75"
        strokeDasharray="18 6 4 6"
      />
      {/* Orbiting Starlight Satellites */}
      <circle cx="100" cy="22" r="2.2" fill="#38bdf8" filter="url(#astralGlow)" />
      <circle cx="100" cy="178" r="2.2" fill="#ec4899" filter="url(#astralGlow)" />
    </g>

    {/* Primary Beveled Cosmic Ring */}
    <circle cx="100" cy="100" r="76" fill="none" stroke="url(#cosmicSilver)" strokeWidth="9" />
    <circle cx="100" cy="100" r="71" fill="none" stroke="#1e1b4b" strokeWidth="2.5" />
    <circle cx="100" cy="100" r="66" fill="none" stroke="url(#nebulaViolet)" strokeWidth="1.5" />

    {/* Constellation Nodes at Cardinal Points */}
    <circle cx="100" cy="24" r="3" fill="#38bdf8" filter="url(#astralGlow)" />
    <circle cx="100" cy="176" r="3" fill="#a855f7" filter="url(#astralGlow)" />
    <circle cx="24" cy="100" r="3" fill="#ec4899" filter="url(#astralGlow)" />
    <circle cx="176" cy="100" r="3" fill="#38bdf8" filter="url(#astralGlow)" />

    {/* Top 8-Point North Star Compass (Subtle Twinkle & Glow Pulse) */}
    <g transform="translate(100, 18)" filter="url(#astralGlow)" className="animate-star-twinkle" style={{ transformOrigin: '100px 18px' }}>
      <polygon points="0,-12 3,-3 12,0 3,3 0,12 -3,3 -12,0 -3,-3" fill="url(#astralGem)" />
      <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
    </g>

    {/* Bottom Lunar Cradle */}
    <g transform="translate(100, 182)">
      <path
        d="M-22,-4 Q0,14 22,-4 Q0,6 -22,-4 Z"
        fill="url(#cosmicSilver)"
        stroke="#a855f7"
        strokeWidth="1"
      />
      <circle cx="0" cy="4" r="3" fill="url(#astralGem)" filter="url(#astralGlow)" />
    </g>

    {/* Diagonal Star Studs with Slow Cosmic Particle Drift */}
    <g className="pointer-events-none">
      <circle cx="48" cy="48" r="2" fill="#fff" filter="url(#astralGlow)" className="animate-cosmic-drift-1" />
      <circle cx="152" cy="48" r="2" fill="#fff" filter="url(#astralGlow)" className="animate-cosmic-drift-2" />
      <circle cx="48" cy="152" r="2" fill="#fff" filter="url(#astralGlow)" className="animate-cosmic-drift-2" />
      <circle cx="152" cy="152" r="2" fill="#fff" filter="url(#astralGlow)" className="animate-cosmic-drift-1" />
    </g>
  </svg>
);

/* =========================================================================
   3. CYBER FRAME (Neo-HUD Precision - Octagonal Chassis & Telemetry Brackets)
   ========================================================================= */
const CyberFrameSvg = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)] overflow-visible">
    <defs>
      <linearGradient id="cyberArmor" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="50%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#334155" />
      </linearGradient>
      <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22d3ee" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      {/* Frame mask so scan beam only illuminates outer chassis */}
      <mask id="cyberBorderMask">
        <polygon
          points="60,18 140,18 182,60 182,140 140,182 60,182 18,140 18,60"
          fill="#fff"
        />
        <circle cx="100" cy="100" r="64" fill="#000" />
      </mask>
    </defs>

    {/* Octagonal Heavy Armor Shell */}
    <polygon
      points="60,18 140,18 182,60 182,140 140,182 60,182 18,140 18,60"
      fill="none"
      stroke="url(#cyberArmor)"
      strokeWidth="10"
      strokeLinejoin="round"
    />

    {/* Secondary High-Tech Inner Track (Continuous Telemetry Motion) */}
    <circle 
      cx="100" 
      cy="100" 
      r="74" 
      fill="none" 
      stroke="#0284c7" 
      strokeWidth="1.5" 
      strokeDasharray="14 6 2 6" 
      opacity="0.75" 
      className="animate-cyber-track"
    />
    <circle cx="100" cy="100" r="66" fill="none" stroke="url(#neonCyan)" strokeWidth="1.5" />

    {/* 4 Corner HUD Crosshair Brackets (Subtle Energy Pulse) */}
    <g className="animate-cyber-bracket">
      {/* Top-Left Bracket */}
      <path d="M22,54 L22,22 L54,22" fill="none" stroke="#22d3ee" strokeWidth="3" filter="url(#cyberGlow)" />
      {/* Top-Right Bracket */}
      <path d="M146,22 L178,22 L178,54" fill="none" stroke="#22d3ee" strokeWidth="3" filter="url(#cyberGlow)" />
      {/* Bottom-Right Bracket */}
      <path d="M178,146 L178,178 L146,178" fill="none" stroke="#22d3ee" strokeWidth="3" filter="url(#cyberGlow)" />
      {/* Bottom-Left Bracket */}
      <path d="M54,178 L22,178 L22,146" fill="none" stroke="#22d3ee" strokeWidth="3" filter="url(#cyberGlow)" />
    </g>

    {/* Lateral Battery Power Blocks at 3 and 9 o'clock */}
    <g filter="url(#cyberGlow)" className="animate-cyber-bracket">
      <rect x="8" y="93" width="10" height="14" rx="2" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5" />
      <rect x="182" y="93" width="10" height="14" rx="2" fill="#0f172a" stroke="#22d3ee" strokeWidth="1.5" />
      <circle cx="13" cy="100" r="2" fill="#22d3ee" />
      <circle cx="187" cy="100" r="2" fill="#22d3ee" />
    </g>

    {/* Top Chevron HUD Diode */}
    <g transform="translate(100, 16)" filter="url(#cyberGlow)">
      <polygon points="0,-6 8,4 4,4 0,0 -4,4 -8,4" fill="#38bdf8" />
    </g>

    {/* Bottom Data Telemetry Bar */}
    <g transform="translate(100, 184)">
      <rect x="-24" y="-3" width="48" height="6" rx="2" fill="#090d16" stroke="#0ea5e9" strokeWidth="1" />
      <circle cx="-16" cy="0" r="1.5" fill="#22d3ee" />
      <circle cx="0" cy="0" r="1.5" fill="#22d3ee" />
      <circle cx="16" cy="0" r="1.5" fill="#22d3ee" />
    </g>

    {/* HUD Holographic Scanning Line (Subtle Energy Scan restricted to outer armor) */}
    <g mask="url(#cyberBorderMask)" className="pointer-events-none">
      <line 
        x1="16" 
        y1="0" 
        x2="184" 
        y2="0" 
        stroke="#22d3ee" 
        strokeWidth="2" 
        filter="url(#cyberGlow)" 
        className="animate-cyber-scan" 
      />
    </g>
  </svg>
);

/* =========================================================================
   4. NATURE FRAME (Elderwood Sylvan - Bronze Bark & Celtic Golden Leaf Clasps)
   ========================================================================= */
const NatureFrameSvg = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] overflow-visible">
    <defs>
      <linearGradient id="ironwoodBark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#451a03" />
        <stop offset="40%" stopColor="#78350f" />
        <stop offset="70%" stopColor="#291102" />
        <stop offset="100%" stopColor="#542407" />
      </linearGradient>
      <linearGradient id="leafGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#ca8a04" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <radialGradient id="emeraldGem" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="40%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#064e3b" />
      </radialGradient>
      <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Twisted Carved Ironwood Bark Outer Ring */}
    <circle cx="100" cy="100" r="76" fill="none" stroke="url(#ironwoodBark)" strokeWidth="12" />
    <circle cx="100" cy="100" r="70" fill="none" stroke="#15803d" strokeWidth="2" opacity="0.75" />
    <circle cx="100" cy="100" r="65" fill="none" stroke="url(#leafGold)" strokeWidth="1.5" />

    {/* 4 Celtic Leaf Clasps Wrapping the Ring */}
    {/* Top-Left Leaf */}
    <path d="M42 42 Q30 25 22 28 Q26 40 42 42 Z" fill="url(#leafGold)" stroke="#78350f" strokeWidth="1" />
    {/* Top-Right Leaf */}
    <path d="M158 42 Q170 25 178 28 Q174 40 158 42 Z" fill="url(#leafGold)" stroke="#78350f" strokeWidth="1" />
    {/* Bottom-Left Leaf */}
    <path d="M42 158 Q30 175 22 172 Q26 160 42 158 Z" fill="url(#leafGold)" stroke="#78350f" strokeWidth="1" />
    {/* Bottom-Right Leaf */}
    <path d="M158 158 Q170 175 178 172 Q174 160 158 158 Z" fill="url(#leafGold)" stroke="#78350f" strokeWidth="1" />

    {/* Top Triple Druid Leaf Crown (Gentle Emerald Breathing Pulse) */}
    <g transform="translate(100, 18)" filter="url(#emeraldGlow)">
      {/* Center Leaf */}
      <path d="M0 -12 Q8 -2 0 6 Q-8 -2 0 -12 Z" fill="url(#leafGold)" stroke="#542407" strokeWidth="1" />
      {/* Left Leaf */}
      <path d="M-5 -2 Q-16 -8 -12 2 Q-4 4 -5 -2 Z" fill="url(#leafGold)" stroke="#542407" strokeWidth="1" />
      {/* Right Leaf */}
      <path d="M5 -2 Q16 -8 12 2 Q4 4 5 -2 Z" fill="url(#leafGold)" stroke="#542407" strokeWidth="1" />
      {/* Emerald Core Cabochon */}
      <circle cx="0" cy="2" r="3.5" fill="url(#emeraldGem)" stroke="#fef08a" strokeWidth="0.8" className="animate-nature-gem" />
    </g>

    {/* Bottom Vine Knot & Emerald Seal */}
    <g transform="translate(100, 180)" filter="url(#emeraldGlow)">
      <path d="M-18 -2 Q0 12 18 -2 Q0 4 -18 -2 Z" fill="url(#ironwoodBark)" stroke="url(#leafGold)" strokeWidth="1.2" />
      <circle cx="0" cy="3" r="4" fill="url(#emeraldGem)" stroke="#fef08a" strokeWidth="1" className="animate-nature-gem" />
    </g>

    {/* Side Sprout Berries */}
    <circle cx="22" cy="100" r="3" fill="url(#emeraldGem)" filter="url(#emeraldGlow)" className="animate-nature-gem" />
    <circle cx="178" cy="100" r="3" fill="url(#emeraldGem)" filter="url(#emeraldGlow)" className="animate-nature-gem" />

    {/* Subtle Floating Sylvan Spores / Pollen (Drifting gently upwards) */}
    <g className="pointer-events-none" filter="url(#emeraldGlow)">
      <circle cx="34" cy="130" r="1.6" fill="#a7f3d0" className="animate-nature-pollen-1" />
      <circle cx="166" cy="120" r="1.5" fill="#fef08a" className="animate-nature-pollen-2" />
      <circle cx="68" cy="165" r="1.3" fill="#6ee7b7" className="animate-nature-pollen-3" />
      <circle cx="132" cy="160" r="1.4" fill="#fef08a" className="animate-nature-pollen-1" />
    </g>
  </svg>
);

/* =========================================================================
   5. ROYAL FRAME (Crown of Sovereignty - Burnished Imperial Gold & Crown Crest)
   ========================================================================= */
const RoyalFrameSvg = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] overflow-visible">
    <defs>
      <linearGradient id="imperialGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="25%" stopColor="#eab308" />
        <stop offset="60%" stopColor="#ca8a04" />
        <stop offset="85%" stopColor="#fef9c3" />
        <stop offset="100%" stopColor="#854d0e" />
      </linearGradient>
      <linearGradient id="rubyGem" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="40%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>
      <filter id="royalGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      {/* Mask ensuring gold shimmer only traverses the outer frame border */}
      <mask id="royalBorderMask">
        <circle cx="100" cy="100" r="92" fill="#fff" />
        <circle cx="100" cy="100" r="64" fill="#000" />
      </mask>
    </defs>

    {/* Outer Baroque Acanthus Scrollwork Accents at 4 Corners */}
    <g fill="url(#imperialGold)" stroke="#713f12" strokeWidth="0.8">
      {/* Top-Left Filigree */}
      <path d="M34 34 Q20 20 16 32 Q26 38 34 34 Z" />
      {/* Top-Right Filigree */}
      <path d="M166 34 Q180 20 184 32 Q174 38 166 34 Z" />
      {/* Bottom-Left Filigree */}
      <path d="M34 166 Q20 180 16 168 Q26 162 34 166 Z" />
      {/* Bottom-Right Filigree */}
      <path d="M166 166 Q180 180 184 168 Q174 162 166 166 Z" />
    </g>

    {/* Primary Fluted Imperial Gold Ring */}
    <circle cx="100" cy="100" r="77" fill="none" stroke="url(#imperialGold)" strokeWidth="12" />
    <circle cx="100" cy="100" r="71" fill="none" stroke="#713f12" strokeWidth="2.5" />
    <circle cx="100" cy="100" r="66" fill="none" stroke="url(#imperialGold)" strokeWidth="2" />

    {/* Top 3D Imperial Crown Crest */}
    <g transform="translate(100, 16)" filter="url(#royalGlow)">
      {/* Crown Base Band */}
      <rect x="-22" y="3" width="44" height="6" rx="2" fill="url(#imperialGold)" stroke="#78350f" strokeWidth="1" />
      {/* 3 Crown Spires */}
      <polygon points="0,-16 6,3 -6,3" fill="url(#imperialGold)" stroke="#78350f" strokeWidth="1" />
      <polygon points="-16,-10 -10,3 -22,3" fill="url(#imperialGold)" stroke="#78350f" strokeWidth="1" />
      <polygon points="16,-10 22,3 10,3" fill="url(#imperialGold)" stroke="#78350f" strokeWidth="1" />
      {/* Pearls on Spire Tips (Delicate Soft Glimmer) */}
      <circle cx="0" cy="-16" r="2.5" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" className="animate-royal-pearl" />
      <circle cx="-16" cy="-10" r="2" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" className="animate-royal-pearl" />
      <circle cx="16" cy="-10" r="2" fill="#ffffff" stroke="#eab308" strokeWidth="0.8" className="animate-royal-pearl" />
      {/* Central Royal Ruby Gem (Brilliance Sparkle) */}
      <circle cx="0" cy="6" r="3.5" fill="url(#rubyGem)" stroke="#fef08a" strokeWidth="0.8" className="animate-royal-ruby" />
    </g>

    {/* Bottom Lion Shield & Laurel Swags */}
    <g transform="translate(100, 180)">
      {/* Laurel Swag Left */}
      <path d="M-28 -4 Q-14 8 0 4" fill="none" stroke="url(#imperialGold)" strokeWidth="2.5" />
      {/* Laurel Swag Right */}
      <path d="M28 -4 Q14 8 0 4" fill="none" stroke="url(#imperialGold)" strokeWidth="2.5" />
      {/* Royal Seal Shield */}
      <path
        d="M-9 -2 L9 -2 L9 5 Q9 14 0 18 Q-9 14 -9 5 Z"
        fill="url(#imperialGold)"
        stroke="#78350f"
        strokeWidth="1.2"
      />
      <circle cx="0" cy="6" r="3" fill="url(#rubyGem)" filter="url(#royalGlow)" className="animate-royal-ruby" />
    </g>

    {/* Side Scepter Jewels */}
    <circle cx="21" cy="100" r="3.5" fill="url(#rubyGem)" filter="url(#royalGlow)" stroke="#fef08a" strokeWidth="0.8" className="animate-royal-ruby" />
    <circle cx="179" cy="100" r="3.5" fill="url(#rubyGem)" filter="url(#royalGlow)" stroke="#fef08a" strokeWidth="0.8" className="animate-royal-ruby" />

    {/* Elegant Golden Shimmer Sweep (Traversing the outer gold rim without touching avatar) */}
    <g mask="url(#royalBorderMask)" className="pointer-events-none">
      <line 
        x1="100" 
        y1="-20" 
        x2="100" 
        y2="220" 
        stroke="rgba(254, 240, 138, 0.7)" 
        strokeWidth="10" 
        filter="url(#royalGlow)" 
        className="animate-royal-gleam" 
      />
    </g>
  </svg>
);

/* =========================================================================
   AVATAR ORBITS (Animated Orbiting Relics & Energy Rings Orbiting the Avatar)
   ========================================================================= */

// 1. AEGIS STREAK SHIELD ORBIT (Floating Mystical Shield & Mana Orbs)
const ShieldOrbitSvg = () => (
  <svg viewBox="0 0 220 220" className="w-[125%] h-[125%] overflow-visible">
    <defs>
      <linearGradient id="orbitShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="shieldGoldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <filter id="shieldOrbitGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Orbiting track ring */}
    <circle 
      cx="110" 
      cy="110" 
      r="98" 
      fill="none" 
      stroke="#0284c7" 
      strokeWidth="1.5" 
      strokeDasharray="8 12 4 12" 
      opacity="0.6" 
    />
    {/* Revolving Aegis Shield & Mana Glyphs */}
    <g className="animate-spin-medium" style={{ transformOrigin: '110px 110px' }} filter="url(#shieldOrbitGlow)">
      {/* 1. Main Floating Aegis Shield Artifact */}
      <g transform="translate(110, 12)">
        <path 
          d="M-10,-9 L10,-9 L12,2 Q10,13 0,18 Q-10,13 -12,2 Z" 
          fill="url(#orbitShieldGrad)" 
          stroke="url(#shieldGoldTrim)" 
          strokeWidth="1.5" 
        />
        <circle cx="0" cy="3" r="3.5" fill="#fef08a" />
        <path d="M0,-3 L0,9 M-5,3 L5,3" stroke="#1e3a8a" strokeWidth="1" />
      </g>

      {/* 2. Opposing Aegis Ward Seal */}
      <g transform="translate(110, 208)">
        <polygon points="0,-6 6,0 0,6 -6,0" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        <circle cx="0" cy="0" r="2" fill="#ffffff" />
      </g>

      {/* 3. Orbiting Blue Energy Sparks */}
      <circle cx="12" cy="110" r="3" fill="#60a5fa" />
      <circle cx="208" cy="110" r="3" fill="#60a5fa" />
    </g>

    {/* Counter-rotating subtle energy pulses */}
    <g className="animate-spin-reverse" style={{ transformOrigin: '110px 110px' }} opacity="0.5">
      <circle cx="178" cy="42" r="2" fill="#93c5fd" />
      <circle cx="42" cy="178" r="2" fill="#93c5fd" />
    </g>
  </svg>
);

// 2. ASTRAL VOID COSMIC ORBIT (Celestial Stardust Orbit with Crescent Moon)
const CosmicAuraSvg = () => (
  <svg viewBox="0 0 220 220" className="w-[122%] h-[122%] overflow-visible">
    <defs>
      <linearGradient id="auraCosmicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.85" />
      </linearGradient>
      <filter id="cosmicAuraGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Outer rotating celestial particle ring */}
    <g className="animate-spin-slow" style={{ transformOrigin: '110px 110px' }} filter="url(#cosmicAuraGlow)">
      <circle 
        cx="110" 
        cy="110" 
        r="98" 
        fill="none" 
        stroke="url(#auraCosmicGrad)" 
        strokeWidth="2.2" 
        strokeDasharray="16 12 4 12" 
        opacity="0.85" 
      />
      {/* Orbiting Stardust & Moons */}
      <g transform="translate(110, 12)">
        <circle cx="0" cy="0" r="4" fill="#38bdf8" />
        <circle cx="1.5" cy="-1.5" r="3.2" fill="#0f172a" />
      </g>
      <circle cx="208" cy="110" r="3" fill="#e879f9" />
      <circle cx="110" cy="208" r="3.5" fill="#a855f7" />
      <circle cx="12" cy="110" r="3" fill="#38bdf8" />
    </g>
    
    {/* Counter-rotating micro dust ring */}
    <g className="animate-spin-reverse" style={{ transformOrigin: '110px 110px' }} opacity="0.7">
      <circle 
        cx="110" 
        cy="110" 
        r="104" 
        fill="none" 
        stroke="#c084fc" 
        strokeWidth="1.2" 
        strokeDasharray="6 20" 
      />
      <circle cx="184" cy="36" r="2.5" fill="#ffffff" filter="url(#cosmicAuraGlow)" />
      <circle cx="36" cy="184" r="2.5" fill="#ffffff" filter="url(#cosmicAuraGlow)" />
    </g>
  </svg>
);

// 3. KINETIC PULSE ORBIT (High-Tech Electric Telemetry Ring)
const KineticAuraSvg = () => (
  <svg viewBox="0 0 220 220" className="w-[122%] h-[122%] overflow-visible">
    <defs>
      <linearGradient id="auraKineticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="50%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <filter id="kineticAuraGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Fast pulsing HUD telemetry ring */}
    <g className="animate-spin-medium" style={{ transformOrigin: '110px 110px' }} filter="url(#kineticAuraGlow)">
      <circle 
        cx="110" 
        cy="110" 
        r="99" 
        fill="none" 
        stroke="url(#auraKineticGrad)" 
        strokeWidth="2.2" 
        strokeDasharray="24 8 6 8" 
      />
      {/* 4 Tech Calipers */}
      <rect x="107" y="7" width="6" height="8" rx="1.5" fill="#22d3ee" />
      <rect x="107" y="205" width="6" height="8" rx="1.5" fill="#22d3ee" />
      <rect x="7" y="107" width="8" height="6" rx="1.5" fill="#22d3ee" />
      <rect x="205" y="107" width="8" height="6" rx="1.5" fill="#22d3ee" />
    </g>

    {/* Secondary pulse tracker */}
    <circle 
      cx="110" 
      cy="110" 
      r="105" 
      fill="none" 
      stroke="#0ea5e9" 
      strokeWidth="1.2" 
      strokeDasharray="8 12" 
      className="animate-pulse" 
      opacity="0.8" 
    />
  </svg>
);

// 4. SUPERNOVA STAR ORBIT (Celestial Nova Flares & Stellar Starbursts)
const SupernovaOrbitSvg = () => (
  <svg viewBox="0 0 220 220" className="w-[125%] h-[125%] overflow-visible">
    <defs>
      <linearGradient id="supernovaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="50%" stopColor="#818cf8" />
        <stop offset="100%" stopColor="#c084fc" />
      </linearGradient>
      <filter id="supernovaGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle 
      cx="110" 
      cy="110" 
      r="98" 
      fill="none" 
      stroke="url(#supernovaGrad)" 
      strokeWidth="2" 
      strokeDasharray="20 14" 
      opacity="0.75" 
      className="animate-aura-pulse"
    />
    <g className="animate-spin-medium" style={{ transformOrigin: '110px 110px' }} filter="url(#supernovaGlow)">
      <g transform="translate(110, 12)">
        <polygon points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="#ffffff" stroke="#38bdf8" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="2.5" fill="#38bdf8" />
      </g>
      <g transform="translate(208, 110)">
        <polygon points="0,-6 1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5" fill="#c084fc" stroke="#ffffff" strokeWidth="0.8" />
      </g>
      <g transform="translate(110, 208)">
        <polygon points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="#ffffff" stroke="#818cf8" strokeWidth="0.8" />
        <circle cx="0" cy="0" r="2.5" fill="#818cf8" />
      </g>
      <g transform="translate(12, 110)">
        <polygon points="0,-6 1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />
      </g>
    </g>
  </svg>
);

// 5. PRISMATIC CRYSTAL ORBIT (Floating Rainbow Gems & Gold Star Shards)
const PrismaticOrbitSvg = () => (
  <svg viewBox="0 0 220 220" className="w-[125%] h-[125%] overflow-visible">
    <defs>
      <linearGradient id="prismGemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#eab308" />
        <stop offset="70%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <filter id="prismGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle 
      cx="110" 
      cy="110" 
      r="99" 
      fill="none" 
      stroke="#eab308" 
      strokeWidth="1.4" 
      strokeDasharray="4 16 12 16" 
      opacity="0.7" 
    />
    <g className="animate-spin-slow" style={{ transformOrigin: '110px 110px' }} filter="url(#prismGlow)">
      <g transform="translate(110, 11)">
        <polygon points="0,-8 6,-1 3,7 -3,7 -6,-1" fill="url(#prismGemGrad)" stroke="#ffffff" strokeWidth="0.8" />
        <line x1="0" y1="-8" x2="0" y2="7" stroke="#ffffff" strokeWidth="0.6" opacity="0.8" />
      </g>
      <g transform="translate(196, 160)">
        <polygon points="0,-7 5,0 0,7 -5,0" fill="#38bdf8" stroke="#ffffff" strokeWidth="0.8" />
      </g>
      <g transform="translate(24, 160)">
        <polygon points="0,-7 5,0 0,7 -5,0" fill="#10b981" stroke="#ffffff" strokeWidth="0.8" />
      </g>
      <circle cx="110" cy="209" r="2.5" fill="#fef08a" />
    </g>
  </svg>
);

// 6. PHOENIX ASCENSION ORBIT (Golden Solar Feathers & Rising Flame Sparks)
const PhoenixOrbitSvg = () => (
  <svg viewBox="0 0 220 220" className="w-[125%] h-[125%] overflow-visible">
    <defs>
      <linearGradient id="phoenixFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="35%" stopColor="#f59e0b" />
        <stop offset="70%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#b91c1c" />
      </linearGradient>
      <filter id="phoenixGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle 
      cx="110" 
      cy="110" 
      r="98" 
      fill="none" 
      stroke="url(#phoenixFeatherGrad)" 
      strokeWidth="2.5" 
      strokeDasharray="18 10 32 10" 
      opacity="0.8" 
    />
    <g className="animate-spin-medium" style={{ transformOrigin: '110px 110px' }} filter="url(#phoenixGlow)">
      <g transform="translate(110, 11) rotate(20)">
        <path d="M-12,0 C-6,-5 6,-4 12,0 C6,4 -6,5 -12,0 Z" fill="url(#phoenixFeatherGrad)" stroke="#fef08a" strokeWidth="0.8" />
        <circle cx="12" cy="0" r="2" fill="#ffffff" />
      </g>
      <g transform="translate(110, 209) rotate(200)">
        <path d="M-12,0 C-6,-5 6,-4 12,0 C6,4 -6,5 -12,0 Z" fill="url(#phoenixFeatherGrad)" stroke="#fef08a" strokeWidth="0.8" />
        <circle cx="12" cy="0" r="2" fill="#ffffff" />
      </g>
      <circle cx="14" cy="90" r="2.5" fill="#f59e0b" />
      <circle cx="206" cy="130" r="2.5" fill="#f59e0b" />
    </g>
  </svg>
);

// 7. HONOR BLADES ORBIT (Twin Enchanted Knight Swords Orbiting)
const BladesOrbitSvg = () => (
  <svg viewBox="0 0 220 220" className="w-[125%] h-[125%] overflow-visible">
    <defs>
      <linearGradient id="bladeSteel" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#93c5fd" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
      <linearGradient id="bladeGoldHilt" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
      <filter id="bladeGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle 
      cx="110" 
      cy="110" 
      r="98" 
      fill="none" 
      stroke="#3b82f6" 
      strokeWidth="1.2" 
      strokeDasharray="24 16 8 16" 
      opacity="0.6" 
    />
    <g className="animate-spin-medium" style={{ transformOrigin: '110px 110px' }} filter="url(#bladeGlow)">
      {/* Blade 1 (Top) */}
      <g transform="translate(110, 12) rotate(90)">
        <polygon points="0,-14 3,-8 2.5,4 -2.5,4 -3,-8" fill="url(#bladeSteel)" stroke="#ffffff" strokeWidth="0.6" />
        <line x1="0" y1="-10" x2="0" y2="2" stroke="#1d4ed8" strokeWidth="0.8" />
        <rect x="-6" y="4" width="12" height="2" rx="0.8" fill="url(#bladeGoldHilt)" stroke="#78350f" strokeWidth="0.5" />
        <line x1="0" y1="6" x2="0" y2="10" stroke="#78350f" strokeWidth="1.2" />
        <circle cx="0" cy="11" r="1.5" fill="#fef08a" />
      </g>

      {/* Blade 2 (Bottom) */}
      <g transform="translate(110, 208) rotate(270)">
        <polygon points="0,-14 3,-8 2.5,4 -2.5,4 -3,-8" fill="url(#bladeSteel)" stroke="#ffffff" strokeWidth="0.6" />
        <line x1="0" y1="-10" x2="0" y2="2" stroke="#1d4ed8" strokeWidth="0.8" />
        <rect x="-6" y="4" width="12" height="2" rx="0.8" fill="url(#bladeGoldHilt)" stroke="#78350f" strokeWidth="0.5" />
        <line x1="0" y1="6" x2="0" y2="10" stroke="#78350f" strokeWidth="1.2" />
        <circle cx="0" cy="11" r="1.5" fill="#fef08a" />
      </g>
    </g>
  </svg>
);

// 8. HYPERDRIVE PLASMA ORBIT (High-Velocity Cobalt Plasma Orbs)
const HyperdriveOrbitSvg = () => (
  <svg viewBox="0 0 220 220" className="w-[125%] h-[125%] overflow-visible">
    <defs>
      <linearGradient id="hyperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f0ff" />
        <stop offset="50%" stopColor="#0284c7" />
        <stop offset="100%" stopColor="#4f46e5" />
      </linearGradient>
      <filter id="hyperGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle 
      cx="110" 
      cy="110" 
      r="98" 
      fill="none" 
      stroke="url(#hyperGrad)" 
      strokeWidth="2.5" 
      strokeDasharray="40 10 10 10" 
      opacity="0.85" 
    />
    <g className="animate-spin-fast" style={{ transformOrigin: '110px 110px' }} filter="url(#hyperGlow)">
      <circle cx="110" cy="11" r="4.5" fill="#ffffff" stroke="#00f0ff" strokeWidth="1.5" />
      <circle cx="100" cy="12" r="2.5" fill="#00f0ff" opacity="0.8" />
      <circle cx="92" cy="15" r="1.5" fill="#38bdf8" opacity="0.5" />

      <circle cx="110" cy="209" r="4.5" fill="#ffffff" stroke="#00f0ff" strokeWidth="1.5" />
      <circle cx="120" cy="208" r="2.5" fill="#00f0ff" opacity="0.8" />
      <circle cx="128" cy="205" r="1.5" fill="#38bdf8" opacity="0.5" />
    </g>
  </svg>
);

// 9. DRAGONFIRE INFERNO ORBIT (Dual Molten Dragon Fireballs)
const DragonfireOrbitSvg = () => (
  <svg viewBox="0 0 220 220" className="w-[125%] h-[125%] overflow-visible">
    <defs>
      <radialGradient id="dragonfireBallGrad" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="30%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#ea580c" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
      <filter id="dragonfireGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <circle 
      cx="110" 
      cy="110" 
      r="98" 
      fill="none" 
      stroke="#ea580c" 
      strokeWidth="2" 
      strokeDasharray="24 12" 
      opacity="0.7" 
      className="animate-flame-flicker"
    />
    <g className="animate-spin-medium" style={{ transformOrigin: '110px 110px' }} filter="url(#dragonfireGlow)">
      <circle cx="110" cy="11" r="5" fill="url(#dragonfireBallGrad)" />
      <circle cx="98" cy="14" r="2.5" fill="#f97316" opacity="0.75" />
      <circle cx="88" cy="19" r="1.8" fill="#ef4444" opacity="0.5" />

      <circle cx="110" cy="209" r="5" fill="url(#dragonfireBallGrad)" />
      <circle cx="122" cy="206" r="2.5" fill="#f97316" opacity="0.75" />
      <circle cx="132" cy="201" r="1.8" fill="#ef4444" opacity="0.5" />
    </g>
  </svg>
);


