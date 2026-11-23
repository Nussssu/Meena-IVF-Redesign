import typography from '@tailwindcss/typography'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', nav: '1180px', xl: '1280px', '2xl': '1536px', '3xl': '1920px' },
    extend: {
      colors: {
        paper: '#FBF7F2', mist: '#F3EEF6', blush: '#F7E6E0', card: '#FFFFFF',
        ink: { DEFAULT: '#24122B', 2: '#4A3A50' }, muted: '#6B5A70', line: '#E7DDE6',
        plum: { DEFAULT: '#80298F', 700: '#6B1F78', 800: '#4A1554', 900: '#2E0D36' },
        lavender: { DEFAULT: '#7B6BB0', 700: '#5B4C94' },
        lilac: '#EBE3F4', honey: '#D9A441', ok: '#2F7D5B', err: '#B3261E',
        whatsapp: { DEFAULT: '#25D366', dark: '#128C7E', ink: '#063A1E' },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Hind Siliguri"', 'system-ui', 'sans-serif'],
        bn: ['"Hind Siliguri"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.75rem', { lineHeight: '1', letterSpacing: '0.14em' }],
      },
      borderRadius: { card: '18px', panel: '28px' },
      boxShadow: {
        soft: '0 1px 2px rgba(36,18,43,.06), 0 8px 24px -12px rgba(36,18,43,.12)',
        lift: '0 24px 48px -24px rgba(46,13,54,.28)',
      },
      maxWidth: { site: '92.5rem' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 40s linear infinite' },
    },
  },
  plugins: [typography],
}
