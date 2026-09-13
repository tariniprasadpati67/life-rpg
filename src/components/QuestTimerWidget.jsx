import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Check, 
  Clock, 
  Maximize2, 
  Sparkles,
  Trash2,
  Edit3
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { formatTimeRemaining, calculateProgressPercent, parseDurationMinutes } from '../lib/timerUtils';

export const QuestTimerWidget = ({ quest, onEdit }) => {
  const { 
    questTimers, 
    startQuestTimer, 
    pauseQuestTimer, 
    resumeQuestTimer, 
    completeQuest, 
    deleteQuest,
    setActiveFocusQuest 
  } = useGame();

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Auto reset confirmation after 4 seconds
  useEffect(() => {
    if (!confirmDelete) return;
    const timeout = setTimeout(() => setConfirmDelete(false), 4000);
    return () => clearTimeout(timeout);
  }, [confirmDelete]);

  const handleDelete = async () => {
    await deleteQuest(quest.id);
    setConfirmDelete(false);
  };

  const renderEditDelete = () => (
    <div className="flex items-center gap-1.5">
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(quest)}
          className="p-2 rounded-xl bg-white/[0.06] hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-slate-300 hover:text-violet-300 transition-all active:scale-95 shadow-sm"
          title="Edit Quest"
          aria-label="Edit Quest"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      )}

      {confirmDelete ? (
        <div className="flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/40 rounded-xl px-2.5 py-1 animate-fadeIn shadow-sm">
          <span className="text-[11px] font-bold text-rose-300">Delete?</span>
          <button
            type="button"
            onClick={handleDelete}
            className="px-2 py-0.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-all active:scale-95 shadow-sm"
            title="Yes, delete quest"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-all active:scale-95"
            title="Cancel"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="p-2 rounded-xl bg-white/[0.06] hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 transition-all active:scale-95 shadow-sm"
          title="Delete Quest"
          aria-label="Delete Quest"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );

  const isDone = Boolean(quest.is_completed_today);
  const timer = questTimers?.[quest.id];
  const isActive = Boolean(quest.is_active || timer);

  if (isDone) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-heading font-bold shadow-[0_4px_14px_rgba(16,185,129,0.35)] select-none">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Completed</span>
        </span>
        {renderEditDelete()}
      </div>
    );
  }

  if (isActive) {
    const defaultSecs = parseDurationMinutes(quest.duration) * 60;
    const remaining = timer?.remainingSeconds ?? defaultSecs;
    const total = timer?.totalSeconds ?? defaultSecs;
    const isRunning = timer ? timer.isRunning : false;
    const isFinished = timer ? timer.isFinished : (remaining <= 0);
    const progress = calculateProgressPercent(remaining, total);

    return (
      <div className="flex flex-wrap items-center gap-2">
        {/* Countdown Pill with Progress Bar */}
        <div 
          onClick={() => setActiveFocusQuest(quest)}
          className={`relative overflow-hidden cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
            isFinished 
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 animate-pulse' 
              : isRunning 
                ? 'bg-[#121b30] border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]' 
                : 'bg-[#101726] border-slate-700 text-slate-400'
          }`}
          title="Click to expand RPG Focus Mode"
        >
          {/* Progress bar background fill */}
          <div 
            className="absolute left-0 bottom-0 top-0 bg-cyan-500/10 pointer-events-none transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />

          <div className="relative z-10 flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${isRunning ? 'text-cyan-400 animate-spin-slow' : 'text-slate-400'}`} />
            <span className="font-mono font-bold text-xs tracking-wider">
              {formatTimeRemaining(remaining)}
            </span>
            {isRunning && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>
        </div>

        {/* Pause / Resume Control */}
        {!isFinished && (
          isRunning ? (
            <button
              type="button"
              onClick={() => pauseQuestTimer(quest.id)}
              className="p-2 rounded-xl bg-[#141d30] hover:bg-[#1a2640] border border-amber-500/30 text-amber-400 hover:text-amber-300 transition-all active:scale-95 shadow-sm"
              title="Pause Timer"
              aria-label="Pause Timer"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => timer ? resumeQuestTimer(quest.id) : startQuestTimer(quest.id, quest.duration)}
              className="p-2 rounded-xl bg-[#141d30] hover:bg-[#1a2640] border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 transition-all active:scale-95 shadow-sm"
              title="Resume Timer"
              aria-label="Resume Timer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          )
        )}

        {/* Expand Focus Mode Button */}
        <button
          type="button"
          onClick={() => setActiveFocusQuest(quest)}
          className="p-2 rounded-xl bg-[#141d30] hover:bg-[#1a2640] border border-purple-500/30 text-purple-400 hover:text-purple-300 transition-all active:scale-95 shadow-sm"
          title="Open RPG Focus Mode"
          aria-label="Open RPG Focus Mode"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Claim Reward Button - ONLY shown when countdown completes! */}
        {isFinished && (
          <button
            type="button"
            onClick={() => completeQuest(quest.id)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-green-500 hover:from-amber-400 hover:to-green-400 text-white font-heading font-bold text-xs shadow-[0_4px_16px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5 animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Claim Reward</span>
          </button>
        )}

        {/* Edit & Delete Action Buttons */}
        {renderEditDelete()}
      </div>
    );
  }

  // Not started state: Show "Start" button and Edit/Delete
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => startQuestTimer(quest.id, quest.duration)}
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-heading font-bold text-xs shadow-[0_4px_16px_rgba(124,58,237,0.4)] border border-white/20 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5"
      >
        <Play className="w-3 h-3 fill-current" />
        <span>Start</span>
      </button>
      {renderEditDelete()}
    </div>
  );
};
