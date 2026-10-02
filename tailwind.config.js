/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        marine: {
          950: '#f0f7ff',   // Crystal freshwater background
          900: '#e0f2fe',   // Soft freshwater basin / sub-well
          850: '#ffffff',   // Pure aquatic white card surface
          800: '#ffffff',   // Pure aquatic white card surface
          750: '#f8fafc',   // Card hover surface
          700: '#bae6fd',   // Delicate sky-blue water border
          600: '#7dd3fc',   // Active sky water border
          500: '#38bdf8',   // Vibrant cyan-water border
        },
        water: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',  // Bright crystalline water
          500: '#0ea5e9',  // Azure active water
          600: '#0284c7',  // Primary ocean blue CTA
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        aqua: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
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
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
        },
        farm: {
          base: '#f0f7ff',     // Crystal freshwater base
          surface: '#ffffff',  // Pure aquatic card surface
          card: '#ffffff',     // Pure aquatic card surface
          well: '#e0f2fe',     // Secondary freshwater well
          border: '#bae6fd',   // Delicate sky water border
          muted: '#64748b',    // Muted slate text
          dark: '#0f172a',     // Deep navy/slate primary text
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        tamil: ['"Noto Sans Tamil"', '"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
