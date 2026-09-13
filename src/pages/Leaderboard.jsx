import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Crown, Medal, Clock, Award, Sparkles, RefreshCw, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { Sidebar } from '../components/Sidebar';
import { soundFx } from '../lib/soundEffects';
import { SEOHead } from '../components/SEOHead';

export const Leaderboard = () => {
  const { user, token } = useAuth();
  const { profile } = useGame();
  const [period, setPeriod] = useState('Weekly'); // 'Weekly' | 'Monthly'

  // Client-side cache to enable instant tab switching without loading spinners
  const cacheRef = React.useRef({
    Weekly: null,
    Monthly: null
  });

  const [rankings, setRankings] = useState(() => {
    try {
      const saved = sessionStorage.getItem('rpg_leaderboard_Weekly');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => rankings.length === 0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRankings = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);

    // If we have no data at all for this period, show spinner; otherwise update silently in background
    if (!cacheRef.current[period] && rankings.length === 0) {
      setLoading(true);
    }

    try {
      const activeToken = token || localStorage.getItem('rpg_auth_token');
      const forceParam = isManualRefresh ? '&force=true' : '';
      const res = await fetch(`/api/progress/leaderboard?period=${period}${forceParam}`, {
        headers: {
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.rankings)) {
        const currentUserId = user?.id;
        const normalized = data.rankings.map(r => ({
          ...r,
          isYou: r.id === currentUserId || (profile && r.username === profile.username)
        }));

        cacheRef.current[period] = normalized;
        try {
          sessionStorage.setItem('rpg_leaderboard_' + period, JSON.stringify(normalized));
        } catch (_) {}

        setRankings(normalized);
      }
    } catch (err) {
      console.error('Failed to fetch real leaderboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period, token, user?.id, profile?.username, rankings.length]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === period) return;
    soundFx.playClick();
    setPeriod(newPeriod);

    // Instant switch if we have cached data for that period!
    if (cacheRef.current[newPeriod]) {
      setRankings(cacheRef.current[newPeriod]);
      setLoading(false);
    } else {
      try {
        const saved = sessionStorage.getItem('rpg_leaderboard_' + newPeriod);
        if (saved) {
          const parsed = JSON.parse(saved);
          cacheRef.current[newPeriod] = parsed;
          setRankings(parsed);
          setLoading(false);
        } else {
          setLoading(true);
        }
      } catch {
        setLoading(true);
      }
    }
  };

  const handleManualRefresh = () => {
    soundFx.playClick();
    fetchRankings(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-[#070b14] relative overflow-hidden">
      {/* Ambient Anime Artwork Backdrop with Rich Color Grading */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-30 z-0"
        style={{ backgroundImage: 'url("/home-bg.jpg")' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#070b14]/75 via-[#070b14]/55 to-[#070b14]/85 pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar className="hidden md:flex relative z-10" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto space-y-6 relative z-10">
        <SEOHead
          title="Global Hero Leaderboard"
          description="See top ranked adventurers, weekly and monthly XP rankings, and compete with other real registered heroes in Life RPG."
          canonical="/leaderboard"
        />
        
        {/* Header & Reset Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-heading font-black text-white drop-shadow">
                Leaderboard
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Real Adventurers Only
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Only real registered heroes who complete daily tasks appear here.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              title="Refresh Leaderboard"
              className="p-2.5 rounded-xl bg-[#0a1020]/75 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white hover:border-violet-500/40 transition-all disabled:opacity-50 shadow-lg"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-violet-400' : ''}`} />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a1020]/75 backdrop-blur-xl border border-white/10 text-slate-300 text-xs font-medium shadow-lg">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>Resets in: <strong className="text-white">5d 12h 30m</strong></span>
            </div>
          </div>
        </div>

        {/* Tabs: Weekly / Monthly */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a1020]/75 backdrop-blur-xl border border-white/10 w-fit shadow-lg">
            {['Weekly', 'Monthly'].map((tab) => {
              const isActive = period === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handlePeriodChange(tab)}
                  className={`px-5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-violet-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-300 bg-[#0a1020]/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow">
            Active: <strong className="text-white">{rankings.length}</strong> {rankings.length === 1 ? 'Hero' : 'Heroes'}
          </div>
        </div>

        {/* Main 2 Columns: Rankings Table (Left 8 cols) & Rewards Showcase (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Table Container */}
          <section aria-label="Adventurer Rankings" className="lg:col-span-8 bg-[#0a1020]/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[440px]">
                <div className="p-4 border-b border-white/10 grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-white/[0.03]">
                  <div className="col-span-2 text-center">Rank</div>
                  <div className="col-span-5">Player</div>
                  <div className="col-span-2 text-center">Level</div>
                  <div className="col-span-3 text-right pr-4">XP ({period})</div>
                </div>

            {loading ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400">Scanning neural database rankings...</p>
              </div>
            ) : rankings.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <Trophy className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="font-heading font-bold text-sm text-slate-200">
                  No Quests Completed This Period Yet
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Complete your daily quests on the dashboard to earn XP and claim the #1 Champion spot!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {rankings.map((player) => (
                  <div
                    key={player.id || player.name}
                    className={`grid grid-cols-12 items-center p-3.5 sm:p-4 text-xs sm:text-sm transition-all ${
                      player.isYou
                        ? 'bg-gradient-to-r from-violet-600/90 via-indigo-600/90 to-purple-600/90 text-white font-bold shadow-lg border-y border-violet-400/40'
                        : 'hover:bg-white/[0.04] text-slate-200'
                    }`}
                  >
                    {/* Rank & Medal */}
                    <div className="col-span-2 text-center font-heading font-black text-sm">
                      {player.medal}
                    </div>

                    {/* Player Name & Avatar Icon */}
                    <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${player.isYou ? 'bg-white text-violet-700' : 'bg-white/10 text-slate-200 border border-white/10'}`}>
                        {(player.name || 'H')[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate">{player.name}</span>
                          {player.isYou && (
                            <span className="text-[9px] bg-white/25 px-1.5 py-0.5 rounded font-black uppercase tracking-wider shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        {player.streak > 0 && (
                          <div className={`text-[10px] ${player.isYou ? 'text-white/90' : 'text-amber-400'}`}>
                            🔥 {player.streak} day streak
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Level */}
                    <div className="col-span-2 text-center font-medium">
                      Lv. {player.level}
                    </div>

                    {/* Total XP */}
                    <div className="col-span-3 text-right pr-4 font-mono font-bold text-cyan-300">
                      {(player.xp || 0).toLocaleString()} XP
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3.5 bg-black/40 border-t border-white/10 text-center text-xs font-semibold text-slate-400 tracking-wider flex items-center justify-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real Accounts & Verified Completions Only</span>
            </div>
              </div>
            </div>
          </section>

          {/* Right Rewards Card matching Screen 7 */}
          <section aria-labelledby="tier-rewards-heading" className="lg:col-span-4 bg-[#0a1020]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
            <h2 id="tier-rewards-heading" className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Tier Rewards</span>
            </h2>

            {/* Weekly Reward */}
            <div className="bg-white/[0.04] rounded-2xl p-4 border border-white/10 hover:border-amber-500/40 transition-all flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl shrink-0 shadow-inner">
                👑
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Weekly #1</div>
                <div className="font-heading font-bold text-sm text-white">Rare Badge</div>
                <div className="text-[11px] text-slate-400">+ 1,000 Gold • Prestige Glow</div>
              </div>
            </div>

            {/* Monthly Reward */}
            <div className="bg-white/[0.04] rounded-2xl p-4 border border-white/10 hover:border-purple-500/40 transition-all flex items-center gap-3.5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl shrink-0 shadow-inner">
                💎
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Monthly #1</div>
                <div className="font-heading font-bold text-sm text-white">Legendary Theme</div>
                <div className="text-[11px] text-slate-400">Exclusive "Stay Devout" Aura</div>
              </div>
            </div>

            {/* Motivation message */}
            <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs text-center space-y-1">
              <div className="font-bold">Sunday Reset System</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">
                Top 3 ranked adventurers automatically receive rewards at midnight every Sunday.
              </div>
            </div>
          </section>

        </div>

      </main>
    </div>
  );
};
