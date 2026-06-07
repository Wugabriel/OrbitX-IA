/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "space-bg": "#050816",
        "space-deep": "#0a0a2e",
        "orbit-blue": "#3B82F6",
        "orbit-green": "#22C55E",
        "orbit-red": "#EF4444",
        "orbit-yellow": "#F59E0B",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
