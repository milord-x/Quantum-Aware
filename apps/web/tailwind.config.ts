import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f1720",
        mist: "#e8f1f0",
        tide: "#5f7f7c",
        sand: "#f7f4ee",
        ember: "#bf6a3f",
        moss: "#587154"
      },
      boxShadow: {
        panel: "0 24px 80px rgba(15, 23, 32, 0.12)"
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI Variable", "Trebuchet MS", "sans-serif"],
        mono: ["IBM Plex Mono", "Consolas", "monospace"]
      }
    }
  },
  plugins: []
} satisfies Config;
