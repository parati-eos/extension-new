/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      scrollbar: {
        thumb: {
          background: '#e6a500',
          borderRadius: '10px',
        },
        track: {
          background: 'transparent',
        },
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
}
