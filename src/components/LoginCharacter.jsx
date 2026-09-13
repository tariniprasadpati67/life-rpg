import React from 'react';

/**
 * LoginCharacter Component - Ultra Stylish Anime RPG Hero
 * Features a realistic anime silhouette, detailed hair, expressive glowing eyes,
 * high-collar techwear coat with flowing purple silk lining, armored pauldrons,
 * golden quest key relic, floating astral familiar, and ground summoning rune.
 */
export const LoginCharacter = ({ className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center select-none pointer-events-none ${className}`}>
      
      {/* 1. Walk-In Animation Wrapper (Handles horizontal entrance & walking step bob) */}
      <div className="animate-char-walk-mobile sm:animate-char-walk-desktop flex flex-col items-center">
        
        {/* 2. Idle Animation Wrapper (Gentle breathing, floating aura) */}
        <div className="animate-char-idle relative flex items-center justify-center">
          
          {/* Ambient Ethereal Back Glow */}
          <div className="absolute w-48 h-56 sm:w-56 sm:h-64 rounded-full bg-gradient-to-tr from-blue-600/25 via-indigo-600/30 to-purple-500/25 blur-2xl pointer-events-none" />

          {/* Welcoming Quest Pill / Floating Badge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-3.5 py-1 rounded-full bg-[#0c1220]/95 border border-cyan-400/50 shadow-[0_4px_18px_rgba(6,182,212,0.35)] backdrop-blur-md flex items-center gap-1.5 transition-transform hover:scale-105">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-heading font-extrabold text-cyan-200 tracking-wider">
              Ready?
            </span>
          </div>

          {/* Floating Astral Familiar / Spirit Drone */}
          <div className="absolute -top-2 -right-3 sm:-top-3 sm:-right-4 z-25 animate-char-orb">
            <div className="relative flex items-center justify-center">
              {/* Core Crystal */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_18px_rgba(34,211,238,0.9)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
              {/* Outer Gyro Energy Rings */}
              <div className="absolute w-9 h-9 rounded-full border border-cyan-400/50 animate-spin-slow" />
              <div className="absolute w-11 h-11 rounded-full border border-purple-400/35 animate-spin-reverse-fast" />
              {/* Small Energy Sparkles */}
              <div className="absolute -top-1 right-0 w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#22d3ee]" />
            </div>
          </div>

          {/* Realistic & Stylish Vector Anime RPG Hero */}
          <svg 
            viewBox="0 0 240 320" 
            className="w-44 h-60 sm:w-52 sm:h-72 md:w-64 md:h-88 drop-shadow-[0_16px_32px_rgba(0,0,0,0.85)] overflow-visible"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Metallic Armored Armor Gradients */}
              <linearGradient id="heroArmorDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2a374a" />
                <stop offset="40%" stopColor="#141c2b" />
                <stop offset="100%" stopColor="#0a0f18" />
              </linearGradient>

              <linearGradient id="heroArmorPlate" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b4d66" />
                <stop offset="50%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Glowing Neon Cyan Energy */}
              <linearGradient id="neonCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              {/* Luxurious Flowing Coat Lining (Violet to Royal Indigo) */}
              <linearGradient id="capeSilkLining" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="45%" stopColor="#7c3aed" />
                <stop offset="85%" stopColor="#4338ca" />
                <stop offset="100%" stopColor="#2e1065" />
              </linearGradient>

              {/* Exterior Coat Leather Fabric */}
              <linearGradient id="coatLeather" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e2433" />
                <stop offset="50%" stopColor="#111622" />
                <stop offset="100%" stopColor="#090d15" />
              </linearGradient>

              {/* Natural Skin Tone with Shadow */}
              <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffeed9" />
                <stop offset="70%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fba667" />
              </linearGradient>

              {/* Midnight Hair with Cyan Frost Rim */}
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="50%" stopColor="#18212f" />
                <stop offset="100%" stopColor="#0b0f17" />
              </linearGradient>

              {/* Golden Quest Relic Key Gradient */}
              <linearGradient id="goldKeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>

              {/* Glow Filters */}
              <filter id="cyanGlowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="keyGlowEffect" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* =============================================================
                1. BILLOWING TRENCH COAT TAILS (Back Layer, Animated)
                ============================================================= */}
            <g className="animate-char-cape">
              {/* Left Flowing Coat Tail */}
              <path
                d="M82 148 C60 175, 42 225, 46 270 C60 252, 78 220, 88 190 Z"
                fill="url(#coatLeather)"
                stroke="#090d15"
                strokeWidth="1.2"
              />
              {/* Left Coat Interior Silk Flash */}
              <path
                d="M58 205 C50 240, 46 270, 46 270 C58 255, 72 232, 80 208 Z"
                fill="url(#capeSilkLining)"
                opacity="0.95"
              />

              {/* Right Flowing Coat Tail */}
              <path
                d="M158 148 C180 175, 198 225, 194 270 C180 252, 162 220, 152 190 Z"
                fill="url(#coatLeather)"
                stroke="#090d15"
                strokeWidth="1.2"
              />
              {/* Right Coat Interior Silk Flash */}
              <path
                d="M182 205 C190 240, 194 270, 194 270 C182 255, 168 232, 160 208 Z"
                fill="url(#capeSilkLining)"
                opacity="0.95"
              />

              {/* Cyan Luminous Piping Along Coat Rim */}
              <path
                d="M46 270 Q58 250 82 210"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeLinecap="round"
                filter="url(#cyanGlowEffect)"
                opacity="0.85"
              />
              <path
                d="M194 270 Q182 250 158 210"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeLinecap="round"
                filter="url(#cyanGlowEffect)"
                opacity="0.85"
              />
            </g>

            {/* =============================================================
                2. LEGS, COMBAT PANTS & HIGH-TECH BOOTS
                ============================================================= */}
            <g>
              {/* Left Leg */}
              <path
                d="M94 175 L86 235 L88 268 L104 268 L106 230 L110 175 Z"
                fill="#111624"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              {/* Left Tactical Straps */}
              <line x1="88" y1="205" x2="108" y2="202" stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
              <line x1="87" y1="220" x2="107" y2="217" stroke="#334155" strokeWidth="1.5" />
              {/* Left Armored Knee Guard */}
              <path d="M85 222 L106 220 L104 235 L87 236 Z" fill="url(#heroArmorPlate)" stroke="#475569" strokeWidth="1" />
              
              {/* Left Combat Boot */}
              <path
                d="M86 260 L84 286 L108 286 L106 260 Z"
                fill="url(#heroArmorDark)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Left Boot Sole Glowing Tread */}
              <rect x="82" y="284" width="28" height="4.5" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" filter="url(#cyanGlowEffect)" />

              {/* Right Leg */}
              <path
                d="M146 175 L154 235 L152 268 L136 268 L134 230 L130 175 Z"
                fill="#111624"
                stroke="#1e293b"
                strokeWidth="1.5"
              />
              {/* Right Tactical Straps */}
              <line x1="152" y1="205" x2="132" y2="202" stroke="#38bdf8" strokeWidth="1.2" opacity="0.7" />
              <line x1="153" y1="220" x2="133" y2="217" stroke="#334155" strokeWidth="1.5" />
              {/* Right Armored Knee Guard */}
              <path d="M155 222 L134 220 L136 235 L153 236 Z" fill="url(#heroArmorPlate)" stroke="#475569" strokeWidth="1" />

              {/* Right Combat Boot */}
              <path
                d="M154 260 L156 286 L132 286 L134 260 Z"
                fill="url(#heroArmorDark)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Right Boot Sole Glowing Tread */}
              <rect x="130" y="284" width="28" height="4.5" rx="2" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" filter="url(#cyanGlowEffect)" />
            </g>

            {/* =============================================================
                3. TORSO, HIGH-COLLAR JACKET & ARMORED CHESTPLATE
                ============================================================= */}
            <g>
              {/* Under-Armor Compression Suit */}
              <path
                d="M92 98 L148 98 L142 175 L98 175 Z"
                fill="#0b0f17"
                stroke="#1e293b"
                strokeWidth="1.5"
              />

              {/* High-Tech Techwear Coat Bodice */}
              <path
                d="M84 96 L156 96 L148 174 L92 174 Z"
                fill="url(#coatLeather)"
                stroke="#1e293b"
                strokeWidth="1.5"
              />

              {/* Beveled Titanium Chest Armor */}
              <path
                d="M96 102 L144 102 L138 144 L120 156 L102 144 Z"
                fill="url(#heroArmorPlate)"
                stroke="#475569"
                strokeWidth="1.5"
              />

              {/* Glowing Arc Reactor / Energy Matrix Core */}
              <polygon
                points="120,118 130,130 120,142 110,130"
                fill="url(#neonCyanGlow)"
                filter="url(#cyanGlowEffect)"
              />
              <polygon points="120,122 126,130 120,138 114,130" fill="#ffffff" />
              {/* Energy circuit lines radiating from core */}
              <line x1="120" y1="106" x2="120" y2="116" stroke="#38bdf8" strokeWidth="1.5" filter="url(#cyanGlowEffect)" />
              <line x1="102" y1="130" x2="108" y2="130" stroke="#38bdf8" strokeWidth="1.5" filter="url(#cyanGlowEffect)" />
              <line x1="132" y1="130" x2="138" y2="130" stroke="#38bdf8" strokeWidth="1.5" filter="url(#cyanGlowEffect)" />

              {/* Tactical Utility Belt with Golden Buckle */}
              <rect x="90" y="166" width="60" height="9" rx="2" fill="#141c2b" stroke="#334155" strokeWidth="1.2" />
              <rect x="114" y="164.5" width="12" height="12" rx="2" fill="url(#goldKeyGrad)" stroke="#fef08a" strokeWidth="1" />
              <circle cx="120" cy="170.5" r="2" fill="#0f172a" />
              {/* Pouch detail */}
              <rect x="94" y="167" width="8" height="7" rx="1.5" fill="#1e293b" />
              <rect x="138" y="167" width="8" height="7" rx="1.5" fill="#1e293b" />
            </g>

            {/* =============================================================
                4. SHOULDERS & ARMS (Right Arm holding Golden Key, Left Relaxed)
                ============================================================= */}
            <g>
              {/* Left Arm (Hero's Left - on our right side holding the Golden Key) */}
              {/* Left Armored Pauldron / Shoulder Plate */}
              <path
                d="M148 92 L172 98 L168 122 L144 116 Z"
                fill="url(#heroArmorPlate)"
                stroke="#38bdf8"
                strokeWidth="1.5"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
              />
              <path d="M152 96 L168 100" stroke="#67e8f9" strokeWidth="1.5" filter="url(#cyanGlowEffect)" />

              {/* Left Bicep & Forearm */}
              <path
                d="M152 114 L170 148 L162 178 L148 152 Z"
                fill="url(#coatLeather)"
                stroke="#1e293b"
                strokeWidth="1.2"
              />
              {/* Cyber Gauntlet */}
              <path
                d="M158 150 L166 178 L152 182 L148 154 Z"
                fill="url(#heroArmorDark)"
                stroke="#38bdf8"
                strokeWidth="1.2"
              />
              <circle cx="158" cy="166" r="2.5" fill="#38bdf8" filter="url(#cyanGlowEffect)" />

              {/* Hand Holding Floating Golden Quest Key */}
              <circle cx="158" cy="186" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.8" />

              {/* RADIANT GOLDEN QUEST KEY RELIC (Floating in Palm with Glow) */}
              <g transform="translate(158, 178)" filter="url(#keyGlowEffect)">
                {/* Aura Bloom */}
                <circle cx="12" cy="0" r="14" fill="#f59e0b" opacity="0.3" filter="url(#cyanGlowEffect)" />
                {/* Key Loop Handle */}
                <circle cx="0" cy="0" r="7" fill="none" stroke="url(#goldKeyGrad)" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="3.5" fill="#fef08a" />
                {/* Key Stem */}
                <path d="M7 0 L24 0" stroke="url(#goldKeyGrad)" strokeWidth="3" strokeLinecap="round" />
                {/* Key Teeth */}
                <path d="M17 0 L17 7 M22 0 L22 5" stroke="url(#goldKeyGrad)" strokeWidth="2.5" strokeLinecap="round" />
                {/* Drifting Golden Embers */}
                <circle cx="6" cy="-8" r="1.5" fill="#fef08a" />
                <circle cx="20" cy="-6" r="1.2" fill="#fed7aa" />
                <circle cx="26" cy="6" r="1.4" fill="#f59e0b" />
              </g>

              {/* Right Arm (Hero's Right - on our left side, relaxed hero stance) */}
              {/* Right Shoulder Pauldron */}
              <path
                d="M92 92 L68 98 L72 122 L96 116 Z"
                fill="url(#heroArmorPlate)"
                stroke="#38bdf8"
                strokeWidth="1.5"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
              />
              <path d="M88 96 L72 100" stroke="#67e8f9" strokeWidth="1.5" filter="url(#cyanGlowEffect)" />

              {/* Right Arm & Forearm */}
              <path
                d="M88 114 L70 148 L78 178 L92 152 Z"
                fill="url(#coatLeather)"
                stroke="#1e293b"
                strokeWidth="1.2"
              />
              {/* Right Cyber Gauntlet */}
              <path
                d="M82 150 L74 178 L88 182 L92 154 Z"
                fill="url(#heroArmorDark)"
                stroke="#38bdf8"
                strokeWidth="1.2"
              />
              <circle cx="82" cy="166" r="2.5" fill="#38bdf8" filter="url(#cyanGlowEffect)" />
              {/* Hand in Tactical Fist / Grip */}
              <circle cx="82" cy="186" r="6" fill="#fed7aa" stroke="#c2410c" strokeWidth="0.8" />
            </g>

            {/* =============================================================
                5. NECK, HIGH-TECH COLLAR, JAW & REALISTIC ANIME HEAD
                ============================================================= */}
            <g>
              {/* Neck & Cowl */}
              <path d="M110 75 L130 75 L132 94 L108 94 Z" fill="url(#skinTone)" />
              {/* High Stand-Up Coat Collar */}
              <path
                d="M98 70 L108 92 L132 92 L142 70 L128 82 L112 82 Z"
                fill="url(#coatLeather)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <path d="M98 70 L108 92" stroke="#38bdf8" strokeWidth="1.5" filter="url(#cyanGlowEffect)" />
              <path d="M142 70 L132 92" stroke="#38bdf8" strokeWidth="1.5" filter="url(#cyanGlowEffect)" />

              {/* Anime Face Contour (Sharp Chin & Jawline) */}
              <path
                d="M106 44 C106 62, 114 74, 120 78 C126 74, 134 62, 134 44 Z"
                fill="url(#skinTone)"
                stroke="#f97316"
                strokeWidth="0.6"
              />

              {/* Confident Anime Mouth & Subtle Nose */}
              <path d="M118 64 Q120 65 122 64" stroke="#c2410c" strokeWidth="1" strokeLinecap="round" />
              <path d="M117 69 Q120 71 123 69" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round" />

              {/* Sharp Expressive Anime Eyes with Cyan Pupil Glow */}
              {/* Right Eye (our left) */}
              <path d="M110 52 Q115 48 118 52" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <ellipse cx="114" cy="54" rx="2.5" ry="3.2" fill="#0284c7" filter="url(#cyanGlowEffect)" />
              <circle cx="114" cy="54" r="1.5" fill="#38bdf8" />
              <circle cx="113" cy="52.5" r="0.9" fill="#ffffff" />

              {/* Left Eye with Futuristic Holographic Scouter Monocle */}
              <path d="M122 52 Q125 48 130 52" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <ellipse cx="126" cy="54" rx="2.5" ry="3.2" fill="#0284c7" filter="url(#cyanGlowEffect)" />
              <circle cx="126" cy="54" r="1.5" fill="#38bdf8" />
              <circle cx="125" cy="52.5" r="0.9" fill="#ffffff" />

              {/* Holographic Cyber Eyepiece / Tactical HUD Reticle */}
              <rect x="121" y="47" width="11" height="11" rx="2.5" fill="none" stroke="#22d3ee" strokeWidth="1.2" opacity="0.85" filter="url(#cyanGlowEffect)" />
              <circle cx="132" cy="50" r="1.5" fill="#38bdf8" filter="url(#cyanGlowEffect)" />
              <line x1="132" y1="50" x2="136" y2="46" stroke="#22d3ee" strokeWidth="1" />

              {/* Tactical Cyber Earpiece on Left Ear */}
              <rect x="133" y="52" width="4" height="8" rx="1.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="135" cy="56" r="1.2" fill="#38bdf8" filter="url(#cyanGlowEffect)" />

              {/* Anime Eyebrows */}
              <path d="M109 46 Q114 43 118 47" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M122 47 Q126 43 131 46" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />

              {/* Layered Wind-Tossed Anime Spiky Hair */}
              {/* Back Hair Strands */}
              <path
                d="M104 46 C96 32, 102 18, 120 18 C138 18, 144 32, 136 46 Z"
                fill="url(#hairGrad)"
              />

              {/* Front Bangs & Dynamic Spikes */}
              {/* Center Forehead Bang */}
              <path d="M118 20 Q122 38 120 48 Q116 36 114 28 Z" fill="url(#hairGrad)" />
              {/* Left Swept Spikes */}
              <path d="M112 22 Q102 32 104 44 Q110 36 114 30 Z" fill="url(#hairGrad)" />
              <path d="M106 28 Q94 38 98 50 Q104 44 108 38 Z" fill="url(#hairGrad)" />
              {/* Right Swept Spikes */}
              <path d="M124 22 Q136 32 134 44 Q128 36 124 30 Z" fill="url(#hairGrad)" />
              <path d="M130 28 Q144 38 140 50 Q134 44 130 38 Z" fill="url(#hairGrad)" />
              {/* Top Spikes */}
              <path d="M120 18 Q124 8 128 16 Q122 14 120 18 Z" fill="url(#hairGrad)" />
              <path d="M114 18 Q110 10 116 16 Z" fill="url(#hairGrad)" />

              {/* Cyan Neon Edge Frost Highlights on Hair Tips */}
              <path d="M100 48 Q104 38 110 26" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
              <path d="M140 48 Q134 38 128 26" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" opacity="0.8" />
              <path d="M124 8 Q128 14 126 22" stroke="#67e8f9" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
            </g>

            {/* =============================================================
                6. SUMMONING RUNE PEDESTAL & GROUND SHADOW
                ============================================================= */}
            <g transform="translate(120, 290)">
              {/* Deep Ground Contact Shadow */}
              <ellipse cx="0" cy="0" rx="44" ry="7" fill="#000000" opacity="0.65" filter="blur(3px)" />
              {/* Glowing Cyber Summoning Circle Ring */}
              <ellipse
                cx="0"
                cy="0"
                rx="58"
                ry="10"
                fill="none"
                stroke="url(#neonCyanGlow)"
                strokeWidth="1.6"
                strokeDasharray="14 6 4 6"
                filter="url(#cyanGlowEffect)"
                opacity="0.85"
                className="animate-spin-slow"
              />
              <ellipse
                cx="0"
                cy="0"
                rx="68"
                ry="12"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1"
                strokeDasharray="20 8"
                opacity="0.5"
                className="animate-spin-reverse"
              />
              {/* 4 Cardinal Rune Nodes */}
              <circle cx="-58" cy="0" r="2" fill="#38bdf8" filter="url(#cyanGlowEffect)" />
              <circle cx="58" cy="0" r="2" fill="#38bdf8" filter="url(#cyanGlowEffect)" />
              <circle cx="0" cy="-10" r="1.8" fill="#c084fc" filter="url(#cyanGlowEffect)" />
              <circle cx="0" cy="10" r="1.8" fill="#c084fc" filter="url(#cyanGlowEffect)" />
            </g>

            {/* Micro Floating Energy Sparkles */}
            <circle cx="70" cy="120" r="1.5" fill="#38bdf8" filter="url(#cyanGlowEffect)" />
            <circle cx="175" cy="110" r="1.5" fill="#c084fc" filter="url(#cyanGlowEffect)" />
            <circle cx="100" cy="240" r="1.2" fill="#38bdf8" filter="url(#cyanGlowEffect)" />
            <circle cx="145" cy="235" r="1.2" fill="#fef08a" filter="url(#cyanGlowEffect)" />
          </svg>

        </div>

        {/* 3. Subtle Dynamic Ground Ambient Base */}
        <div className="relative -mt-4 flex items-center justify-center pointer-events-none">
          <div className="w-36 sm:w-48 h-3 rounded-full bg-blue-500/15 blur-md animate-char-shadow" />
        </div>

      </div>

    </div>
  );
};
