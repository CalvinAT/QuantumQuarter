/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: ['./src/**/*.{html,js}','./public/**/*.{html,js},node_modules/preline/dist/*.js'],
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
        'inter': ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    require('preline/plugin'),
  ],
});

