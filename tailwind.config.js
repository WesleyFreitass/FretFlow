/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oficina: {
          bg: '#e8e6e1',
          surface: '#f4f2ec',
          card: '#fffefa',
          sidebar: '#e9e5da',
          chassis: '#1f2321',
          chassisLight: '#2a2f2c',
          border: '#d5d0c3',
          borderDark: '#ccc7ba',
          borderLight: '#e2ddd0',
          terracotta: '#d9563a',
          terracottaDark: '#2a140e',
          olive: '#3f7a26',
          oliveLight: '#dfe9d4',
          oliveGlow: '#7fbf4d',
          amber: '#e8a325',
          amberDark: '#c08b1f',
          petrol: '#1f6f6a',
          mutedText: '#8a867a',
          bodyText: '#4a4842',
          darkText: '#1f2321',
        },
        fret: {
          dark: '#0f141c',
          card: '#161d28',
          border: '#242f42',
          accent: '#38bdf8',
          neonGreen: '#22c55e',
          neonOrange: '#f97316',
          neonPurple: '#a855f7',
        }
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
      gridTemplateColumns: {
        '25': 'repeat(25, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'fretpulse': 'fretpulse 1.8s infinite',
      },
      keyframes: {
        fretpulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.6))' },
          '50%': { opacity: 0.6, filter: 'drop-shadow(0 0 3px rgba(56, 189, 248, 0.2))' },
        }
      }
    },
  },
  plugins: [],
}
