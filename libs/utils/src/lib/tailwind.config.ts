const tailwindConfig = {
  theme: {
    extend: {
      fontFamily: {
        montserratAlt1: ['Montserrat-Alt1', 'bold'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3ABA8F',
          50: '#C0EBDD',
          100: '#B1E7D4',
          200: '#92DDC4',
          300: '#72D3B3',
          400: '#53C9A2',
          500: '#3ABA8F',
          600: '#2D8F6E',
          700: '#1F644D',
          800: '#123A2C',
          900: '#050F0B',
          950: '#000000',
        },
        complimentary: {
          DEFAULT: '#0A2859',
          50: '#3377E8',
          100: '#206BE6',
          200: '#1659C7',
          300: '#1249A2',
          400: '#0E387E',
          500: '#0A2859',
          600: '#041127',
          700: '#000000',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        },
        secondary: {
          DEFAULT: '#2678E4',
          50: '#C9DEF8',
          100: '#B7D2F6',
          200: '#93BCF2',
          300: '#6FA5ED',
          400: '#4A8FE9',
          500: '#2678E4',
          600: '#175EBB',
          700: '#114589',
          800: '#0B2C57',
          900: '#051325',
          950: '#01060C',
        },
      },
    },
  },
  plugins: [require('daisyui'), require('tailwindcss-safe-area')],
  daisyui: {
    themes: <unknown[]>[],
  },
};

tailwindConfig.daisyui.themes.push('dark', {
  notifytheme: {
    primary: tailwindConfig.theme.extend.colors.primary.DEFAULT,
    'primary-focus': tailwindConfig.theme.extend.colors.primary[600],
    'primary-content': '#ffffff',
    secondary: tailwindConfig.theme.extend.colors.secondary.DEFAULT,
    'secondary-focus': tailwindConfig.theme.extend.colors.secondary[700],
    'secondary-content': '#191E24',
    //use white: '#ffffff' as the accent,
    accent: '#ffffff',
    'accent-focus': '#ffffff',
    'accent-content': '#000000',
    neutral: tailwindConfig.theme.extend.colors.complimentary.DEFAULT,
    'neutral-focus': tailwindConfig.theme.extend.colors.complimentary[600],
    error: '#F44336',
    'error-focus': '#E53E3E',
  },
});

export { tailwindConfig };
