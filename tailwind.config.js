/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#34d399', // Emerald 400
          DEFAULT: '#059669', // Emerald 600
          dark: '#065f46', // Emerald 800
        },
        gold: {
          light: '#fde047',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        background: '#f8fafc',
        surface: '#ffffff',
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        sans: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
