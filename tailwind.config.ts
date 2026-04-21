import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-lora)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'breathe': 'breathe 20s ease-in-out infinite',
        'fade-slide-up': 'fadeSlideUp 0.6s ease-out forwards',
        'danger-pulse': 'dangerPulse 2s ease-in-out infinite',
        'amber-pulse': 'amberPulse 3s ease-in-out infinite',
        'bubble': 'bubble 1.4s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.18)', opacity: '0.75' },
        },
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        dangerPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(192, 57, 43, 0.5)' },
          '50%': { boxShadow: '0 0 0 16px rgba(192, 57, 43, 0)' },
        },
        amberPulse: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 137, 42, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(212, 137, 42, 0)' },
        },
        bubble: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '50%': { transform: 'translateY(-8px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
