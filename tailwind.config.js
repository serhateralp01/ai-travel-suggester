/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this covers all your component files
  ],
  theme: {
    extend: {
      animation: {
        fadeInUp: 'fadeInUp 0.5s ease-out forwards',
        slideDown: 'slideDown 0.4s ease-out forwards',
        slideUp: 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0.8', maxHeight: '0px' },
          '100%': { opacity: '1', maxHeight: '1500px' }, // Adjust max-height as needed
        },
        slideUp: {
          '0%': { opacity: '1', maxHeight: '1500px' },
          '100%': { opacity: '0', maxHeight: '0px', marginBottom: '0', paddingTop: '0', paddingBottom: '0', borderWidth: '0' },
        },
      },
      // ... any other theme extensions you had ...
      colors: {
        sky: {
          // Add shades if you use them directly, e.g., sky-950
          // Tailwind includes sky by default, but you can override or extend
        },
        slate: {
          // similar for slate
        }
      }
    },
  },
  plugins: [],
} 