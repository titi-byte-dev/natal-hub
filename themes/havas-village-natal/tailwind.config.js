const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    '../../config/**/*.yaml',
    '../../pages/**/*.md',
    './blueprints/**/*.yaml',
    './js/**/*.js',
    './templates/**/*.twig',
    './theme.yaml',
    './theme.php',
  ],
  darkMode: 'class', //false or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        'tiny': '16rem',
      },
      borderWidth: {
        'thin': '0.5px',
      },
      fontFamily: {
        fb: ['sans-serif'],
        helvetica: ['HelveticaNeue'],
        helveticaCond: ['HelveticaNeueCond'],
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ]
      },
      lineHeight: {
        '6xl': '0.85'
      }
    },
    fill: {
      current: 'currentColor',
      none: 'none'
    },
    stroke: {
      current: 'currentColor',
      none: 'none'
    },
    filter: {
      'none': 'none',
      'grayscale': 'grayscale(1)',
      'more-bright': 'brightness(110%)',
      'less-bright': 'brightness(90%)',
      'red': 'url("#red")'
    },
    colors: {
      'red': {
        'lighter': 'color(#e10514 tint(20%))',
        DEFAULT: '#e10514',
        'darker' : 'color(#e10514 shade(20%))',
      },
      'blue': {
        'lighter': 'color(#00adcf tint(20%))',
        DEFAULT: '#00adcf',
        'darker' : 'color(#00adcf shade(20%))',
      },
      'pink': {
        'lighter': 'color(#e5017e tint(20%))',
        DEFAULT: '#e5017e',
        'darker' : 'color(#e5017e shade(20%))',
      },
      'green': {
        'lighter': 'color(#66b22e tint(20%))',
        DEFAULT: '#66b22e',
        'darker' : 'color(#66b22e shade(20%))',
      },
      black: colors.black,
      white: colors.white,
      orange: colors.orange,
      indigo: colors.indigo,
      transparent: 'transparent',
      gray: '#5D5D5D',
      'inherit': 'inherit',
    },
    typography: (theme) => ({
      DEFAULT: {
        css: {
          color: 'inherit',
          lineHeight: 'inherit',
          maxWidth: 'inherit',
          a: {
            transition: 'all 500ms',
            color: theme('colors.primary.DEFAULT'),
            '&:hover': {
              color: theme('colors.primary.darker')
            },
            textDecoration: 'none'
          },
          strong: {
            color: 'inherit'
          },
        }
      }
    }),

  },
  variants: {
    extend: {
      stroke: ['responsive', 'hover'],
      fill: ['responsive', 'hover'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-filters'),
    require('tailwindcss-debug-screens'),
  ],
  important: false,
}
