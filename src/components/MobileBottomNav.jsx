import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  User, 
  ShoppingBag, 
  Trophy 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { soundFx } from '../lib/soundEffects';

export const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Only display for authenticated users and not on login/signup
  if (!user || location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Quests', path: '/quests', icon: CheckSquare },
    { label: 'Character', path: '/character', icon: User },
    { label: 'Shop', path: '/shop', icon: ShoppingBag },
    { label: 'Ranks', path: '/leaderboard', icon: Trophy },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070b14]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.6)]"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.375rem)' }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => soundFx.playClick()}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all duration-200 group active:scale-95 ${
                active
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={item.label}
            >
              <div className={`p-1 rounded-xl transition-all ${
                active 
                  ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.6)]' 
                  : 'text-slate-400 group-hover:text-slate-200'
              }`}>
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className={`text-[10px] font-heading font-bold mt-0.5 tracking-tight ${
                active ? 'text-violet-300' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
