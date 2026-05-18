/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#030014', // Deep space background
          800: '#0a0a1f', // Slightly lighter card bg
          700: '#151538', // Hover states
        },
        primary: {
          400: '#a78bfa', // Light purple
          500: '#8b5cf6', // Vivid purple
          600: '#7c3aed', // Deep purple
        },
        accent: {
          400: '#22d3ee', // Cyan
          500: '#06b6d4', // Vivid cyan
          600: '#0891b2', // Deep cyan
        },
        magenta: {
          400: '#f472b6',
          500: '#ec4899',
        },
        success: '#10b981', // Emerald
        warning: '#f59e0b', // Amber
        danger: '#ef4444',  // Rose
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glow': 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%)',
      },
      backdropBlur: {
        'glass': '16px',
        'glass-heavy': '32px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.2), inset 0 0 20px rgba(139, 92, 246, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(6, 182, 212, 0.4), inset 0 0 30px rgba(6, 182, 212, 0.2)' },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
}