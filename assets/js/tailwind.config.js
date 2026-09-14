/* Tailwind Play CDN config for Sami Furniture House - Luxury Redesign */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'Fraunces', 'ui-serif', 'Georgia', 'serif'],
        accent: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          noir: '#0B1015',
          'noir-light': '#141B22',
          'noir-card': '#161F28',
          gold: '#C5A880',
          'gold-light': '#E5D6C1',
          'gold-dark': '#9E7E54',
          'gold-accent': '#D4AF37',
          sand: '#F4EFEA',
          'sand-dark': '#E8DFC5',
          cream: '#FBF9F5',
          bg: '#FBF9F5',
          ink: '#11171D',
          muted: '#6B7280',
          'muted-light': '#9CA3AF',
          line: '#E7DFD4',
          'line-dark': '#2A3440',
          green: '#1E4E38',
          'green-dark': '#153828',
          'green-light': '#2E7D32',
        },
      },
      letterSpacing: {
        'widest-2': '0.35em',
        'widest-3': '0.45em',
      },
      boxShadow: {
        'soft': '0 20px 50px -20px rgba(11,16,21,0.12)',
        'lift': '0 30px 60px -20px rgba(11,16,21,0.22)',
        'gold': '0 10px 30px -10px rgba(197,168,128,0.35)',
        'card': '0 10px 30px -10px rgba(0,0,0,0.06)',
      },
      animation: {
        'pulse-ring': 'pulseRing 2.5s ease-out infinite',
        'soft-bounce': 'softBounce 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.4' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        softBounce: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
};
