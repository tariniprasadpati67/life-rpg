import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Check, 
  Sparkles, 
  Shield, 
  Flame, 
  Award, 
  Zap, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Sidebar } from '../components/Sidebar';
import { AvatarFrame } from '../components/AvatarFrame';
import { BadgeGraphic } from '../components/BadgeGraphic';
import { VictoryEmoteOverlay } from '../components/VictoryEmoteOverlay';
import { 
  AVATAR_FRAMES_CATALOG, 
  BADGE_CATALOG, 
  SPECIAL_ITEMS_CATALOG,
  getStreakFlameStyle
} from '../lib/cosmetics';
import { SEOHead } from '../components/SEOHead';

// Diamond Exchange Bundles (10 Gold = 1 Diamond baseline with bonus tiers)
const DIAMOND_BUNDLES = [
  { id: 'pack-25', diamonds: 25, goldCost: 250, label: 'Starter Pouch', badge: 'Standard' },
  { id: 'pack-50', diamonds: 50, goldCost: 500, label: 'Adventurer Cache', badge: 'Popular' },
  { id: 'pack-100', diamonds: 100, goldCost: 1000, label: 'Hero Stash', badge: 'Best Value', featured: true },
  { id: 'pack-250', diamonds: 250, goldCost: 2250, label: 'Champion Vault', badge: '10% Bonus', bonus: '+25 Extra' },
  { id: 'pack-500', diamonds: 500, goldCost: 4000, label: 'Sovereign Treasury', badge: '20% Bonus', bonus: '+100 Extra' },
];

export const Shop = () => {
  const { 
    profile, 
    buyShopItem, 
    convertGoldToDiamonds,
    equipCosmetic, 
    unequipCosmetic, 
    previewCompletionEffect 
  } = useGame();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Diamond Exchange' | 'Avatar Frames' | 'Badges' | 'Special Items'
  const [filterStatus, setFilterStatus] = useState('All'); // 'All' | 'Owned' | 'Equipped' | 'Available'
  const [previewEmote, setPreviewEmote] = useState(null);
  const [purchaseFeedback, setPurchaseFeedback] = useState(null);
  const [customGoldInput, setCustomGoldInput] = useState('1000');
  const [isConverting, setIsConverting] = useState(false);

  const inventory = profile?.inventory || [];
  const equippedFrame = profile?.equipped_frame;
  const equippedBadge = profile?.equipped_badge;
  const equippedAura = profile?.equipped_aura;
  const equippedCompletionEffect = profile?.equipped_completion_effect;
  const equippedVictoryEmote = profile?.equipped_victory_emote;
  const equippedStreakFlame = profile?.equipped_streak_flame;
  const streakShields = Number(profile?.streak_shields) || 0;

  // Handle Buy with feedback
  const handleBuy = async (item) => {
    const res = await buyShopItem(item);
    if (res && (res === true || res.success)) {
      setPurchaseFeedback({
        item,
        type: 'purchase',
        message: res.message || `Successfully acquired ${item.name}! Saved to your collection.`
      });
      setTimeout(() => setPurchaseFeedback(null), 3500);
    } else {
      setPurchaseFeedback({
        item,
        type: 'error',
        error: res?.error || 'Failed to complete transaction.'
      });
      setTimeout(() => setPurchaseFeedback(null), 5000);
    }
  };

  // Handle Equip with feedback
  const handleEquip = (type, item) => {
    equipCosmetic(type, item);
    setPurchaseFeedback({
      item,
      type: 'equip'
    });
    setTimeout(() => setPurchaseFeedback(null), 2500);
  };

  // Handle Unequip
  const handleUnequip = (type) => {
    unequipCosmetic(type);
    setPurchaseFeedback({
      item: { name: type === 'streak_shield' ? 'Shield Orbit' : 'Orbit' },
      type: 'unequip'
    });
    setTimeout(() => setPurchaseFeedback(null), 3000);
  };

  // Handle Convert Bundle (Gold -> Diamonds)
  const handleConvertBundle = async (bundle) => {
    setIsConverting(true);
    const res = await convertGoldToDiamonds(bundle.goldCost, bundle.diamonds);
    setIsConverting(false);
    if (res && res.success) {
      setPurchaseFeedback({
        type: 'convert',
        message: res.message || `Transmuted ${bundle.goldCost.toLocaleString()} Gold into ${bundle.diamonds.toLocaleString()} Diamonds!`
      });
      setTimeout(() => setPurchaseFeedback(null), 4000);
    } else {
      setPurchaseFeedback({
        type: 'error',
        error: res?.error || 'Failed to convert currency.'
      });
      setTimeout(() => setPurchaseFeedback(null), 4000);
    }
  };

  // Handle Custom Gold -> Diamonds Conversion
  const handleConvertCustom = async () => {
    const gold = Number(customGoldInput);
    if (!gold || gold < 10) {
      setPurchaseFeedback({
        type: 'error',
        error: 'Minimum conversion amount is 10 Gold (1 Diamond).'
      });
      setTimeout(() => setPurchaseFeedback(null), 3000);
      return;
    }
    const diamonds = Math.floor(gold / 10);
    setIsConverting(true);
    const res = await convertGoldToDiamonds(gold, diamonds);
    setIsConverting(false);
    if (res && res.success) {
      setPurchaseFeedback({
        type: 'convert',
        message: res.message || `Transmuted ${gold.toLocaleString()} Gold into ${diamonds.toLocaleString()} Diamonds!`
      });
      setTimeout(() => setPurchaseFeedback(null), 4000);
    } else {
      setPurchaseFeedback({
        type: 'error',
        error: res?.error || 'Failed to convert currency.'
      });
      setTimeout(() => setPurchaseFeedback(null), 4000);
    }
  };

  // Determine item equipped status
  const isItemEquipped = (item) => {
    if (item.type === 'frame') return (equippedFrame || 'Fire Frame') === item.name;
    if (item.type === 'badge') return (equippedBadge || 'Novice Adventurer') === item.name;
    if (item.type === 'streak_shield') {
      const shieldActive = Boolean(profile?.equipped_streak_shield && streakShields > 0);
      const shieldAura = (profile?.equipped_aura || '').toLowerCase().includes('shield');
      return shieldActive || shieldAura;
    }
    if (item.category === 'orbit' || item.type === 'aura') {
      const curAura = (equippedAura || '').toLowerCase();
      const targetName = (item.name || '').toLowerCase();
      return curAura === targetName || (curAura && targetName && curAura.includes(targetName.replace(' orbit', '')));
    }
    if (item.type === 'completion_effect') return equippedCompletionEffect === item.name;
    if (item.type === 'victory_emote') return equippedVictoryEmote === item.name;
    if (item.type === 'streak_flame') return equippedStreakFlame === item.name;
    return false;
  };

  // Determine item owned status
  const isItemOwned = (item) => {
    if (item.type === 'streak_shield') return streakShields > 0;
    if (item.name === 'Fire Frame' || item.name === 'Novice Adventurer') return true;
    return inventory.includes(item.id);
  };

  // Determine which type string to pass to equipCosmetic
  const getCosmeticType = (item) => {
    if (item.type === 'frame') return 'frame';
    if (item.type === 'badge') return 'badge';
    if (item.type === 'streak_shield') return 'streak_shield';
    if (item.category === 'orbit' || item.type === 'aura') return 'aura';
    return 'aura';
  };

  // Filter items
  const filterList = (items) => {
    return items.filter(item => {
      const owned = isItemOwned(item);
      const equipped = isItemEquipped(item);
      if (filterStatus === 'Owned') return owned;
      if (filterStatus === 'Equipped') return equipped;
      if (filterStatus === 'Available') return !owned && !item.isConsumable;
      return true;
    });
  };

  const visibleFrames = (activeTab === 'All' || activeTab === 'Avatar Frames') ? filterList(AVATAR_FRAMES_CATALOG) : [];
  const visibleBadges = (activeTab === 'All' || activeTab === 'Badges') ? filterList(BADGE_CATALOG) : [];
  const visibleSpecial = (activeTab === 'All' || activeTab === 'Special Items') ? filterList(SPECIAL_ITEMS_CATALOG) : [];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex bg-[#070b14] text-slate-100 relative overflow-hidden">
      {/* Ambient Anime Artwork Backdrop with Rich Color Grading */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-30 z-0"
        style={{ backgroundImage: 'url("/home-bg.jpg")' }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-[#070b14]/75 via-[#070b14]/55 to-[#070b14]/85 pointer-events-none z-0" />

      {/* Sidebar */}
      <Sidebar className="hidden md:flex relative z-10" />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl overflow-y-auto space-y-8 relative z-10">
        <SEOHead
          title="Hero Marketplace & Cosmetics"
          description="Exchange gold for diamonds, unlock animated avatar frames, prestige rank badges, and celestial avatar orbits in the Life RPG Shop."
          canonical="/shop"
        />

        {/* 1. Header & Live Currency HUD */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-violet-400" />
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                HERO MARKETPLACE
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Acquire exclusive collectible cosmetic armor, 3D rank crests, and tactical RPG enhancements.
            </p>
          </div>

          {/* Currencies Pill Container with Frosted Glass */}
          <div className="flex items-center gap-3 bg-[#0a1020]/80 border border-white/10 p-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-xl backdrop-blur-xl self-start md:self-auto">
            {/* Gold Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 font-heading font-bold text-xs sm:text-sm shadow-sm">
              <span>🪙</span>
              <span>{(profile?.gold ?? 850).toLocaleString()}</span>
              <span className="text-[10px] text-amber-400/80 font-normal hidden sm:inline">GOLD</span>
            </div>

            {/* Diamonds Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-heading font-bold text-xs sm:text-sm shadow-sm">
              <span>💎</span>
              <span>{(profile?.diamonds ?? 40).toLocaleString()}</span>
              <span className="text-[10px] text-cyan-400/80 font-normal hidden sm:inline">DIAMONDS</span>
            </div>

            {/* Quick Convert Button */}
            <button
              onClick={() => setActiveTab('Diamond Exchange')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 border border-cyan-400/40 text-cyan-300 font-heading font-bold text-xs hover:bg-cyan-500/30 hover:border-cyan-300 transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)]"
              title="Convert Gold to Diamonds"
            >
              <span>🔄</span>
              <span className="hidden sm:inline">Convert Gold</span>
            </button>

            {/* Active Streak Shields */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-300 font-heading font-bold text-xs sm:text-sm shadow-sm" title="Active Streak Shields">
              <Shield className="w-3.5 h-3.5 text-blue-400 fill-blue-400/30" />
              <span>{streakShields}</span>
              <span className="text-[10px] text-blue-400/80 font-normal hidden sm:inline">SHIELDS</span>
            </div>
          </div>
        </div>

        {/* Purchase / Convert Confirmation / Error Toast */}
        {purchaseFeedback && (
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between shadow-xl animate-fadeIn backdrop-blur-md ${
            purchaseFeedback.type === 'error'
              ? 'bg-rose-950/80 border-rose-500/50 text-rose-200'
              : 'bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
              {purchaseFeedback.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              <span>
                {purchaseFeedback.type === 'error'
                  ? purchaseFeedback.error
                  : purchaseFeedback.type === 'convert'
                    ? purchaseFeedback.message
                    : purchaseFeedback.type === 'purchase'
                      ? (purchaseFeedback.message || `Successfully acquired ${purchaseFeedback.item.name}! Saved to your collection.`)
                      : purchaseFeedback.type === 'unequip'
                        ? `Unequipped ${purchaseFeedback.item.name}.`
                        : `Equipped ${purchaseFeedback.item.name}! Applied to your Hero avatar.`}
              </span>
            </div>
            <button 
              onClick={() => setPurchaseFeedback(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 2. Category Tabs and Status Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'All', label: 'All Items', icon: '⚔️' },
              { id: 'Diamond Exchange', label: 'Gold ➔ Diamonds', icon: '💎' },
              { id: 'Avatar Frames', label: 'Avatar Frames', icon: '🖼️' },
              { id: 'Badges', label: 'Badges', icon: '🏆' },
              { id: 'Special Items', label: 'Avatar Orbits', icon: '🪐' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-[0_2px_14px_rgba(139,92,246,0.45)] border border-white/20'
                      : 'bg-[#0a1020]/80 backdrop-blur-xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sub Filter: Status */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#0a1020]/80 backdrop-blur-xl border border-white/10 p-1 rounded-xl">
            {['All', 'Available', 'Owned', 'Equipped'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-violet-600 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
           FEATURED: 💎 GOLD TO DIAMOND FORGE & EXCHANGE
           ========================================================================= */}
        {(activeTab === 'All' || activeTab === 'Diamond Exchange') && (
          <section className="space-y-6 bg-gradient-to-br from-[#0a1527]/95 via-[#0b1b36]/90 to-[#071120]/95 p-5 sm:p-7 rounded-3xl border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.18)] relative overflow-hidden backdrop-blur-xl">
            {/* Ambient Background Glows */}
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  💎
                </div>
                <div>
                  <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-wide flex items-center gap-2 flex-wrap">
                    <span>GOLD TO DIAMOND CONVERTER</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                      Rate: 10 Gold = 1 Diamond
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Transmute your earned gold coins into premium astral diamonds for legendary cyber frames and mythic crests.
                  </p>
                </div>
              </div>

              {/* Live Balances HUD */}
              <div className="flex items-center gap-3 self-start sm:self-auto bg-[#070d1a]/85 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 shadow-inner">
                <span className="text-slate-400">Available:</span>
                <span className="text-amber-400">🪙 {(profile?.gold ?? 0).toLocaleString()}</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400">💎 {(profile?.diamonds ?? 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Quick Instant Diamond Bundles */}
            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-heading font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Instant Exchange Bundles</span>
                </h3>
                <span className="text-[11px] text-slate-400">One-click transmutation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
                {DIAMOND_BUNDLES.map((bundle) => {
                  const canAfford = (Number(profile?.gold) || 0) >= bundle.goldCost;
                  const is100Pack = bundle.diamonds === 100;

                  return (
                    <div
                      key={bundle.id}
                      className={`relative rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between space-y-3.5 transition-all group ${
                        is100Pack
                          ? 'bg-[#0b172a] border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] ring-1 ring-cyan-400/30'
                          : 'bg-[#091222]/90 border border-cyan-500/30 hover:border-cyan-400/60 shadow-lg'
                      }`}
                    >
                      {/* Top Badge */}
                      <div className="w-full flex items-center justify-between text-[10px] font-bold">
                        <span className={`px-2 py-0.5 rounded-full border ${
                          is100Pack 
                            ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400 font-black' 
                            : bundle.bonus 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {bundle.badge}
                        </span>
                        {bundle.bonus && (
                          <span className="text-[10px] font-extrabold text-emerald-400 drop-shadow">
                            {bundle.bonus}
                          </span>
                        )}
                      </div>

                      {/* Pill graphic matching user screenshot */}
                      <div className="w-full py-1">
                        <div className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 shadow-inner transition-transform group-hover:scale-105 duration-200 ${
                          is100Pack
                            ? 'bg-[#06182c] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-1 ring-cyan-300/30'
                            : 'bg-[#071324] border-cyan-500/40'
                        }`}>
                          <span className="text-xl drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">💎</span>
                          <span className="font-heading font-black text-sm sm:text-base text-cyan-300 tracking-wider">
                            {bundle.diamonds} DIAMONDS
                          </span>
                        </div>
                      </div>

                      {/* Cost in Gold */}
                      <div className="text-center space-y-0.5">
                        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-amber-300">
                          <span>🪙</span>
                          <span>{bundle.goldCost.toLocaleString()}</span>
                          <span className="text-[10px] text-amber-400/80 font-medium">GOLD</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {bundle.label}
                        </div>
                      </div>

                      {/* Convert Action Button */}
                      <button
                        onClick={() => handleConvertBundle(bundle)}
                        disabled={!canAfford || isConverting}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
                          !canAfford
                            ? 'bg-slate-800/80 border border-slate-700/60 text-slate-500 cursor-not-allowed'
                            : is100Pack
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_18px_rgba(6,182,212,0.4)]'
                              : 'bg-cyan-600/30 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-200 hover:text-white'
                        }`}
                      >
                        {isConverting ? (
                          <span>Converting...</span>
                        ) : canAfford ? (
                          <>
                            <span>⚡ Convert</span>
                            <span>({bundle.diamonds} 💎)</span>
                          </>
                        ) : (
                          <span>Need {bundle.goldCost.toLocaleString()} Gold</span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Interactive Gold to Diamond Converter */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#070e1c]/90 border border-cyan-500/30 space-y-4 relative z-10 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🧮</span>
                  <h3 className="text-xs sm:text-sm font-heading font-black text-white uppercase tracking-wider">
                    Custom Amount Converter
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Convert any custom amount of Gold (10 Gold = 1 Diamond)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Gold Input Column */}
                <div className="md:col-span-5 space-y-2">
                  <label className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Gold to Spend:</span>
                    <span className="text-slate-400 text-[10px]">Have: {(profile?.gold ?? 0).toLocaleString()} 🪙</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🪙</span>
                    <input
                      type="number"
                      min="10"
                      step="10"
                      max={profile?.gold ?? 100000}
                      value={customGoldInput}
                      onChange={(e) => setCustomGoldInput(e.target.value)}
                      placeholder="Enter Gold (e.g. 1000)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#091426] border border-amber-500/40 text-amber-200 font-heading font-bold text-sm focus:outline-none focus:border-amber-400 transition-colors placeholder:text-slate-600"
                    />
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[100, 500, 1000, 2500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setCustomGoldInput(preset.toString())}
                        className="px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-300 hover:bg-amber-500/25 transition-colors"
                      >
                        +{preset.toLocaleString()}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setCustomGoldInput((profile?.gold ?? 0).toString())}
                      className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 hover:bg-cyan-500/25 transition-colors"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Arrow Column */}
                <div className="md:col-span-2 flex items-center justify-center py-1">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-lg shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    ➔
                  </div>
                </div>

                {/* Diamonds Result Column */}
                <div className="md:col-span-5 space-y-2">
                  <label className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                    <span>You Receive:</span>
                    <span className="text-slate-400 text-[10px]">Instant delivery</span>
                  </label>
                  <div className="w-full py-2.5 px-4 rounded-xl bg-[#06182c] border border-cyan-400/60 flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💎</span>
                      <span className="font-heading font-black text-base text-cyan-200">
                        {Math.floor((Number(customGoldInput) || 0) / 10).toLocaleString()} DIAMONDS
                      </span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                      Transmuted
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleConvertCustom}
                    disabled={
                      isConverting || 
                      !Number(customGoldInput) || 
                      Number(customGoldInput) < 10 || 
                      Number(customGoldInput) > (profile?.gold ?? 0)
                    }
                    className={`w-full py-2.5 px-4 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all ${
                      Number(customGoldInput) > (profile?.gold ?? 0)
                        ? 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-not-allowed'
                        : isConverting
                          ? 'bg-cyan-700/60 text-white cursor-wait'
                          : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/40'
                    }`}
                  >
                    {isConverting ? (
                      <span>Converting Gold to Diamonds...</span>
                    ) : Number(customGoldInput) > (profile?.gold ?? 0) ? (
                      <span>Insufficient Gold (Need {Number(customGoldInput).toLocaleString()} 🪙)</span>
                    ) : (
                      <>
                        <span>⚡ Transmute</span>
                        <span>{(Number(customGoldInput) || 0).toLocaleString()} Gold</span>
                        <span>➔</span>
                        <span>{Math.floor((Number(customGoldInput) || 0) / 10).toLocaleString()} 💎</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================================
           CATEGORY 1: 🖼️ AVATAR FRAMES
           ========================================================================= */}
        {visibleFrames.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🖼️</span>
                <h2 className="font-heading font-black text-lg text-white tracking-wide">
                  Collectible Avatar Frames
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Layered 3D Metallic Cosmetics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
              {visibleFrames.map((frame) => {
                const isOwned = isItemOwned(frame);
                const isEquipped = isItemEquipped(frame);

                return (
                  <div
                    key={frame.id}
                    className={`bg-[#101726] rounded-2xl p-5 border transition-all flex flex-col items-center justify-between space-y-4 shadow-xl group relative overflow-hidden ${
                      isEquipped 
                        ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                        : isOwned 
                          ? 'border-blue-500/30 hover:border-blue-400/60' 
                          : 'border-[#1b253b] hover:border-slate-700'
                    }`}
                  >
                    {/* Top Status Pill */}
                    <div className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700">
                        {frame.rarity}
                      </span>
                      {isEquipped ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black">
                          Equipped
                        </span>
                      ) : isOwned ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          Owned
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {frame.currency === 'gold' ? '🪙 Gold' : '💎 Diamonds'}
                        </span>
                      )}
                    </div>

                    {/* Frame Preview Graphic around live avatar */}
                    <div className="py-2 flex items-center justify-center">
                      <AvatarFrame
                        frameName={frame.name}
                        avatarUrl={profile?.avatar_url || '/avatar-alex.jpg'}
                        size="md"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Name, Lore & Price */}
                    <div className="text-center space-y-1.5 w-full">
                      <div className="font-heading font-black text-sm text-white">
                        {frame.name}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                        {frame.lore}
                      </p>
                      
                      <div className="text-xs font-heading font-bold flex items-center justify-center gap-1.5 text-slate-200 pt-1">
                        {frame.price === 0 || frame.name === 'Fire Frame' ? (
                          <span className="text-emerald-400 font-bold">Default Starter</span>
                        ) : (
                          <>
                            <span>{frame.currency === 'gold' ? '🪙' : '💎'}</span>
                            <span>{frame.price}</span>
                            <span className="text-[10px] text-slate-400 font-normal uppercase">
                              {frame.currency}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-1.5 pt-1">
                      {isEquipped ? (
                        <button
                          onClick={() => handleUnequip('frame')}
                          className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 text-xs font-heading font-bold shadow flex items-center justify-center gap-1.5 transition-all group/btn"
                          title="Click to Unequip"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span className="group-hover/btn:hidden">Equipped</span>
                          <span className="hidden group-hover/btn:inline">Unequip</span>
                        </button>
                      ) : isOwned ? (
                        <button
                          onClick={() => handleEquip('frame', frame)}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-heading font-bold shadow transition-all active:scale-95"
                        >
                          Equip Frame
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(frame)}
                          className={`w-full py-2 rounded-xl border text-xs font-heading font-bold transition-all active:scale-95 ${
                            (frame.currency === 'gold' ? (profile?.gold || 0) : (profile?.diamonds || 0)) < frame.price
                              ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300'
                              : 'bg-[#172138] hover:bg-[#202d4d] border-blue-500/30 hover:border-blue-400 text-blue-300 hover:text-white'
                          }`}
                        >
                          {(frame.currency === 'gold' ? (profile?.gold || 0) : (profile?.diamonds || 0)) < frame.price
                            ? `Need ${frame.price} ${frame.currency === 'gold' ? 'Gold' : 'Diamonds'}`
                            : 'Buy Item'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================================
           CATEGORY 2: 🏆 BADGES
           ========================================================================= */}
        {visibleBadges.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h2 className="font-heading font-black text-lg text-white tracking-wide">
                  Collectible RPG Badges
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Metallic 3D Crests with Rarity Ranks
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {visibleBadges.map((badge) => {
                const isOwned = isItemOwned(badge);
                const isEquipped = isItemEquipped(badge);

                return (
                  <div
                    key={badge.id}
                    className={`bg-[#101726] rounded-2xl p-5 border transition-all flex flex-col items-center justify-between space-y-4 shadow-xl group relative overflow-hidden ${
                      isEquipped 
                        ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
                        : isOwned 
                          ? 'border-amber-500/30 hover:border-amber-400/60' 
                          : 'border-[#1b253b] hover:border-slate-700'
                    }`}
                  >
                    {/* Top Status Pill */}
                    <div className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {badge.tier}
                      </span>
                      {isEquipped ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black">
                          Equipped
                        </span>
                      ) : isOwned ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          Owned
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {badge.currency === 'gold' ? '🪙 Gold' : '💎 Diamonds'}
                        </span>
                      )}
                    </div>

                    {/* Badge Preview Icon */}
                    <div className="py-2 flex items-center justify-center">
                      <BadgeGraphic
                        badgeName={badge.name}
                        size="lg"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Name, Tier, Lore & Price */}
                    <div className="text-center space-y-1.5 w-full">
                      <div className="font-heading font-black text-sm text-white">
                        {badge.name}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                        {badge.lore}
                      </p>
                      
                      <div className="text-xs font-heading font-bold flex items-center justify-center gap-1.5 text-slate-200 pt-1">
                        {badge.price === 0 ? (
                          <span className="text-emerald-400 font-bold">Starter Crest</span>
                        ) : (
                          <>
                            <span>{badge.currency === 'gold' ? '🪙' : '💎'}</span>
                            <span>{badge.price}</span>
                            <span className="text-[10px] text-slate-400 font-normal uppercase">
                              {badge.currency}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-1.5 pt-1">
                      {isEquipped ? (
                        <button
                          onClick={() => handleUnequip('badge')}
                          className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 text-xs font-heading font-bold shadow flex items-center justify-center gap-1.5 transition-all group/btn"
                          title="Click to Unequip"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span className="group-hover/btn:hidden">Equipped</span>
                          <span className="hidden group-hover/btn:inline">Unequip</span>
                        </button>
                      ) : isOwned ? (
                        <button
                          onClick={() => handleEquip('badge', badge)}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-900 text-xs font-heading font-bold shadow transition-all active:scale-95"
                        >
                          Equip Badge
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(badge)}
                          className={`w-full py-2 rounded-xl border text-xs font-heading font-bold transition-all active:scale-95 ${
                            (badge.currency === 'gold' ? (profile?.gold || 0) : (profile?.diamonds || 0)) < badge.price
                              ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300'
                              : 'bg-[#172138] hover:bg-[#202d4d] border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-white'
                          }`}
                        >
                          {(badge.currency === 'gold' ? (profile?.gold || 0) : (profile?.diamonds || 0)) < badge.price
                            ? `Need ${badge.price} ${badge.currency === 'gold' ? 'Gold' : 'Diamonds'}`
                            : 'Buy Badge'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================================================
           CATEGORY 3: 🪐 AVATAR ORBITS & RELICS (Live Orbiting Relics Around Avatar)
           ========================================================================= */}
        {visibleSpecial.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪐</span>
                <h2 className="font-heading font-black text-lg text-white tracking-wide">
                  Avatar Orbits & Relics
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                Animated relics, cosmic rings & celestial satellites orbiting around your avatar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {visibleSpecial.map((item) => {
                const isOwned = isItemOwned(item);
                const isEquipped = isItemEquipped(item);
                const cosmeticType = getCosmeticType(item);

                return (
                  <div
                    key={item.id}
                    className={`bg-[#101726] rounded-2xl p-5 border transition-all flex flex-col items-center justify-between space-y-4 shadow-xl group relative overflow-hidden ${
                      isEquipped 
                        ? 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]' 
                        : isOwned 
                          ? 'border-blue-500/30 hover:border-blue-400/60' 
                          : 'border-[#1b253b] hover:border-slate-700'
                    }`}
                  >
                    {/* Top Status & Rarity Pill */}
                    <div className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30">
                        {item.rarity}
                      </span>
                      {item.isConsumable ? (
                        <div className="flex items-center gap-1.5">
                          {isEquipped && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black">
                              Equipped
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                            {streakShields} / {item.maxStack} Active
                          </span>
                        </div>
                      ) : isEquipped ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black">
                          Equipped
                        </span>
                      ) : isOwned ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          Owned
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {item.currency === 'gold' ? '🪙 Gold' : '💎 Diamonds'}
                        </span>
                      )}
                    </div>

                    {/* Preview Area: Live Avatar with this Orbit Revolving Around It */}
                    <div className="py-2 flex flex-col items-center justify-center h-32 relative">
                      <div className="relative flex items-center justify-center">
                        <AvatarFrame
                          frameName={profile?.equipped_frame || 'Fire Frame'}
                          avatarUrl={profile?.avatar_url || '/avatar-alex.jpg'}
                          auraName={item.name}
                          orbitName={item.name}
                          size="md"
                          className="hover:scale-110 transition-transform duration-300"
                        />

                        {/* Streak Shield Active Count Overlay */}
                        {item.type === 'streak_shield' && streakShields > 0 && (
                          <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-blue-600 border border-blue-400 text-white font-heading font-black text-[10px] shadow-lg">
                            {streakShields} Active
                          </div>
                        )}
                      </div>

                      <span className="mt-2 text-[10px] font-heading font-bold text-purple-300 flex items-center gap-1 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                        <span>🪐</span>
                        <span>Avatar Orbit</span>
                      </span>
                    </div>

                    {/* Name, Lore, Tactical Description & Price */}
                    <div className="text-center space-y-1.5 w-full">
                      <div className="font-heading font-black text-sm text-white">
                        {item.name}
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                        {item.lore}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-2 italic">
                        {item.description}
                      </p>

                      <div className="text-xs font-heading font-bold flex items-center justify-center gap-1.5 text-slate-200 pt-1">
                        <span>{item.currency === 'gold' ? '🪙' : '💎'}</span>
                        <span>{item.price}</span>
                        <span className="text-[10px] text-slate-400 font-normal uppercase">
                          {item.currency}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full space-y-1.5 pt-1">
                      {item.isConsumable ? (
                        <div className="space-y-1.5 w-full">
                          {streakShields > 0 && (
                            <button
                              onClick={() => {
                                if (isEquipped) {
                                  handleUnequip('streak_shield');
                                } else {
                                  handleEquip('streak_shield', item);
                                }
                              }}
                              className={`w-full py-2 rounded-xl text-xs font-heading font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 ${
                                isEquipped
                                  ? 'bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-300 border border-emerald-500/60 group/btn'
                                  : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white border border-violet-400/40 shadow-violet-600/30'
                              }`}
                              title={isEquipped ? "Click to Unequip Orbit" : "Click to Equip Orbit"}
                            >
                              {isEquipped ? (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-400" />
                                  <span className="group-hover/btn:hidden">Shield Orbit Active (Equipped)</span>
                                  <span className="hidden group-hover/btn:inline">Click to Unequip Orbit</span>
                                </>
                              ) : (
                                <>
                                  <Shield className="w-3.5 h-3.5 text-white" />
                                  <span>Equip Shield Orbit</span>
                                </>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleBuy(item)}
                            disabled={streakShields >= item.maxStack}
                            className={`w-full py-2 rounded-xl text-xs font-heading font-bold shadow transition-all flex items-center justify-center gap-1.5 ${
                              streakShields >= item.maxStack
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                : (profile?.gold || 0) < item.price
                                  ? 'bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 active:scale-95'
                                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white active:scale-95'
                            }`}
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>
                              {streakShields >= item.maxStack
                                ? 'Max Capacity (5)'
                                : (profile?.gold || 0) < item.price
                                  ? `Need ${item.price} Gold (Have ${profile?.gold || 0})`
                                  : `Buy Shield (${item.price} Gold)`}
                            </span>
                          </button>
                        </div>
                      ) : isEquipped ? (
                        <button
                          onClick={() => handleUnequip(cosmeticType)}
                          className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 text-xs font-heading font-bold shadow flex items-center justify-center gap-1.5 transition-all group/btn"
                          title="Click to Unequip"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span className="group-hover/btn:hidden">Orbit Equipped</span>
                          <span className="hidden group-hover/btn:inline">Unequip Orbit</span>
                        </button>
                      ) : isOwned ? (
                        <button
                          onClick={() => handleEquip(cosmeticType, item)}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-heading font-bold shadow transition-all active:scale-95"
                        >
                          Equip Orbit
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuy(item)}
                          className={`w-full py-2 rounded-xl border text-xs font-heading font-bold transition-all active:scale-95 ${
                            (item.currency === 'gold' ? (profile?.gold || 0) : (profile?.diamonds || 0)) < item.price
                              ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300'
                              : 'bg-[#172138] hover:bg-[#202d4d] border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white'
                          }`}
                        >
                          {(item.currency === 'gold' ? (profile?.gold || 0) : (profile?.diamonds || 0)) < item.price
                            ? `Need ${item.price} ${item.currency === 'gold' ? 'Gold' : 'Diamonds'}`
                            : 'Buy Orbit'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>

      {/* Victory Emote Preview Modal */}
      {previewEmote && (
        <VictoryEmoteOverlay
          emoteName={previewEmote}
          onClose={() => setPreviewEmote(null)}
        />
      )}
    </div>
  );
};
