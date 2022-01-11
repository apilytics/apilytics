module.exports = {
  content: ['src/pages/**/*.{js,ts,jsx,tsx}', 'src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        background: "url('/background.jpg')",
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'fade-in-top': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        spinner: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out forwards',
        'fade-in-top': 'fade-in-top 1s ease-out forwards',
        spinner: 'spinner 1.5s linear infinite',
      },
      maxHeight: {
        128: '32rem',
      },
    },
    fontFamily: {
      sans: ['Ubuntu', 'sans-serif'],
      serif: ['Ubuntu', 'serif'],
    },
    container: {
      center: true,
      padding: '1rem',
    },
  },
  daisyui: {
    themes: [
      {
        'custom-theme': {
          primary: '#529dff',
          'primary-focus': '#306cba',
          'primary-content': '#ffffff',
          secondary: '#08cf6b',
          'secondary-focus': '#0ea157',
          'secondary-content': '#ffffff',
          accent: '#37cdbe',
          'accent-focus': '#2aa79b',
          'accent-content': '#ffffff',
          neutral: '#3d4451',
          'neutral-focus': '#2a2e37',
          'neutral-content': '#ffffff',
          'base-100': '#1f2937',
          'base-200': '#1b2024',
          'base-300': '#000000',
          'base-content': '#8a8a8a',
          info: '#2094f3',
          success: '#009485',
          warning: '#ff9900',
          error: '#ff5724',
        },
      },
    ],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
