/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", 
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          maroon: "#800020",
          darkMaroon: "#5D0018",
          lightMaroon: "#A3293D",
        },
        secondary: {
          darkBlue: "#1A1A2E",
          blue: "#16213E",
          lightBlue: "#0F3460",
        },
        neutral: {
          light: "#F5F5F5",
          medium: "#E0E0E0",
          dark: "#333333",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
    },
  },
  plugins: [],
};
