/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#6392E9',
        'accent-yellow': '#FFC107',
        'accent-green': '#4CAF50',
        'white': '#FFFFFF',
        'black': '#000000',
        'off-black': '#222222',
        'gray-dark': '#9A9A9A',
        'gray-medium': '#AAAAAA',
        'gray-light': '#D4D4D4',
        'gray-soft': '#E5DBDB',
      },
    },
  },
  plugins: [],
};