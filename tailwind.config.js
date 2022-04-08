module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    screens: {
      'mobile': '0px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    fontFamily: {
      'december': ['December', 'sans'],
      'saygon': ['Saygon', 'sans-serif'],
      'hamlin': ['Hamlin', 'sans-serif'],
      'mono': ['monospace']
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
    lineHeight: {
      '0': '0rem',
      '4': '1rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '14': '3.5rem',
      '16': '4rem',
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
        '. ga-links ga-content .',
        '. . . .',
        '. ga-footer ga-footer .',
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
        'bpf-slug bpf-slug bpf-submit bpf-submit',
        'bpf-emoji bpf-title bpf-title bpf-title',
        'bpf-subTitle bpf-subTitle bpf-subTitle bpf-subTitle',
        'bpf-preview-img-mdx bpf-preview-img-mdx bpf-preview-img-mdx bpf-preview-img-mdx',
        'bpf-preview-img bpf-preview-img bpf-preview-img bpf-preview-img',
        
        
      ],
      'account': [
        'acc-sidebar-min acc-sidebar-max acc-route',
      ]
    },
    gridTemplateColumns: {
      'layout': '5vw 20vw 70vw 5vw',
      'blog-post-forms': '120px auto',
      'blog-post-content-form': '80px auto auto 80px',
      'blog-post-seo-form': '80px auto auto 80px',
      'account': 'min-content 250px auto'
    },
    gridTemplateRows: {
      'layout': '5vh min-content 5vh auto 5vh min-content',
      'blog-post-forms': 'auto',
      'blog-post-content-form': 'min-content min-content min-content auto',
      'blog-post-seo-form': 'min-content min-content min-content auto auto',
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
