/* Tailwind Play CDN config for Sami Furniture House */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          green:    '#2E7D32',
          'green-dark': '#1F5A24',
          teal:     '#0F3D4C',
          'teal-deep': '#0A2C38',
          wood:     '#A47551',
          'wood-light': '#C39A77',
          bg:       '#FAFAFA',
          section:  '#EFE6DD',
          'section-deep': '#E5D9CB',
          ink:      '#2B2B2B',
          muted:    '#6B7280',
          line:     '#E7DFD4',
        },
      },
      letterSpacing: {
        'widest-2': '0.32em',
      },
      boxShadow: {
        'soft': '0 20px 50px -20px rgba(15,61,76,0.18)',
        'lift': '0 30px 60px -25px rgba(15,61,76,0.28)',
      },
      animation: {
        'pulse-ring': 'pulseRing 2s ease-out infinite',
        'soft-bounce': 'softBounce 2s ease-in-out infinite',
      },
      keyframes: {
        pulseRing: {
          '0%':   { transform: 'scale(1)',   opacity: '0.5' },
          '100%': { transform: 'scale(1.7)', opacity: '0'   },
        },
        softBounce: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(6px)' },
        },
      },
    },
  },
};
