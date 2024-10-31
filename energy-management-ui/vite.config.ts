import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // watch: {
    //   usePolling: true,
    // },
    proxy: {
      '/api': "http://localhost:8000",
      // "/socket": "wss://localhost:8080",
    },
  },
  plugins: [react()],
})
