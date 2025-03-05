/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Wedding Vendor Connect Color Palette
        purple: "#6B46C1",
        lavender: "#9F7AEA",
        pink: "#ED64A6",
        "light-pink": "#FBB6CE",
        "light-gray": "#F7FAFC",
        "dark-gray": "#2D3748",
        white: "#FFFFFF",

        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#6B46C1",
        background: "#F7FAFC",
        foreground: "#2D3748",
        primary: {
          DEFAULT: "#6B46C1",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#ED64A6",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#e11d48",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#E2E8F0",
          foreground: "#4A5568",
        },
        accent: {
          DEFAULT: "#9F7AEA",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D3748",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D3748",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
