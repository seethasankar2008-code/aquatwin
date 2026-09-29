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
          50: '#f2f8f5',
          100: '#e1efe8',
          200: '#c5dfd4',
          300: '#9bc6b7',
          400: '#6ca895',
          500: '#488a77',
          600: '#346f5f',
          700: '#2a584c',
          800: '#23473e',
          900: '#1e3c35',
          950: '#0d221e',
        },
        aqua: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        farm: {
          base: '#f8faf9',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e2e8e5',
          muted: '#64748b',
          dark: '#0f172a',
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
