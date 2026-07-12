/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          hover: '#1B5E20',
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#2E7D32',
          600: '#1B5E20',
          700: '#114214',
        },
        secondary: {
          green: '#66BB6A',
          DEFAULT: '#143616', // Dark green sidebar color
        },
        accent: {
          emerald: '#43A047',
          DEFAULT: '#43A047',
        },
        danger: '#D32F2F',
        warning: '#F9A825',
        success: '#2E7D32',
        background: '#F8FAF8',
        border: {
          main: '#E8ECE8',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
