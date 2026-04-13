/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e5ff',
          200: '#bcd1ff',
          300: '#8cb2ff',
          400: '#5788ff',
          500: '#2d63f5',
          600: '#1f4be6',
          700: '#1b3dcf',
          800: '#1d36a7',
          900: '#1d327f'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99,102,241,0.35), 0 10px 40px rgba(76,90,255,0.35)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(99,102,241,0.28), transparent 35%), radial-gradient(circle at 50% 90%, rgba(59,130,246,0.22), transparent 45%)'
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};

