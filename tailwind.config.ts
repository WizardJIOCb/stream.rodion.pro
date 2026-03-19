import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/frontend/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        'bg-base': '#06080e',
        'bg-surface': '#0c1018',
        'bg-card': '#111827',
        'border-card': 'rgba(56, 189, 248, 0.12)',
        'border-card-hover': 'rgba(56, 189, 248, 0.25)',
        primary: '#38bdf8',
        'primary-dim': 'rgba(56, 189, 248, 0.15)',
        accent: '#818cf8',
        live: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
        'text-primary': '#f1f5f9',
        'text-secondary': '#94a3b8',
        'text-muted': '#64748b',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-live': '0 0 12px rgba(239, 68, 68, 0.4)',
        'glow-primary': '0 0 12px rgba(56, 189, 248, 0.15)',
        'glow-primary-md': '0 0 20px rgba(56, 189, 248, 0.2)',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(239, 68, 68, 0.7)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'pulse-live': 'pulse-live 2s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
