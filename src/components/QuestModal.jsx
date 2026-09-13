import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Clock } from 'lucide-react';
import { useGame } from '../context/GameContext';

const CATEGORIES = ['Coding', 'Study', 'Fitness', 'Reading', 'Mind', 'Mindfulness', 'Personal'];

const DURATION_PRESETS = [
  { minutes: 15, duration: '15 min', level: 'Easy', defaultXP: 60 },
  { minutes: 30, duration: '30 min', level: 'Medium', defaultXP: 100 },
  { minutes: 45, duration: '45 min', level: 'Hard', defaultXP: 180 },
  { minutes: 60, duration: '60 min', level: 'Epic', defaultXP: 250 }
];

export const QuestModal = ({ isOpen, onClose, initialQuest = null }) => {
  const { createQuest, updateQuest } = useGame();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Coding');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('30 min');
  const [customMinutes, setCustomMinutes] = useState(30);
  const [xpReward, setXpReward] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialQuest) {
      setTitle(initialQuest.title || '');
      setDescription(initialQuest.description || '');
      setCategory(initialQuest.category || 'Coding');
      setDifficulty(initialQuest.difficulty || 'Medium');
      setXpReward(initialQuest.xp_reward || 100);

      const initDur = initialQuest.duration || (
        initialQuest.difficulty === 'Easy' ? '15 min' :
        initialQuest.difficulty === 'Hard' ? '45 min' :
        initialQuest.difficulty === 'Epic' ? '60 min' : '30 min'
      );
      setDuration(initDur);
      const parsedMins = parseInt(String(initDur).match(/\d+/)?.[0] || '30', 10);
      setCustomMinutes(parsedMins);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Coding');
      setDifficulty('Medium');
      setXpReward(100);
      setDuration('30 min');
      setCustomMinutes(30);
    }
    setError(null);
  }, [initialQuest, isOpen]);

  if (!isOpen) return null;

  const handlePresetSelect = (preset) => {
    setDuration(preset.duration);
    setDifficulty(preset.level);
    setXpReward(preset.defaultXP);
    setCustomMinutes(preset.minutes);
  };

  const handleCustomMinutes = (value) => {
    const rawNum = parseInt(value, 10);
    const mins = isNaN(rawNum) ? 30 : Math.max(1, Math.min(360, rawNum));
    setCustomMinutes(mins);
    const durStr = `${mins} min`;
    setDuration(durStr);

    // Auto-calculate difficulty tier & XP based on duration
    let lvl = 'Medium';
    let xp = 100;
    if (mins <= 20) {
      lvl = 'Easy';
      xp = 60;
    } else if (mins <= 35) {
      lvl = 'Medium';
      xp = 100;
    } else if (mins <= 50) {
      lvl = 'Hard';
      xp = 180;
    } else {
      lvl = 'Epic';
      xp = Math.min(450, Math.round(mins * 3.5));
    }
    setDifficulty(lvl);
    setXpReward(xp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a quest title.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        duration: duration || `${customMinutes || 30} min`,
        xp_reward: Number(xpReward) || 100
      };

      if (initialQuest?.id) {
        await updateQuest(initialQuest.id, payload);
      } else {
        await createQuest(payload);
      }

      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save quest.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#0e1424] border border-[#1e263d] p-6 sm:p-7 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#182035] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-heading font-black text-white">
              {initialQuest ? 'Edit Quest' : 'Create New Quest'}
            </h2>
            <p className="text-xs text-slate-400">
              Define your real-life goal, duration, and XP reward.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
              Quest Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Study JavaScript Concurrency"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b0e17] border border-[#1e263d] text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all text-center ${
                    category === cat
                      ? 'bg-[#6d5df6] text-white border-transparent shadow-[0_2px_10px_rgba(109,93,246,0.35)]'
                      : 'bg-[#111625] border-[#1e263d] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & XP Reward (Replaced Difficulty) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="flex items-center gap-1.5 text-xs uppercase font-bold text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Duration & XP Reward</span>
              </label>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                ⏱️ {duration}
              </span>
            </div>

            {/* 4 Duration Preset Cards (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-2">
              {DURATION_PRESETS.map((preset) => {
                const isSelected = duration === preset.duration;
                return (
                  <button
                    type="button"
                    key={preset.duration}
                    onClick={() => handlePresetSelect(preset)}
                    className={`py-2.5 px-3 rounded-xl border transition-all flex items-center justify-between text-left ${
                      isSelected
                        ? 'bg-purple-950/50 border-purple-500 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/50'
                        : 'bg-[#111625] border-[#1e263d] text-slate-300 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <div>
                        <span className="font-bold text-xs sm:text-sm block leading-tight text-white">
                          {preset.duration}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {preset.level}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] sm:text-xs text-amber-400 font-bold shrink-0">
                      +{preset.defaultXP} XP
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Duration & Quick Chips */}
            <div className="mt-2 p-2 rounded-xl bg-[#0b0e17] border border-[#1e263d] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="text-[11px] font-semibold text-slate-400">Custom:</span>
                <div className="flex items-center bg-[#111625] px-2 py-0.5 rounded-lg border border-[#1e263d]">
                  <input
                    type="number"
                    min="1"
                    max="360"
                    value={customMinutes}
                    onChange={(e) => handleCustomMinutes(e.target.value)}
                    className="w-10 bg-transparent text-white font-bold text-xs focus:outline-none text-center"
                  />
                  <span className="text-[10px] text-slate-400 ml-0.5">min</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[15, 25, 30, 45, 60, 90].map((mins) => {
                  const isMatch = duration === `${mins} min`;
                  return (
                    <button
                      type="button"
                      key={mins}
                      onClick={() => handleCustomMinutes(mins)}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                        isMatch
                          ? 'bg-[#6d5df6] text-white font-bold shadow-[0_1px_6px_rgba(109,93,246,0.5)]'
                          : 'text-slate-400 hover:text-white hover:bg-[#182035]'
                      }`}
                    >
                      {mins}m
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key milestones or notes for this quest..."
              className="w-full px-4 py-2 rounded-xl bg-[#0b0e17] border border-[#1e263d] text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          {/* Submit Button (Purple) */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-[#6d5df6] hover:bg-[#5b4ae3] shadow-[0_4px_16px_rgba(109,93,246,0.4)] active:scale-[0.99] transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                initialQuest ? 'Save Changes' : 'Create Quest'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
