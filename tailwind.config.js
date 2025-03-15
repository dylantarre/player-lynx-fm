/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'kaushan': ['"Kaushan Script"', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'morph': 'morph 16s ease-in-out infinite',
        'morph-reverse': 'morph 16s ease-in-out infinite reverse',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
          '50%': { borderRadius: '40% 60% 30% 70%/40% 60% 70% 30%' },
          '75%': { borderRadius: '70% 30% 60% 40%/60% 40% 30% 50%' }
        }
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(199, 210, 254, 0.5)',
        'glow-lg': '0 0 60px -15px rgba(199, 210, 254, 0.6)',
        'elevated': '0 8px 16px -4px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(255 255 255 / 0.1)',
        'elevated-hover': '0 12px 20px -6px rgb(0 0 0 / 0.15), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(255 255 255 / 0.15)'
      }
    },
  },
  plugins: [],
};
