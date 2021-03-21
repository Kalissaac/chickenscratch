const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/{components,pages}/**/*.{js,ts,jsx,tsx}'
    ]
  },
  darkMode: 'class', // 'media' or 'class'
  theme: {
    extend: {
      colors: {
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
        gray: colors.trueGray
      },
      typography: (theme) => ({
        light: {
          css: [
            {
              color: theme('colors.gray.300'),
              '[class~="lead"]': {
                color: theme('colors.gray.200')
              },
              a: {
                color: theme('colors.white')
              },
              strong: {
                color: theme('colors.white')
              },
              'ol > li::before': {
                color: theme('colors.gray.400')
              },
              'ul > li::before': {
                backgroundColor: theme('colors.gray.600')
              },
              hr: {
                borderColor: theme('colors.gray.200')
              },
              blockquote: {
                color: theme('colors.gray.200'),
                borderLeftColor: theme('colors.gray.600')
              },
              h1: {
                color: theme('colors.white')
              },
              h2: {
                color: theme('colors.white')
              },
              h3: {
                color: theme('colors.white')
              },
              h4: {
                color: theme('colors.white')
              },
              'figure figcaption': {
                color: theme('colors.gray.400')
              },
              code: {
                color: theme('colors.white')
              },
              'a code': {
                color: theme('colors.white')
              },
              pre: {
                color: theme('colors.gray.200'),
                backgroundColor: theme('colors.gray.800')
              },
              thead: {
                color: theme('colors.white'),
                borderBottomColor: theme('colors.gray.400')
              },
              'tbody tr': {
                borderBottomColor: theme('colors.gray.600')
              }
            }
          ]
        }
      })
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
  variants: {
    extend: {
      typography: ['dark']
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
