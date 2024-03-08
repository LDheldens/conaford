/** @type {import('tailwindcss').Config} */
// import colors from 'tailwindcss/colors';
module.exports = {
  // prefix: 'tw-', // Use 'tw-' as the prefix for Tailwind CSS classes
  // content: ["./app/templates/*.{html,js}"],
  content: ["/app/templates/*.{html,js}"],
  content: [
    "./app/core/pos/templates/crm/acta/create.html",
    "./app/core/pos/templates/crm/ficha_udd/login.html",
    './app/core/pos/static/crm/acta/js/conaforp-acta-create.js'
  ],

  // content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'gotham-bold': ['Gotham-Bold', 'sans-serif'],
        'gotham-book': ['Gotham-Book', 'sans-serif'],
      },
    },
  },
  plugins: []
  // plugins: [
  //   require('@tailwindcss/typography'),
  //   function({ addUtilities }) {
  //     const newUtilities = {
  //       '.tw-collapse': {
  //         '@apply bg-blue-500': {},
  //       },
  //     };
  //     addUtilities(newUtilities, ['responsive', 'hover']);
  //   },
  // ],
}