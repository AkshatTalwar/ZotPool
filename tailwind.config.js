/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Include all files in the `app` directory
    "./components/**/*.{js,ts,jsx,tsx}", // Include all files in a `components` folder, if applicable
    "./pages/**/*.{js,ts,jsx,tsx}", // Include all files in the `pages` directory, if applicable
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
