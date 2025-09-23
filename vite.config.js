import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace 'evm-tracker' with your REPO name if different
export default defineConfig({
  plugins: [react()],
  base: '/testingkan/',
})
