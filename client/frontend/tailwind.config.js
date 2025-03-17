/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff", 
        accent: "#ff6363",  
        bgStart: "#1f2937", 
        bgMiddle: "#111827", 
        bgEnd: "#000000",    
        cardBg: "#2c2c2c",   
        cardBorder: "#444444", 
        100: '#E5F6FF',
        200: '#B8E1FF',
        300: '#8BCBFF',
        400: '#5FB6FF',
        500: '#339FFF', 
        600: '#007AFF',
        700: '#0066CC',
        800: '#005299',
        900: '#003D66',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
