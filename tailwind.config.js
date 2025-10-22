/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    'bg-green-50',
    'border-green-200',
    'border-solid',
    'bg-red-50',
    'border-red-200',
    'bg-blue-50',
    'border-blue-200',
    'bg-gray-50',
    'border-gray-200',
    'text-green-600',
    'text-red-600',
    'text-blue-600',
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#6392E9",
        "accent-yellow": "#FFC107",
        "accent-green": "#4CAF50",
        white: "#FFFFFF",
        black: "#000000",
        "off-black": "#222222",
        "gray-dark": "#9A9A9A",
        "gray-medium": "#AAAAAA",
        "gray-light": "#D4D4D4",
        "gray-soft": "#E5DBDB",
        primary: "#4A90E2", // Soft blue for primary elements
        secondary: "#F0F2F5", // Light gray for backgrounds
        accent: "#52C41A", // Green for highlights
        textPrimary: "#1F2937", // Dark gray for text
        danger: "#EF4444", // Red for leave button
      },
    },
  },
  plugins: [],
};
