import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

const httpProxyUrl = process.env.API_URL ?? "http://localhost:8000";
const wsProxyUrl = process.env.WS_URL ?? "http://localhost:8003";
console.log("Configuring http proxy: ", httpProxyUrl);
console.log("Configuring ws proxy: ", wsProxyUrl);

export default defineConfig({
   server: {
      watch: {
         usePolling: true,
      },
      proxy: {
         '^/api': {
            target: httpProxyUrl,
            rewrite: (path) => path.replace("/api", ''),
         },
         '/socket': wsProxyUrl
      },
   },
   plugins: [react()],
})
