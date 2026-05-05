/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#121212",
        "card-dark": "#1C1C24",
        "primary-purple": "#8B5CF6",
      },
      backgroundImage: {
        "dashboard-hero": "url('/src/assets/hero-bg.png')", // 画像のファイル名に合わせて変更してください
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
