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
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcd7ff',
          300: '#8ebcff',
          400: '#5896ff',
          500: '#3373ff', // Brand primary
          600: '#1a56ff',
          700: '#0a40e5',
          800: '#0f36ba',
          900: '#132e93',
          950: '#111d5c',
        }
      }
    },
  },
  plugins: [],
}