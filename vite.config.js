import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // IMPORTANT for GitHub Pages: this must match your repository name exactly,
  // wrapped in slashes, e.g. '/grade-computation-app/'.
  // If you're deploying to a USER/ORG page (a repo literally named
  // "<your-username>.github.io"), set this back to '/' instead.
  //
  // Only applied during `npm run build` — `npm run dev` always serves from
  // the root ('/') so your local dev server keeps working normally at
  // http://localhost:5173/ regardless of what this is set to.
  base: command === 'build' ? '/bicol-university-grade-calculator/' : '/',
}))