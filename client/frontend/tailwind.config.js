/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          neonPink: "#ff00ff",
          neonGreen: "#39ff14",
          neonBlue: "#00ffff",
          neonRed: "#ff073a",
          neonYellow: "#faff00",
        },
      },
    },
    plugins: [],
  };
  