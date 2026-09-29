/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f0f9ff',   // Very light blue surface (#F0F9FF)
          100: '#e0f2fe',  // Soft ice blue
          200: '#bae6fd',  // Light water blue border
          300: '#7dd3fc',  // Sky water
          400: '#38bdf8',  // Vivid cyan blue
          500: '#06b6d4',  // Aqua cyan (#06B6D4)
          600: '#0284c7',  // Primary water blue (#0284C7)
          700: '#0369a1',  // Deep ocean blue
          800: '#075985',  // Primary deep blue (#075985)
          900: '#0c4a6e',  // Midnight naval blue
          950: '#082f49',  // Deepest tech marine
        },
        aqua: {
          50: '#f0f9ff',
          100: '#cffafe',  // Light aqua (#CFFAFE)
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',  // Aqua (#06B6D4)
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        agri: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        farm: {
          base: '#f0f9ff',   // Very light blue background
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e0f2fe', // Subtle blue border
          muted: '#475569',  // Secondary text (#475569)
          dark: '#0f172a',   // Dark text (#0F172A)
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
