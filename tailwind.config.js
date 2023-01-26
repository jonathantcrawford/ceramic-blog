module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    fontFamily: {
      'december': ['December', 'sans'],
      'saygon': ['Saygon', 'sans-serif'],
      'hamlin': ['Hamlin', 'sans-serif'],
      'mono': ['monospace']
    },
    fontSize: { // typescale minor second
      'xs': '0.823rem',
      'sm': '0.878rem',
      'tiny': '0.937rem',
      'base': '1rem',
      'lg': '1.067rem',
      'xl': '1.138rem',
      '2xl': '1.215rem',
      '3xl': '1.296rem',
      '4xl': '1.383rem',
      '5xl': '1.476rem',
      '6xl': '1.575rem',
      '7xl': '1.68rem',
    },
    lineHeight: { // typescale minor second
      '0': '1rem',
      '1': '1.067rem',
      '2': '1.138rem',
      '3': '1.215rem',
      '4': '1.296rem',
      '5': '1.383rem',
      '6': '1.476rem',
      '7': '1.575rem',
      '8': '1.68rem',
      '9': '1.793rem',
      '10': '1.913rem',
      '11': '2.041rem',
      '12': '2.178rem',
      '13': '2.323rem',
      '14': '2.479rem',
      '15': '2.645rem',
      '16': '2.822rem',
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
      'gray': {
        100: '#444444',
        200: '#1d1d1d'
      },
      'white': {
        100: '#ffffff'
      },
      'red': {
        100: '#ff124f'
      }
    },
    gridTemplateAreas: {
      'layout': [
        '. . . .',
        '. ga-header ga-header .',
        '. . . .',
        '. ga-sidebar ga-sidebar .',
        '. . . .',
        '. ga-content ga-content .',
        '. . . .',
        '. ga-footer ga-footer .',
      ],
      'desktop-layout': [
        '. . . . .',
        '. ga-header ga-header ga-header .',
        '. . . . .',
        '. ga-sidebar . ga-content .',
        '. . . . .',
        '. ga-footer ga-footer ga-footer .',
      ],
      'blog-post-forms': [
        'bpf-sections auto'
      ],
      'blog-post-content-form': [
        '. . bpf-submit bpf-submit',
        'bpf-emoji bpf-title bpf-title bpf-title',
        'bpf-subTitle bpf-subTitle bpf-subTitle bpf-subTitle',
        'bpf-body bpf-body bpf-preview bpf-preview'
      ],
      'blog-post-seo-form': [
        'bpf-og-img bpf-og-img bpf-submit bpf-submit',
        'bpf-preview-img-mdx bpf-preview-img-mdx bpf-preview-img-mdx bpf-preview-img-mdx',
        'bpf-preview-img bpf-preview-img bpf-preview-img bpf-preview-img',
      ],
      'account': [
        'acc-sidebar-min acc-sidebar-max acc-route',
      ]
    },
    gridTemplateColumns: {
      'layout': '5vw 20vw 70vw 5vw',
      'desktop-layout': '5vw 20vw 5vw 65vw 5vw',
      'blog-post-forms': '120px auto',
      'blog-post-content-form': '80px minmax(400px,700px) minmax(400px,auto) 80px',
      'blog-post-seo-form': '80px auto auto 80px',
      'account': 'min-content 250px auto'
    },
    gridTemplateRows: {
      'layout': '2rem min-content 1rem min-content 1rem auto 2rem min-content',
      'desktop-layout': '2rem min-content 2rem auto 2rem min-content',
      'blog-post-forms': 'auto',
      'blog-post-content-form': 'min-content min-content min-content auto',
      'blog-post-seo-form': 'min-content auto auto',
      'account': 'auto'
    },
  },
  plugins: [
    require('@savvywombat/tailwindcss-grid-areas')
  ],
  variants: {
    gridTemplateAreas: ['responsive']
  }
};
