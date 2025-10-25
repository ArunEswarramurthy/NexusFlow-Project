/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Logo Blue (#0052D4)
        primary: {
          50: '#E6F0FF',
          100: '#CCE1FF',
          200: '#99C3FF',
          300: '#66A5FF',
          400: '#3387FF',
          500: '#0052D4',
          600: '#0042AA',
          700: '#003280',
          800: '#002255',
          900: '#00112B',
        },
        // Secondary Colors - Logo Orange (#F2994A)
        secondary: {
          50: '#FEF5EC',
          100: '#FDEBD9',
          200: '#FBD7B3',
          300: '#F9C38D',
          400: '#F7AF67',
          500: '#F2994A',
          600: '#E07A1F',
          700: '#B85F17',
          800: '#8F4511',
          900: '#662A0B',
        },
        // Accent Colors - Neutral grays
        accent: {
          50: '#F9F9F9',
          100: '#F4F7F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#2D3748',
          900: '#333333',
        },
        // Background Colors
        background: {
          primary: '#FFFFFF',
          secondary: '#F4F7F6',
          tertiary: '#F9F9F9',
        },
        // Status Colors
        success: {
          50: 'rgb(240, 253, 244)',   // #F0FDF4
          100: 'rgb(220, 252, 231)',  // #DCFCE7
          200: 'rgb(187, 247, 208)',  // #BBF7D0
          300: 'rgb(134, 239, 172)',  // #86EFAC
          400: 'rgb(74, 222, 128)',   // #4ADE80
          500: 'rgb(34, 197, 94)',    // #22C55E
          600: 'rgb(22, 163, 74)',    // #16A34A
          700: 'rgb(21, 128, 61)',    // #15803D
          800: 'rgb(22, 101, 52)',    // #166534
          900: 'rgb(20, 83, 45)',     // #14532D
        },
        danger: {
          50: 'rgb(254, 242, 242)',   // #FEF2F2
          100: 'rgb(254, 226, 226)',  // #FEE2E2
          200: 'rgb(254, 202, 202)',  // #FECACA
          300: 'rgb(252, 165, 165)',  // #FCA5A5
          400: 'rgb(248, 113, 113)',  // #F87171
          500: 'rgb(239, 68, 68)',    // #EF4444
          600: 'rgb(220, 38, 38)',    // #DC2626
          700: 'rgb(185, 28, 28)',    // #B91C1C
          800: 'rgb(153, 27, 27)',    // #991B1B
          900: 'rgb(127, 29, 29)',    // #7F1D1D
        },
        warning: {
          50: 'rgb(255, 251, 235)',   // #FFFBEB
          100: 'rgb(254, 243, 199)',  // #FEF3C7
          200: 'rgb(253, 230, 138)',  // #FDE68A
          300: 'rgb(252, 211, 77)',   // #FCD34D
          400: 'rgb(251, 191, 36)',   // #FBBF24
          500: 'rgb(245, 158, 11)',   // #F59E0B
          600: 'rgb(217, 119, 6)',    // #D97706
          700: 'rgb(180, 83, 9)',     // #B45309
          800: 'rgb(146, 64, 14)',    // #92400E
          900: 'rgb(120, 53, 15)',    // #78350F
        },
        info: {
          50: 'rgb(239, 246, 255)',   // #EFF6FF
          100: 'rgb(219, 234, 254)',  // #DBEAFE
          200: 'rgb(191, 219, 254)',  // #BFDBFE
          300: 'rgb(147, 197, 253)',  // #93C5FD
          400: 'rgb(96, 165, 250)',   // #60A5FA
          500: 'rgb(59, 130, 246)',   // #3B82F6
          600: 'rgb(37, 99, 235)',    // #2563EB
          700: 'rgb(29, 78, 216)',    // #1D4ED8
          800: 'rgb(30, 64, 175)',    // #1E40AF
          900: 'rgb(30, 58, 138)',    // #1E3A8A
        },
        // Priority Colors
        urgent: '#EF4444',    // Red
        high: '#F2994A',      // Orange (from logo)
        medium: '#F59E0B',    // Yellow
        low: '#22C55E',       // Green
        
        // Text Colors
        text: {
          primary: '#333333',
          secondary: '#2D3748',
          muted: '#6B7280',
        },
        
        // Neutral Colors (90% of the design)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#2D3748',
          900: '#333333',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(30, 144, 255, 0.4)',
        'glow-lg': '0 0 40px rgba(30, 144, 255, 0.5)',
        'glow-purple': '0 0 25px rgba(138, 43, 226, 0.4)',
        'glow-pink': '0 0 25px rgba(255, 20, 147, 0.4)',
        'glow-yellow': '0 0 25px rgba(255, 215, 0, 0.4)',
        'colorful': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'tooltip-in': 'tooltipIn 0.2s ease-out',
        'tooltip-out': 'tooltipOut 0.15s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        tooltipIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px) scale(0.8)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        tooltipOut: {
          '0%': { opacity: '1', transform: 'translateX(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateX(-10px) scale(0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}