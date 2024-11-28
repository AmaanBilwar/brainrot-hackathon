/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        '90s-bg': '#f0f0f0',
        '90s-border': '#dcdcdc',
        '90s-button': '#ff4500',
        '90s-button-hover': '#ff6347',
      },
      fontFamily: {
        'sans': ['Comic Sans MS', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
}