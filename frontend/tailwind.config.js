/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Lora', 'Georgia', 'serif'],
        ui: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        data: ['IBM Plex Mono', 'Courier New', 'monospace'],
      },
      colors: {
        /* --- BACKGROUNDS --- */
        'clinical': {
          linen: '#F5F2EE',
          'warm-white': '#FDFCFB',
          parchment: '#EDE9E3',
        },
        /* --- TEXT --- */
        'text': {
          ink: '#1A1410',
          slate: '#4A4540',
          ash: '#8C867E',
        },
        /* --- BRAND GREEN --- */
        'forest': {
          deep: '#1B4332',
          DEFAULT: '#2D6A4F',
          mid: '#40916C',
          tint: '#D8F3DC',
          border: '#A8D5B5',
        },
        /* --- SEMANTIC: ALERT RED --- */
        'alert': {
          red: '#9B2226',
          'red-light': '#F8D7D7',
          'red-border': '#E8AAAA',
        },
        /* --- SEMANTIC: AMBER (WARNING) --- */
        'caution': {
          amber: '#7D4E00',
          'amber-light': '#FDF0DC',
          'amber-border': '#F0CFA0',
        },
        /* --- SEMANTIC: VITAL GREEN --- */
        'vital': {
          green: '#1B4332',
          'green-light': '#D8F3DC',
          'green-border': '#A8D5B5',
        },
        /* --- ACCENT: GOLD --- */
        'accent': {
          gold: '#B7791F',
          'gold-light': '#FEF9EE',
          'gold-border': '#E9C97A',
        },
        /* --- BORDERS --- */
        'border': {
          DEFAULT: '#D8D2C8',
          strong: '#C4BDB5',
        },
      },
      backgroundColor: {
        'page': '#F5F2EE',
        'card': '#FDFCFB',
        'subtle': '#EDE9E3',
      },
      textColor: {
        'primary': '#1A1410',
        'secondary': '#4A4540',
        'muted': '#8C867E',
      },
      borderColor: {
        'DEFAULT': '#D8D2C8',
        'strong': '#C4BDB5',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-out',
        slideDown: 'slideDown 0.5s ease-out',
        slideLeft: 'slideLeft 0.5s ease-out',
        slideRight: 'slideRight 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(45, 106, 79, 0.3)',
        'glow-lg': '0 0 30px rgba(45, 106, 79, 0.5)',
      },
    },
  },
  plugins: [],
}
