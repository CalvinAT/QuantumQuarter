/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}','./public/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        qq: {
          'primary': '#DAFFFB',
          'secondary': '#04364A',
          'tertiary': '#176B87',
        }
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

