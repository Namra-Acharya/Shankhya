import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode
        page: "#F7F8FA",
        surface: "#FFFFFF",
        "surface-secondary": "#F1F3F5",
        "text-primary": "#111318",
        "text-secondary": "#5F6672",
        "text-muted": "#8B929D",
        border: "#E2E6EA",

        // Dark mode
        "dark-page": "#0D0F13",
        "dark-surface": "#15181D",
        "dark-secondary": "#1C2026",
        "dark-elevated": "#232831",
        "dark-text-primary": "#F4F6F8",
        "dark-text-secondary": "#A4ABB5",
        "dark-text-muted": "#737B87",
        "dark-border": "#292E36",

        // Brand accent - deep blue
        accent: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
          950: "#172554",
        },

        // Category accents
        finance: {
          50: "#F4F8FF",
          100: "#E3EEFF",
          200: "#C5DDFF",
          300: "#9CC4FF",
          400: "#6BA3FF",
          500: "#4284F5",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        education: {
          50: "#F7F5FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
        health: {
          50: "#F3FAF6",
          100: "#E2F4EB",
          200: "#C5E8D7",
          300: "#9AD6BC",
          400: "#6BBE9C",
          500: "#47A37F",
          600: "#358567",
          700: "#2C6B54",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        xs: ["0.75rem", { lineHeight: "1.125rem" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.9375rem", { lineHeight: "1.5rem" }],
        lg: ["1.0625rem", { lineHeight: "1.625rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.75rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }],
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.04)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
        card: "0 1px 2px 0 rgb(0 0 0 / 0.03), 0 2px 8px -2px rgb(0 0 0 / 0.04)",
      },
      maxWidth: {
        content: "80rem",
        prose: "65ch",
      },
      transitionDuration: {
        DEFAULT: "200ms",
        fast: "150ms",
        slow: "300ms",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "fade-in-up": "fade-in-up 250ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;