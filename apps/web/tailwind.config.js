/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ADYAPAN Brand Colors — Orange/Amber palette
        primary: {
          50:  '#FFF8F0',
          100: '#FFEEDD',
          200: '#FFD4A8',
          300: '#FFB570',
          400: '#FF8C3A',
          500: '#F48C06',  // main amber
          600: '#E85D04',  // deep orange (hero bg)
          700: '#C44D02',
          800: '#9A3C01',
          900: '#6B2900',
          950: '#3D1700',
        },
        brand: {
          orange:       '#E85D04',
          'orange-mid': '#F48C06',
          amber:        '#FAA307',
          cream:        '#FFF8F3',
          'cream-dark': '#FFF0E0',
          warm:         '#FFBA69',
        },
        // Keep gray for neutrals
        surface: {
          white: '#FFFFFF',
          cream: '#FFF8F3',
          light: '#FFF0E0',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      backgroundImage: {
        // Main brand gradient (left side of login)
        'gradient-brand':     'linear-gradient(135deg, #E85D04 0%, #F48C06 60%, #FAA307 100%)',
        'gradient-brand-r':   'linear-gradient(135deg, #FAA307 0%, #F48C06 50%, #E85D04 100%)',
        'gradient-hero':      'linear-gradient(135deg, #FFF8F0 0%, #FFF8F3 100%)',
        'gradient-orange':    'linear-gradient(180deg, #E85D04 0%, #F48C06 100%)',
        'gradient-card':      'linear-gradient(145deg, rgba(232,93,4,0.08) 0%, rgba(250,163,7,0.04) 100%)',
      },
      boxShadow: {
        'brand':        '0 4px 24px rgba(232, 93, 4, 0.25)',
        'brand-lg':     '0 8px 40px rgba(232, 93, 4, 0.30)',
        'brand-glow':   '0 0 20px rgba(244, 140, 6, 0.40)',
        'card':         '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover':   '0 8px 32px rgba(232, 93, 4, 0.15)',
        'glass':        '0 4px 24px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-in-out',
        'slide-up':   'slideUp 0.5s ease-out',
        'scale-in':   'scaleIn 0.2s ease-out',
        'float':      'float 3s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float:   { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
