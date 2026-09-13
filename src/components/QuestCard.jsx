import React, { useState } from 'react';
import { 
  Code, 
  Dumbbell, 
  BookOpen, 
  Sparkles, 
  User, 
  Star, 
  Check, 
  MoreVertical, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import { useGame } from '../context/GameContext';

export const QuestCard = ({ quest, onEdit }) => {
  const { completeQuest, deleteQuest } = useGame();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isCompleted = Boolean(quest.is_completed_today);

  // Determine category icon & styling matching the reference screenshot
  const getCategoryTheme = (category) => {
    switch (category?.toLowerCase()) {
      case 'coding':
        return {
          icon: Code,
          boxBg: 'bg-[#0ea5e9]/15 border-[#0ea5e9]/30 text-[#38bdf8]',
        };
      case 'fitness':
        return {
          icon: Dumbbell,
          boxBg: 'bg-[#10b981]/15 border-[#10b981]/30 text-[#34d399]',
        };
      case 'reading':
        return {
          icon: BookOpen,
          boxBg: 'bg-[#f59e0b]/15 border-[#f59e0b]/30 text-[#fbbf24]',
        };
      case 'mindfulness':
        return {
          icon: Sparkles,
          boxBg: 'bg-[#a855f7]/15 border-[#a855f7]/30 text-[#c084fc]',
        };
      default:
        return {
          icon: User,
          boxBg: 'bg-[#6366f1]/15 border-[#6366f1]/30 text-[#818cf8]',
        };
    }
  };

  const theme = getCategoryTheme(quest.category);
  const CategoryIcon = theme.icon;

  const handleComplete = async (e) => {
    if (isCompleted || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await completeQuest(quest.id, e);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete quest "${quest.title}"?`)) {
      await deleteQuest(quest.id);
    }
  };

  return (
    <div
      className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
        isCompleted
          ? 'bg-[#0a1020]/60 backdrop-blur-md border-white/5 opacity-75'
          : 'bg-[#0a1020]/75 backdrop-blur-xl border-white/10 hover:border-violet-500/40 hover:bg-[#11182c]/85 hover:shadow-[0_8px_30px_rgba(139,92,246,0.18)]'
      }`}
    >
      {/* Left side: Icon Box + Title & Subtitle */}
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 pr-2">
        {/* Category Icon Squircle matching screenshot */}
        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center shrink-0 ${theme.boxBg}`}>
          <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Quest Info */}
        <div className="min-w-0">
          <h4 className={`font-heading font-bold text-sm sm:text-base truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-white'}`}>
            {quest.title}
          </h4>
          <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <span>{quest.category || 'General'}</span>
            <span>•</span>
            <span className="capitalize">{quest.difficulty || 'Medium'}</span>
            {quest.duration && (
              <>
                <span>•</span>
                <span className="text-cyan-400 font-medium">⏱️ {quest.duration}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side: XP Reward + Complete Button + Menu */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        
        {/* XP Reward with Star */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>+{quest.xp_reward} XP</span>
        </div>

        {/* Complete Button matching reference image (purple button) */}
        {isCompleted ? (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Completed</span>
          </div>
        ) : (
          <button
            onClick={handleComplete}
            disabled={isSubmitting}
            className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#6d5df6] hover:bg-[#5b4ae3] shadow-[0_4px_14px_rgba(109,93,246,0.35)] active:scale-95 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Complete'
            )}
          </button>
        )}

        {/* Dropdown Menu for Edit/Delete */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-[#1a2238] transition-colors"
            aria-label="Quest menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-28 rounded-xl bg-[#151c30] border border-[#232e4d] shadow-xl py-1 z-30 text-xs font-medium">
              {onEdit && (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(quest);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-slate-300 hover:bg-[#1f2945]"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              )}
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleDelete();
                }}
                className="w-full text-left px-3 py-1.5 flex items-center gap-2 text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
