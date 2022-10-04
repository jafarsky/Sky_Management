/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
    },
  },
  content: ["index.html"],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('../img/night.jpg')",
      },
      gridTemplateRows: {
        'j': '1fr 1fr',
      },
    },
    fontFamily: {
      Raleway: ["Raleway, sans-serif"],
    },
    plugins: [
      require('tailwind-scrollbar'),
    ],
  },
}
