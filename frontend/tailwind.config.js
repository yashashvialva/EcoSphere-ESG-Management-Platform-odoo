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
          DEFAULT: '#9BBDAF', // Sage green
          hover: '#82a596',
        },
        cream: '#FFF8C9',
        peach: '#F8C7AE',
        coral: {
          DEFAULT: '#F27D88', // Coral pink
          hover: '#df6671',
        },
        mauve: '#836A78',
        background: '#FCFBF7',
        border: {
          main: '#ECE8E3',
        },
        text: {
          primary: '#2F2F2F',
          secondary: '#6B7280',
        },
        success: '#5E9E6F',
        warning: '#F5C75D',
        error: '#E96A6A',
        info: '#7CA9D6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
