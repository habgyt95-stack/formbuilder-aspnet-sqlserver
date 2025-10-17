/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fb-primary': 'var(--fb-primary)',
        'fb-secondary': 'var(--fb-secondary)',
        'fb-background': 'var(--fb-background)',
        'fb-foreground': 'var(--fb-foreground)',
        'fb-border': 'var(--fb-border)',
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
  ],
}
