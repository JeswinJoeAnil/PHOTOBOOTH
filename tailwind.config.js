/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        accent: ['Fraunces', 'Georgia', 'serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper: '#f4efe6',
        chrome: '#d8d8d5',
        ink: '#101010',
        lavender: '#d8c8ff',
        aqua: '#9bcfcb',
        rose: '#efa1c6',
        lime: '#d9ff48',
        hot: '#ff5aaf',
        electric: '#2977ff',
        flare: '#ff6540',
      },
      boxShadow: {
        chrome: 'inset 0 1px 2px rgba(255,255,255,.85), inset 0 -18px 35px rgba(0,0,0,.16), 0 24px 70px rgba(0,0,0,.25)',
        sticker: '0 12px 25px rgba(20, 14, 10, .22)',
      },
    },
  },
  plugins: [],
};
