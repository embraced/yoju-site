/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        yoju: {
          orange: '#e07b39',
          'orange-light': '#f4a261',
          bg: '#fdf6ee',
          'bg-card': '#fff8f0',
          text: '#3a2010',
          'text-muted': '#5a4030',
          border: '#f0d8c0',
        },
      },
      fontSize: {
        base: ['18px', { lineHeight: '1.7' }],
        lg:   ['20px', { lineHeight: '1.7' }],
        xl:   ['22px', { lineHeight: '1.6' }],
        '2xl':['26px', { lineHeight: '1.5' }],
        '3xl':['32px', { lineHeight: '1.4' }],
      },
      fontFamily: {
        sans: ['"Noto Sans TC Variable"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
