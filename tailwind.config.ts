import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        jab: {
          void: "#08080A",
          dark: "#0C0C10",
          card: "#121218",
          cardHover: "#181822",
          elevated: "#1E1E28",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(229, 25, 55, 0.35)",
          borderGold: "rgba(212, 175, 55, 0.25)",
          red: {
            DEFAULT: "#E51937",
            bright: "#FF2A4D",
            crimson: "#B91C1C",
            glow: "rgba(229, 25, 55, 0.4)",
          },
          gold: {
            DEFAULT: "#D4AF37",
            light: "#F5D061",
            dark: "#997A15",
            glow: "rgba(212, 175, 55, 0.35)",
          },
          silver: "#E2E8F0",
          muted: "#94A3B8",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5D061 0%, #D4AF37 50%, #8C7322 100%)",
        "red-gradient": "linear-gradient(135deg, #FF2A4D 0%, #E51937 50%, #991B1B 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(24, 24, 32, 0.75) 0%, rgba(14, 14, 20, 0.9) 100%)",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)",
      },
      boxShadow: {
        "red-glow": "0 0 25px -5px rgba(229, 25, 55, 0.45)",
        "gold-glow": "0 0 25px -5px rgba(212, 175, 55, 0.4)",
        "card-shadow": "0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.05)",
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "var(--font-inter)", "sans-serif"],
        heading: ["var(--font-cairo)", "var(--font-montserrat)", "sans-serif"],
        arabic: ["var(--font-cairo)", "sans-serif"],
        english: ["var(--font-montserrat)", "sans-serif"],
      },
      animation: {
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
