/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rpg: {
          bg: '#0b0e17',
          deep: '#070a11',
          card: '#111625',
          cardHover: '#171e33',
          surface: '#182035',
          border: '#1e263d',
          borderHover: '#2d3757',
          primary: '#6d5df6',
          primaryHover: '#5b4ae3',
          purple: '#7c3aed',
          gold: '#f59e0b',
          cyan: '#0ea5e9',
          rose: '#ef4444',
          emerald: '#10b981',
          amber: '#f59e0b',
          muted: '#64748b',
          textMuted: '#94a3b8'
        },
        cyber: {
          bg: '#0b0e17',
          card: '#111625',
          surface: '#182035',
          border: '#1e263d',
          accent: '#6d5df6',
          neon: '#6d5df6',
          magenta: '#a855f7',
          gold: '#f59e0b',
          emerald: '#10b981',
          purple: '#6d5df6',
          muted: '#64748b'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        heading: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        rpg: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'purple-glow': '0 0 20px rgba(109, 93, 246, 0.45), 0 0 35px rgba(109, 93, 246, 0.25)',
        'purple-subtle': '0 4px 14px 0 rgba(109, 93, 246, 0.35)',
        'gold-glow': '0 0 20px rgba(245, 158, 11, 0.45), 0 0 35px rgba(245, 158, 11, 0.25)',
        'neon-cyan': '0 0 15px rgba(14, 165, 233, 0.4)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float': 'float 3s infinite ease-in-out',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 8px rgba(109, 93, 246, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 18px rgba(109, 93, 246, 0.9))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
