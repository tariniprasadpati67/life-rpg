import React from 'react';
import { getBadgeStyle } from '../lib/cosmetics';

const SIZES = {
  xs: 'w-7 h-7 sm:w-8 sm:h-8',
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-24 h-24 sm:w-28 sm:h-28',
  xl: 'w-36 h-36'
};

export const BadgeGraphic = ({ 
  badgeName = 'Novice Adventurer', 
  size = 'md', 
  className = '',
  showGlow = true
}) => {
  const badgeData = getBadgeStyle(badgeName);
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none ${sizeClass} ${className}`}>
      {/* Ambient Theme Back-Glow */}
      {showGlow && (
        <div 
          className="absolute inset-2 rounded-full pointer-events-none blur-md opacity-50 transition-opacity duration-300"
          style={{ backgroundColor: badgeData.glowColor }}
        />
      )}

      {/* Badge PNG Graphic with drop shadow */}
      <img
        src={badgeData.iconUrl}
        alt={badgeData.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] filter hover:brightness-110 transition-all duration-300"
        onError={(e) => {
          // Fallback if image fails to load
          e.target.onerror = null;
          e.target.src = '/badges/badge-novice.png';
        }}
      />
    </div>
  );
};
