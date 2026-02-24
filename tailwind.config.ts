import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#0a0a0a',
        muted: '#f5f5f5',
        'muted-foreground': '#737373',
        border: '#e5e5e5',
      },
    },
  },
  plugins: [],
}
export default config
