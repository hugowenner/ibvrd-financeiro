/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-ibvrd': '#0a2c4d',
        'cinza-claro': '#f4f6f8',
        'positivo': '#16a34a', // Verde para entradas
        'negativo': '#dc2626', // Vermelho para saídas
      },
      fontFamily: {
        'sans': ['Arial', 'Helvetica', 'sans-serif'],
      }
    },
  },
  plugins: [],
}