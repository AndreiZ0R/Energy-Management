import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
// import * as path from "node:path";

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
   // resolve: {
   //    alias: {
   //       '@': path.resolve(__dirname, './src'),
   //       '@components': path.resolve(__dirname, './src/components'),
   //       '@pages': path.resolve(__dirname, './src/pages'),
   //    }
   // },
   plugins: [react()],
})
