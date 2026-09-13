import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[#1e263d] bg-[#0c101d] pt-14 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns matching reference image */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Info (col-span-6) */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/shield.svg" alt="Life RPG Shield" className="w-7 h-7 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <span className="font-heading font-black text-xl text-white tracking-wide">
                LIFE <span className="text-purple-400">RPG</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Turn everyday goals into RPG quests. Complete tasks, earn XP, build streaks, and level up your life.
            </p>

            {/* Social Links matching reference image */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-[#111625] border border-[#1e263d] flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-[#182035] transition-all"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-[#111625] border border-[#1e263d] flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-[#182035] transition-all"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-[#111625] border border-[#1e263d] flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-[#182035] transition-all"
                aria-label="Discord"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.893.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-[#111625] border border-[#1e263d] flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-[#182035] transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links (col-span-3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-purple-400 transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/quests" className="hover:text-purple-400 transition-colors">Quests</Link>
              </li>
              <li>
                <Link to="/progress" className="hover:text-purple-400 transition-colors">Progress</Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a>
              </li>
            </ul>
          </div>

          {/* Legal (col-span-3) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-sm text-white">
              Legal
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright matching reference image */}
        <div className="pt-6 border-t border-[#1e263d] text-center text-xs text-slate-500">
          © 2026 Life RPG. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
