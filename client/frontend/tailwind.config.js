/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ffffff", // Main text color on dark backgrounds
        accent: "#ff6363",  // A bold accent for buttons or highlights
        bgStart: "#4f46e5", // Indigo-600
        bgMiddle: "#9333ea", // Purple-600
        bgEnd: "#ec4899",    // Pink-500
        cardBg: "#ffffff",   // Card background, keeping it light for contrast
        cardBorder: "#d4d4d8", // Light gray border
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
