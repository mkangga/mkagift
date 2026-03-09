/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-delay': 'float 6s ease-in-out 2s infinite',
        'float-delay-2': 'float 6s ease-in-out 4s infinite',
        shimmer: 'shimmer 3s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        shake: 'shake 0.5s ease-in-out',
        'box-open': 'box-open 1s ease-out forwards',
        'bounce-in': 'bounce-in 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        'heart-float': 'heart-float 4s ease-in-out infinite',
        'star-twinkle': 'star-twinkle 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 50%, 90%': { transform: 'translateX(-8px)' },
          '30%, 70%': { transform: 'translateX(8px)' },
        },
        'box-open': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '30%': { transform: 'scale(1.1) rotate(-5deg)' },
          '60%': { transform: 'scale(1.2) rotate(5deg)' },
          '100%': { transform: 'scale(0) rotate(0deg)', opacity: 0 },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        'heart-float': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: 1 },
          '50%': { transform: 'translateY(-60px) scale(1.2)', opacity: 0.8 },
          '100%': { transform: 'translateY(-120px) scale(0)', opacity: 0 },
        },
        'star-twinkle': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.3, transform: 'scale(0.7)' },
        },
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}
