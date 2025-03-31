/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['"Noto Serif"', 'serif'],
        'sans': ['"Noto Sans"', 'sans-serif'],
      },
      colors: {
        'golden-orange': '#CC4D00',
        'sea-green': '#00A15C',
        'sky-blue': '#0077CC',
        'orchid': '#C151FF',
        'charcoal': '#1A1614',
        'deep-purple': '#4338CA',
        'dark-purple': '#312E81',
        'dark-blue': '#000080',
        'dark-green': '#008000',
        'coral': '#FF6B6B',
        'teal': '#4DB6AC',
        'indigo': '#5C6BC0',
        'amber': '#FFB300',
        'emerald': '#2ECC71',
        'ruby': '#E91E63',
        'sapphire': '#1E88E5',
        'amethyst': '#9C27B0',
        'topaz': '#FF9800',
        'jade': '#26A69A'
      },
      keyframes: {
        'scale-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' }
        },
        'bounce-up': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      animation: {
        'scale-pulse': 'scale-pulse 1s ease-in-out infinite',
        'bounce-up': 'bounce-up 0.6s ease-in-out'
      },
      utilities: {
        '.clip-polygon': {
          clipPath: 'polygon(0 10%, 10% 0, 90% 0, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0 90%)'
        },
        '.clip-polygon-button': {
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
        },
        '.clip-polygon-small': {
          clipPath: 'polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%)'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 