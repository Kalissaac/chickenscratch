const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './src/{components,pages}/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        'accent-1': {
          50: '#72a5d0',
          100: '#689bc6',
          200: '#5e91bc',
          300: '#5487b2',
          400: '#4a7da8',
          500: '#40739e',
          600: '#366994',
          700: '#2c5f8a',
          800: '#225580',
          900: '#184b76'
        },
        'accent-2': '#353B48',
        'gray-darker': '#090909',
        'gray-lighter': '#F2F2F2',
        gray: colors.neutral
      }
    },
    fontFamily: {
      sans: [...defaultTheme.fontFamily.sans],
      serif: ['"New York Large"', ...defaultTheme.fontFamily.serif],
      newYorkMedium: ['"New York Medium"', ...defaultTheme.fontFamily.serif],
      newYorkExtraLarge: ['"New York Extra Large"', ...defaultTheme.fontFamily.serif],
      mono: defaultTheme.fontFamily.mono,
      editor: ['"iA Writer Quattro S"', ...defaultTheme.fontFamily.sans]
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
