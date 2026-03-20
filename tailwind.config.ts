import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          '950': '#04040A',
          '900': '#080812',
          '800': '#0D0D1F',
          '700': '#121228',
          '600': '#18183A',
        },
        cobalt: {
          '600': '#0E3ACC',
          '500': '#1A56FF',
          '400': '#4D7FFF',
          '300': '#80A8FF',
          '200': '#B3CCFF',
          'glow': 'rgba(26, 86, 255, 0.2)',
        },
        mercury: {
          '100': '#E8E8F0',
          '200': '#D0D0E0',
          '300': '#B8B8CC',
          '400': '#9898B0',
          '500': '#787898',
          '600': '#585878',
        },
        void: '#000005',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        bricolage: ['var(--font-bricolage)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        grain: 'grain 0.8s steps(2) infinite',
        breathe: 'breathe 5s ease-in-out infinite',
        flicker: 'flicker 10s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'draw-line': 'drawLine 1.5s ease-in-out forwards',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 2%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(4%, -1%)' },
          '50%': { transform: 'translate(-3%, 3%)' },
          '60%': { transform: 'translate(2%, -4%)' },
          '70%': { transform: 'translate(-4%, 1%)' },
          '80%': { transform: 'translate(1%, -2%)' },
          '90%': { transform: 'translate(3%, 3%)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.85' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
        flicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%': { opacity: '0.7' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.6' },
          '99%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(26, 86, 255, 0.3), 0 0 60px rgba(26, 86, 255, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(26, 86, 255, 0.6), 0 0 100px rgba(26, 86, 255, 0.2)',
          },
        },
        drawLine: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        brutal: 'cubic-bezier(0.76, 0, 0.24, 1)',
        expo: 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      zIndex: {
        canvas: '0',
        content: '10',
        overlay: '20',
        cursor: '9999',
        noise: '9998',
      },
    },
  },
  plugins: [],
}

export default config
