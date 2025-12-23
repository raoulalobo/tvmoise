import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs Arte TV (thème sombre)
        arte: {
          orange: '#FF7900',
          'orange-dark': '#E95C0D',
          'orange-light': '#FFA040',
          black: '#0a0a0a',
          'gray-darker': '#1a1a1a',
          'gray-dark': '#2a2a2a',
          'gray-medium': '#4a4a4a',
          'gray-light': '#9a9a9a',
          white: '#ffffff',
        },
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 24px rgba(255, 121, 0, 0.3)',
        'header': '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
