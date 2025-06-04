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
};
