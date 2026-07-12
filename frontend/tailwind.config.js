/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        sage: '#9BBDAF',
        cream: '#FFF8C9',
        peach: '#F8C7AE',
        coral: {
          DEFAULT: '#F27D88',
          dark: '#E06B76'
        },
        mauve: '#836A78',
        app: {
          bg: '#FCFBF7',
          card: '#FFFFFF',
          border: '#ECE8E3',
        },
        text: {
          main: '#2F2F2F',
          muted: '#6B7280',
        },
        state: {
          success: '#5E9E6F',
          warning: '#F5C75D',
          error: '#E96A6A',
          info: '#7CA9D6',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'hover': '0 8px 30px -4px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        '2xl': '16px', // Matches user requirement of 14-18px
      },
      transitionDuration: {
        '250': '250ms', // Matches 200-300ms spec
      }
    },
  },
  plugins: [],
}
