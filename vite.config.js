import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from 'vite-plugin-svgr';


export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    host: '0.0.0.0', 
    port: 5173,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'ee9d79d4b53d.ngrok-free.app'  
    ]
  }
});
