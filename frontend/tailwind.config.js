/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f2f9e8',
          100: '#e6f2d1',
          200: '#d9ebb9',
          300: '#ccde9f',
          400: '#bfce8a',
          500: '#9ae65a',
          600: '#7ed321',
          700: '#6ba01f',
          800: '#5a8a1a',
          900: '#487214',
        },
        secondary: {
          50: '#f0fdf9',
          100: '#e0faf5',
          200: '#bfeff3',
          300: '#9eebe0',
          400: '#7de7cd',
          500: '#5ce1b8',
          600: '#3ac99d',
          700: '#2a9b7e',
          800: '#1e6b59',
          900: '#163d37',
        },
        background: '#f7f9f8',
        dark: '#1e2a26',
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
        'glow': '0 0 20px rgba(14, 165, 233, 0.5)',
        'glow-lg': '0 0 30px rgba(14, 165, 233, 0.7)',
      },
    },
  },
  plugins: [],
}
