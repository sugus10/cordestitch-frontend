/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom brand colors here
        '[#3b3b3b]': '#3A3A3A', // This is approximately 0 0% 23% in HSL
        'brand-accent': '#F05A4F', // This is approximately 10 80% 60% in HSL
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}