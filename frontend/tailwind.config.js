module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', "monospace"],
        orbitron: ['"Orbitron"', "sans-serif"],
      },
      colors: {
        neon: {
          green: "#00ff41",
          blue: "#00f3ff",
          dark: "#0d0208",
        },
      },
    },
  },
  plugins: [],
};