/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          teal: '#0D9488',
        },
        surface: {
          light: '#F9FAFB',
          dark: '#1F2937',
        },
        text: {
          dark: '#1F2937',
        },
        muted: {
          gray: '#E5E7EB',
        },
        action: {
          red: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
