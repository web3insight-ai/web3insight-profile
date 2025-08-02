import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-pixel)",
          "PxPlus IBM VGA8",
          "MS Gothic",
          "monospace",
        ],
        mono: [
          "var(--font-pixel-mono)",
          "PxPlus IBM VGA8",
          "MS Gothic",
          "monospace",
        ],
        pixel: [
          "var(--font-pixel)",
          "PxPlus IBM VGA8",
          "MS Gothic",
          "monospace",
        ],
      },
      colors: {
        // NES Color Palette
        background: {
          DEFAULT: "#0F0F0F", // Almost black like NES
          dark: "#000000",
        },
        surface: {
          DEFAULT: "#1F1F1F",
          dark: "#0A0A0A",
        },
        border: {
          DEFAULT: "#404040",
          dark: "#606060",
        },
        // Classic NES Colors
        nes: {
          red: "#E22844", // NES Red
          blue: "#0066CC", // NES Blue
          yellow: "#FFDD00", // NES Yellow
          green: "#00BB22", // NES Green
          purple: "#8833FF", // NES Purple
          orange: "#FF7700", // NES Orange
          white: "#FFFFFF",
          black: "#0F0F0F",
          gray: {
            light: "#CCCCCC",
            medium: "#808080",
            dark: "#404040",
          }
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        120: "30rem",
        // Pixel-perfect spacing
        px: "1px",
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
      },
      maxWidth: {
        "8xl": "88rem",
        "content": "1024px",
      },
      boxShadow: {
        // NES-style shadows
        "nes": "4px 4px 0px #000000",
        "nes-red": "4px 4px 0px #AA1122",
        "nes-blue": "4px 4px 0px #004488",
        "nes-inset": "inset 2px 2px 0px #FFFFFF, inset -2px -2px 0px #808080",
        "nes-pressed": "inset 2px 2px 0px #808080, inset -2px -2px 0px #FFFFFF",
        "pixel": "2px 2px 0px #000000",
        "pixel-sm": "1px 1px 0px #000000",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      animation: {
        "fade-in": "fadeIn 400ms ease-in-out",
        "slide-up": "slideUp 400ms ease-out",
        "typewriter": "typewriter 2s steps(40) 1s forwards",
        "blink": "blink 1s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "gradient-x": "gradientX 3s ease infinite",
        "scale-in": "scaleIn 300ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        pulseGlow: {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(0, 111, 238, 0.5), 0 0 40px rgba(0, 111, 238, 0.3)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 30px rgba(0, 111, 238, 0.8), 0 0 60px rgba(0, 111, 238, 0.4)",
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#0F0F0F", // Dark NES background
            foreground: "#FFFFFF", // White text
            primary: {
              DEFAULT: "#E22844", // NES Red
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#0066CC", // NES Blue
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#00BB22", // NES Green
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FFDD00", // NES Yellow
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#E22844", // NES Red
              foreground: "#FFFFFF",
            },
            focus: "#E22844",
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#FFFFFF",
            primary: {
              DEFAULT: "#E22844", // NES Red
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#0066CC", // NES Blue
              foreground: "#FFFFFF",
            },
            success: {
              DEFAULT: "#00BB22", // NES Green
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FFDD00", // NES Yellow
              foreground: "#000000",
            },
            danger: {
              DEFAULT: "#E22844", // NES Red
              foreground: "#FFFFFF",
            },
            focus: "#E22844",
          },
        },
      },
    }),
  ],
} satisfies Config;