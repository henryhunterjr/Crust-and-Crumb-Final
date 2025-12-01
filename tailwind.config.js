/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      colors: {
        bread: {
          50: '#fdf8f3',
          100: '#f5e6d3',
          200: '#e8d4bc',
          300: '#d4b896',
          400: '#c49a6c',
          500: '#b8864a',
          600: '#a67339',
          700: '#8b5c2a',
          800: '#6f4a22',
          900: '#5a3d1c',
        },
      },
    },
  },
  plugins: [],
}
