/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF7F2",
        cream: "#F3ECE2",
        gold: "#C6A664",
        golddark: "#A9884A",
        espresso: "#2B2118",
        cocoa: "#5C4A3A",
        rose: "#E8CFC8",
        rosedeep: "#B76E79",
        emerald: "#1F3D2B",
        wine: "#6D2B3A",
        line: "#E7DCCB",
        muted: "#8A7A6B"
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
      }
    }
  },
  plugins: []
};
