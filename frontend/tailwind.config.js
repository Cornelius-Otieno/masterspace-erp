/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00B4D8',
        'primary-dark': '#00B4D8',
        navy: '#1B2E4B',
        'navy-light': '#2c4a78',
        'teal-light': '#E0F7FA',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
