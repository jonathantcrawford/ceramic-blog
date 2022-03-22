module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      'december': ['December', 'sans'],
      'saygon': ['Saygon', 'sans-serif'],
      'hamlin': ['Hamlin', 'sans-serif']
    },
    fontSize: {
      'xs': '0.579rem',
      'sm': '0.694rem',
      'tiny': '0.833rem',
      'base': '1rem',
      'lg': '1.2rem',
      'xl': '1.44rem',
      '2xl': '1.728rem',
      '3xl': '2.074rem',
      '4xl': '2.488rem',
      '5xl': '2.9856rem',
      '6xl': '3.583rem',
      '7xl': '4.3rem',
    },
    colors: {
      'yellow': {
        100: '#feed01',
        200: '#b1a500'
      },
      'pink': {
        100: '#ff65be',
        200: '#f90090'
      },
      'black': {
        100: '#000000'
      },
      'white': {
        100: '#ffffff'
      }
    },
    gridTemplateAreas: {
      'layout': [
        '. . .',
        '. ga-header .',
        '. . .',
        '. ga-content .',
        '. . .',
        '. ga-footer .',
      ],
    },
    gridTemplateColumns: {
      'layout': '5vw 90vw 5vw',
    },
    gridTemplateRows: {
      'layout': '5vh min-content 5vh auto 5vh min-content',
    },
  },
  plugins: [
    require('@savvywombat/tailwindcss-grid-areas')
  ],
  variants: {
    gridTemplateAreas: ['responsive']
  }
};
