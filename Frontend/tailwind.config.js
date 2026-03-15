/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#0B4B57",
          800: "#15616D",
          700: "#247D90",
        },
        surface: {
          base: "#F7F8F8",
          muted: "#EDF2F3",
          soft: "#DCE5E8",
          card: "#FFFFFF",
        },
        text: {
          primary: "#171A1C",
          secondary: "#4A5158",
          muted: "#6C737C",
          inverse: "#F8FCFD",
        },
        state: {
          success: "#15803D",
          "success-soft": "#B7E4CC",
          danger: "#DC2626",
          "danger-soft": "#F2D3D3",
          warning: "#D6B675",
          "warning-soft": "#EBDDBE",
          info: "#A8D5C2",
        },
        border: {
          DEFAULT: "#CDD5DA",
          strong: "#AAB7BF",
        },
        accent: {
          teal: "#5C9A89",
          stone: "#59544E",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        headline: ["3.25rem", { lineHeight: "1.1", fontWeight: "600" }],
        "page-title": ["2.25rem", { lineHeight: "1.2", fontWeight: "600" }],
        "card-title": ["1.75rem", { lineHeight: "1.25", fontWeight: "600" }],
        "body-lg": ["1.25rem", { lineHeight: "1.6", fontWeight: "500" }],
        body: ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        caption: ["0.95rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        panel: "0.75rem",
        pill: "0.625rem",
      },
      borderWidth: {
        1: "1px",
      },
      boxShadow: {
        none: "none",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
};
