/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      "vinque": ["vinque", "sans-serif"]
    }
  },
  plugins: [require("daisyui")],
}