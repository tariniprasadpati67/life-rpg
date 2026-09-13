import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Flame, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  Trophy, 
  Check, 
  Trash2, 
  ExternalLink,
  X
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundFx } from '../lib/soundEffects';

export const NotificationDropdown = () => {
  const navigate = useNavigate();
  const { profile, quests, recentCompletions } = useGame();
  
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread'
  const dropdownRef = useRef(null);

  // Initialize notifications from localStorage or generate defaults based on real game status
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('rpg_notifications_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [
      {
        id: 'notif-streak',
        type: 'streak',
        title: 'Streak Active',
        message: 'Your consistency fire is burning bright! Complete daily quests to maintain momentum.',
        timestamp: 'Today',
        link: '/streak',
        isRead: false
      },
      {
        id: 'notif-shield',
        type: 'shield',
        title: 'Aegis Streak Shield Protection',
        message: 'Celestial shield is guarding your active streak from accidental missed days.',
        timestamp: 'Active',
        link: '/streak',
        isRead: false
      },
      {
        id: 'notif-orbit',
        type: 'cosmetic',
        title: 'Avatar Orbit Equipped',
        message: 'Your dynamic cosmetic orbit is actively revolving around your hero avatar.',
        timestamp: '2h ago',
        link: '/character',
        isRead: false
      },
      {
        id: 'notif-quests',
        type: 'quest',
        title: 'Daily Quests Ready',
        message: 'New quests are available in your Quest Log. Earn bounty XP and Gold!',
        timestamp: 'Today',
        link: '/quests',
        isRead: false
      }
    ];
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rpg_notifications_v1', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleToggle = () => {
    soundFx.playClick();
    setIsOpen(!isOpen);
  };

  const markAllAsRead = () => {
    soundFx.playClick();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearAll = () => {
    soundFx.playDelete();
    setNotifications([]);
  };

  const dismissNotification = (e, id) => {
    e.stopPropagation();
    soundFx.playClick();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notif) => {
    soundFx.playClick();
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'streak':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            <Flame className="w-4 h-4 fill-white" />
          </div>
        );
      case 'shield':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Shield className="w-4 h-4 fill-white" />
          </div>
        );
      case 'cosmetic':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-4 h-4 fill-white" />
          </div>
        );
      case 'quest':
        return (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-[#172138] border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
        );
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'Unread') return !n.isRead;
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Bell Button matching Navbar design */}
      <button
        onClick={handleToggle}
        className={`relative p-1.5 sm:p-2 rounded-xl transition-all focus:outline-none shrink-0 ${
          isOpen 
            ? 'bg-[#1a243c] border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
            : 'bg-[#141b2e] border border-[#1a233a] text-slate-400 hover:text-white hover:border-slate-700'
        }`}
        title={`Notifications (${unreadCount} unread)`}
        aria-label="Notifications"
      >
        {unreadCount > 0 && (
          <>
            <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5 animate-ping pointer-events-none" />
            <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-1.5 right-1.5 pointer-events-none" />
          </>
        )}
        <Bell className="w-4 h-4" />
      </button>

      {/* Notification Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e1424] border border-[#232e4d] shadow-[0_15px_45px_rgba(0,0,0,0.85)] z-50 animate-fadeIn overflow-hidden">
          
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-[#1c263f] flex items-center justify-between bg-[#111728]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-heading font-black text-sm text-white tracking-wide">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-cyan-300 hover:bg-[#1a233a] transition-all flex items-center gap-1"
                  title="Mark all notifications as read"
                >
                  <Check className="w-3 h-3" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-1 px-3 pt-2 pb-1 border-b border-[#192237] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilter('All')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'All'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('Unread')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'Unread'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          )}

          {/* Notifications Scroll List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#172138]">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 sm:p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative group ${
                    notif.isRead 
                      ? 'bg-transparent hover:bg-[#131b2f]' 
                      : 'bg-blue-950/20 hover:bg-blue-950/35 border-l-2 border-l-blue-500'
                  }`}
                >
                  {getNotifIcon(notif.type)}

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className={`text-xs font-heading font-bold truncate ${notif.isRead ? 'text-slate-300' : 'text-white'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                      {notif.message}
                    </p>
                  </div>

                  {/* Dismiss (X) button on hover */}
                  <button
                    type="button"
                    onClick={(e) => dismissNotification(e, notif.id)}
                    className="absolute top-3 right-2.5 p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-10 px-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-2xl bg-[#141b2e] border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Check className="w-5 h-5" />
                </div>
                <p className="text-xs font-heading font-bold text-slate-300">
                  {filter === 'Unread' ? 'No unread notifications' : 'All caught up!'}
                </p>
                <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto">
                  {filter === 'Unread' ? 'You have read all current notifications.' : 'No new notifications right now.'}
                </p>
              </div>
            )}
          </div>

          {/* Quick Footer Links */}
          <div className="p-2.5 bg-[#0b0f1a] border-t border-[#172138] flex items-center justify-between text-[11px] text-slate-400 px-3.5">
            <span>Life RPG Sentinel</span>
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setIsOpen(false);
                navigate('/quests');
              }}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>Go to Quests</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
