const tailwindConfig = {
  theme: {
    extend: {
      fontFamily: {
        montserratAlt1: ['Montserrat-Alt1', 'bold'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#5BE6A7',
          50: '#FAFEFC',
          100: '#E9FCF3',
          200: '#C5F6E0',
          300: '#A2F1CD',
          400: '#7EEBBA',
          500: '#5BE6A7',
          600: '#2ADF8D',
          700: '#1CB570',
          800: '#148552',
          900: '#0D5434',
          950: '#093B25',
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
  plugins: [require('daisyui')],
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
  },
});

export { tailwindConfig };
