/** @type {import('tailwindcss').Config} */
export default  {
  content: [
    './api/templates/**/*.html',  // Django 템플릿 경로
    './api/static/**/*.js',       // 정적 JavaScript 파일
    './api/static/**/*.css',      // 정적 CSS 파일
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

