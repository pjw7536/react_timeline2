/** @type {import('tailwindcss').Config} */
import forms from "@tailwindcss/forms";

export default {
  darkMode: "class", // 버튼으로 다크모드 토글
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}", // 템플릿 경로 (필수)
  ],
  theme: { extend: {} },
  plugins: [forms],

  keyframes: {
    fadeIn: {
      "0%": { opacity: "0", transform: "translateY(10px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
  },
  animation: {
    "fade-in": "fadeIn 0.3s ease-out",
  },
};
