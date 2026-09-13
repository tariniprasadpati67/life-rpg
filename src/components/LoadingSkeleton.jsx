import React from 'react';

export const QuestSkeleton = () => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-cyber-card/60 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <div className="w-16 h-5 rounded-full bg-slate-800" />
          <div className="w-14 h-5 rounded bg-slate-800" />
        </div>
        <div className="w-6 h-6 rounded bg-slate-800" />
      </div>
      <div className="w-3/4 h-5 rounded bg-slate-800 mb-2" />
      <div className="w-full h-4 rounded bg-slate-800/60 mb-6" />
      <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
        <div className="w-20 h-7 rounded-lg bg-slate-800" />
        <div className="w-24 h-9 rounded-xl bg-slate-800" />
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Top HUD Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-44 rounded-2xl bg-cyber-card/70 border border-slate-800" />
        <div className="h-44 rounded-2xl bg-cyber-card/70 border border-slate-800" />
      </div>

      {/* Quests Section Skeleton */}
      <div className="space-y-4">
        <div className="w-48 h-8 rounded-lg bg-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <QuestSkeleton />
          <QuestSkeleton />
          <QuestSkeleton />
        </div>
      </div>
    </div>
  );
};
