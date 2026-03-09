/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          900: "#0a4a57",
          800: "#0f5c6d",
          700: "#1e7d8f",
          600: "#2e90a3",
        },
        appbg: "#f3f5f7",
        surface: "#ffffff",
        border: "#d6dde3",
        text: {
          primary: "#1f2937",
          muted: "#6b7280",
        },
        success: "#15803d",
        danger: "#dc2626",
      },
      borderRadius: {
        card: "14px",
        field: "10px",
        button: "10px",
      },
      maxWidth: {
        auth: "520px",
      },
      spacing: {
        4.5: "1.125rem",
      },
    },
  },
  plugins: [],
};
