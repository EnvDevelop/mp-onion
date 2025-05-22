/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#121212',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#0891b2',
          foreground: '#ffffff',
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#0891b2',
          600: '#00838f',
          700: '#006064',
          800: '#004d40',
          900: '#00251a',
        },
        secondary: {
          DEFAULT: '#2d3748',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#2d2d2d',
          foreground: '#a1a1aa',
        },
        accent: {
          DEFAULT: '#333333',
          foreground: '#ffffff',
        },
        card: {
          DEFAULT: '#1e1e1e',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: '#1e1e1e',
          foreground: '#ffffff',
        },
        border: '#333333',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#ffffff',
            a: {
              color: '#0891b2',
              '&:hover': {
                color: '#26c6da',
              },
            },
            h1: {
              color: '#ffffff',
            },
            h2: {
              color: '#ffffff',
            },
            h3: {
              color: '#ffffff',
            },
            h4: {
              color: '#ffffff',
            },
            strong: {
              color: '#ffffff',
            },
            code: {
              color: '#ffffff',
            },
            blockquote: {
              color: '#a1a1aa',
            },
          },
        },
      },
    },
  },
  plugins: [],
};
