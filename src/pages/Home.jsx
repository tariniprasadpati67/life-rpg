import React from 'react';
import { Hero } from '../components/Hero';
import { SEOHead } from '../components/SEOHead';

export const Home = () => {
  return (
    <div className="bg-[#0b0e17]">
      <SEOHead
        title="Turn Your Real Life Into A Game"
        description="Turn everyday goals into RPG quests. Complete tasks, earn XP, build streaks, and level up your life."
        canonical="/"
      />
      {/* Hero Section matching reference */}
      <Hero />
    </div>
  );
};
