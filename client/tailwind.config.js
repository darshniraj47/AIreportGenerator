/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Premium Light Peach Theme Colors
        primary: {
          50: '#fff5f2',
          100: '#ffe8e0',
          200: '#ffcfc1',
          300: '#ffaa94',
          400: '#ff8366',
          500: '#FFA089', // Lighter Peach
          600: '#e66550', 
          700: '#c24734',
          800: '#a33928',
          900: '#873023',
          950: '#46150e',
        },
        accent: {
          50: '#fffaf9',
          100: '#fff1ed',
          200: '#ffdfd6',
          300: '#ffc1b1',
          400: '#ffa18b',
          500: '#FFBBAE', // Lighter Accent
          600: '#e68474',
          700: '#c26052',
          800: '#a34e44',
          900: '#874037',
          950: '#461b16',
        },
        secondary: '#FFBBAE', // Secondary Accent
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        
        dark: {
          bg: '#0F172A', // Primary Background
          surface: '#111827', // Secondary Background
          card: '#1E293B', // Card Background
          border: 'rgba(255,255,255,0.08)',
          800: '#111827',
          850: '#151e32',
          900: '#0F172A',
        },
        light: {
          bg: '#F8FAFC',
          surface: '#F1F5F9',
          card: '#FFFFFF',
          border: 'rgba(0,0,0,0.08)',
        },
        textPrimary: '#F8FAFC',
        textSecondary: '#CBD5E1',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.4)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'inner-glow': 'inset 0 0 20px rgba(99, 102, 241, 0.1)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
