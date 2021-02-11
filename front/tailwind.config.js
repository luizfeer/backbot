/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  theme: {
    fontFamily: {
      base: ['Open Sans', 'Helvetica', 'Arial', 'sans-serif'],
      Roboto: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      Verdana: ['Verdana', 'Helvetica', 'Arial', 'sans-serif']

    },
    colors: {
      white: {
        default: 'var(--color-white-default)',
        95: 'var(--color-white-95)',
        90: 'var(--color-white-90)',
        80: 'var(--color-white-80)',
        75: 'var(--color-white-75)',
        70: 'var(--color-white-70)',
        60: 'var(--color-white-60)',
        50: 'var(--color-white-50)',
        40: 'var(--color-white-40)',
        30: 'var(--color-white-30)',
        25: 'var(--color-white-25)',
        20: 'var(--color-white-20)',
        10: 'var(--color-white-10)',
        5: 'var(--color-white-5)'
      },
      yellow: {
        default: 'var(--color-yellow)',
        5: 'var(--color-yellow-5)'
      },
      blue: {
        5: 'var(--color-blue-5)',
        10: 'var(--color-blue-10)',
        15: 'var(--color-blue-15)'
      },

      gray: {
        1: 'var(--color-gray-1)',
        100: 'var(--color-gray-100)',
        200: 'var(--color-gray-200)',
        300: 'var(--color-gray-300)',
        400: 'var(--color-gray-400)',
        500: 'var(--color-gray-500)',
        600: 'var(--color-gray-600)',
        700: 'var(--color-gray-700)',
        800: 'var(--color-gray-800)',
        900: 'var(--color-gray-900)'
      },

      purple: {
        100: 'var(--color-purple-100)',
        200: 'var(--color-purple-200)',
        300: 'var(--color-purple-300)',
        400: 'var(--color-purple-400)',
        500: 'var(--color-purple-500)',
        600: 'var(--color-purple-600)',
        700: 'var(--color-purple-700)',
        800: 'var(--color-purple-800)',
        900: 'var(--color-purple-900)'
      },

      pink: {
        100: 'var(--color-pink-100)',
        200: 'var(--color-pink-200)',
        300: 'var(--color-pink-300)',
        400: 'var(--color-pink-400)',
        500: 'var(--color-pink-500)',
        600: 'var(--color-pink-600)',
        700: 'var(--color-pink-700)',
        800: 'var(--color-pink-800)',
        900: 'var(--color-pink-900)',
        footer: 'var(--color-footer-error)'
      },
      red: {
        100: 'var(--color-red-100)',
        200: 'var(--color-red-200)',
        300: 'var(--color-red-300)',
        400: 'var(--color-red-400)',
        500: 'var(--color-red-500)',
        600: 'var(--color-red-600)',
        700: 'var(--color-red-700)',
        800: 'var(--color-red-800)',
        900: 'var(--color-red-900)'
      }
    }
  },
  variants: {},
  plugins: [],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ]
  }
}
