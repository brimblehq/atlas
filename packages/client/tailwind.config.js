module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
