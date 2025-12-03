import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // change to '/your-repo-name/' if not using github.io domain
  assetsInclude: ['**/*.glb']
})
