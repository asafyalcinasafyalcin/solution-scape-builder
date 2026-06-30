import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dubai: {
          gold: "#C9A84C",
          "gold-light": "#E8C96A",
          navy: "#1B2B4B",
          "navy-light": "#2D4A7A",
          sand: "#F5E6C8",
          "sand-light": "#FAF4E8",
        },
        amazon: {
          orange: "#FF9900",
          "orange-dark": "#E88900",
          blue: "#146EB4",
          "blue-dark": "#0F5A9A",
        },
        noon: {
          yellow: "#FEEE00",
          dark: "#1A1A1A",
          gray: "#F5F5F5",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
