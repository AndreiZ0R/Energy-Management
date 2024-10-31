import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

const proxyUrl = process.env.API_URL ?? "http://localhost:8000";
console.log("Configuring proxy for apiUrl: " + proxyUrl);

// https://vitejs.dev/config/
export default defineConfig({
   server: {
      watch: {
         usePolling: true,
      },
      proxy: {
         '^/api': {
            target: proxyUrl,
            rewrite: (path) => path.replace("/api", ''),
         }
         // "/socket": "wss://localhost:8080",
      },
   },
   plugins: [react()],
})
