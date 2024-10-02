/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          default: "#d6d6d6",
          dark: "#adadad",
          light: "#e8e8e8",
        },
        warning: "#ff3b3b",
        textcolor: {
          light: "#e8e8e8",
          lightHover: "#bf8900",
          dark: "#111827",
          darkHover: "#ffca42",
        }
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
