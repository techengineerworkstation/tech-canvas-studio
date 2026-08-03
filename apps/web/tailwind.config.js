/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f3',
          100: '#f9efe4',
          200: '#f2dec7',
          300: '#eac5a0',
          400: '#dfa575',
          500: '#d4884f',
          600: '#c26e3a',
          700: '#a1542e',
          800: '#83432a',
          900: '#6a3826',
        },
        accent: {
          hot: '#c45c3e',
          warm: '#d98c5f',
          cool: '#5a8fa8',
          green: '#5a9a6e',
          yellow: '#d4a843',
        },
        surface: {
          darkest: '#f5efe7',
          dark: '#faf6f0',
          medium: '#fffdfa',
          light: '#ffffff',
          lighter: '#ffffff',
        },
        border: {
          DEFAULT: '#e8dfd2',
          light: '#d9cec0',
          focus: '#d4884f',
        },
        text: {
          primary: '#3d3229',
          secondary: '#6b5d50',
          muted: '#9a8b7a',
          dim: '#b8a998',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.15s ease-out',
        'slide-down': 'slideDown 0.15s ease-out',
        'scale-in': 'scaleIn 0.12s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-6px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.98)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 136, 79, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 136, 79, 0.35)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
