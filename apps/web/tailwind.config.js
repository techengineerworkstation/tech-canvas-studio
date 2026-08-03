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
          // Proper hierarchy: darkest is the deepest background, lightest is cards/inputs
          darkest: '#ede4d8',
          dark: '#f3ece3',
          medium: '#faf6f0',
          light: '#ffffff',
          lighter: '#ffffff',
        },
        border: {
          DEFAULT: '#d9cec0',
          light: '#e8dfd2',
          focus: '#c26e3a',
        },
        text: {
          primary: '#2c241c',
          secondary: '#5a4d3f',
          muted: '#7a6d5f',
          dim: '#a89a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.12s ease-out',
        'slide-up': 'slideUp 0.12s ease-out',
        'slide-down': 'slideDown 0.12s ease-out',
        'scale-in': 'scaleIn 0.1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-4px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.99)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const lineClamp = {};
      [1, 2, 3].forEach((lines) => {
        lineClamp[`.line-clamp-${lines}`] = {
          display: '-webkit-box',
          '-webkit-line-clamp': `${lines}`,
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        };
      });
      addUtilities(lineClamp);
    },
  ],
};
