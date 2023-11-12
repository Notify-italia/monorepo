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
          DEFAULT: '#3A65BA',
          50: '#C0CFEB',
          100: '#B1C3E7',
          200: '#92ABDD',
          300: '#7293D3',
          400: '#537BC9',
          500: '#3A65BA',
          600: '#2D4E8F',
          700: '#1F3764',
          800: '#121F3A',
          900: '#05080F',
          950: '#000000',
        },
        secondary: {
          DEFAULT: '#DCE4DA',
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#FFFFFF',
          400: '#F2F5F2',
          500: '#DCE4DA',
          600: '#BDCCBA',
          700: '#9FB599',
          800: '#809D79',
          900: '#64805D',
          950: '#587052',
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [],
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
