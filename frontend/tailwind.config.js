/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0C0C0C",
        card: "#141414",
        "card-border": "#2a2a2a",
        accent: "#7B2FBE",
        "accent-light": "#9D4EDD",
      },
    },
  },
  plugins: [],
};
