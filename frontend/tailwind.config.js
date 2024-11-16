/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        dark: {
          50: '#f7f7f8',
          100: '#eeeef1',
          200: '#d5d5db',
          300: '#b0b1bb',
          400: '#8b8c9b',
          500: '#6c6d7e',
          600: '#555666',
          700: '#444552',
          800: '#2d2e36',
          900: '#1a1a1f',
          950: '#111114',
        },
        accent: {
          50: '#f4f1ff',
          100: '#ece5ff',
          200: '#dcd0ff',
          300: '#c4adff',
          400: '#aa7eff',
          500: '#9747ff',
          600: '#8b21ff',
          700: '#7a0ef2',
          800: '#6610cc',
          900: '#530fa3',
          950: '#320870',
        },
      },
    },
  },
  plugins: [],
}
