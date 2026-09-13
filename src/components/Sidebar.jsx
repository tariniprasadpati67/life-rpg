import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  User, 
  Flame, 
  ShoppingBag, 
  Trophy,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../lib/soundEffects';

export const Sidebar = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Quests', path: '/quests', icon: CheckSquare },
    { label: 'Character', path: '/character', icon: User },
    { label: 'Streak', path: '/streak', icon: Flame },
    { label: 'Shop', path: '/shop', icon: ShoppingBag },
    { label: 'Leaderboard', path: '/leaderboard', icon: Trophy }
  ];

  const handleLogout = async () => {
    soundFx.playClick();
    await signOut();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`w-64 shrink-0 bg-[#0a0f1d]/80 backdrop-blur-xl border-r border-white/10 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between ${className}`}>
      <div className="space-y-6">
        {/* Brand in Sidebar */}
        <Link 
          to="/dashboard"
          onClick={() => soundFx.playClick()}
          className="px-3 py-2 flex items-center gap-3 group focus:outline-none"
        >
          <img src="/app-logo.png" alt="Life RPG Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.75)] group-hover:scale-105 transition-transform" />
          <span className="font-heading font-black text-xl text-white tracking-wide">
            LIFE <span className="text-violet-400">RPG</span>
          </span>
        </Link>

        {/* Main Nav Links matching anime color grading */}
        <nav className="space-y-1.5 font-medium text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => soundFx.playClick()}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-bold shadow-[0_4px_20px_rgba(139,92,246,0.45)] border border-white/20'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-violet-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Nav: Settings & Logout */}
      <div className="pt-4 border-t border-white/10 space-y-1 text-sm font-medium">
        <Link
          to="/settings"
          onClick={() => soundFx.playClick()}
          className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-colors ${
            location.pathname === '/settings'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
