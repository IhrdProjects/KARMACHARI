/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        govblue: '#0d47a1',
        govgold: '#d6a33a',
      }
    }
  },
  plugins: [],
}
