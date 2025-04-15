/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src//*.{js,jsx,ts,tsx}", // Adjust based on your project structure
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s infinite ease-in-out',
        'pulse-line': 'pulseLine 3s infinite ease-in-out',
      },
      keyframes: {
        float: {
          '0%': { 
            transform: 'translateY(0) rotate(0deg)', 
            opacity: '0.3' 
          },
          '50%': { 
            transform: 'translateY(-20px) rotate(45deg)', 
            opacity: '0.5' 
          },
          '100%': { 
            transform: 'translateY(0) rotate(0deg)', 
            opacity: '0.3' 
          },
        },
        pulseLine: {
          '0%': { 
            opacity: '0.1', 
            transform: 'scaleX(0.8)' 
          },
          '50%': { 
            opacity: '0.3', 
            transform: 'scaleX(1)' 
          },
          '100%': { 
            opacity: '0.1', 
            transform: 'scaleX(0.8)' 
          },
        },
      },
    },
  },
  plugins: [],
};