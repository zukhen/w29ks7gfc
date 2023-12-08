import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./public"),
      "./runtimeConfig": "./runtimeConfig.browser",
      "jss-plugin-{}": "jss-plugin-global",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
      },
    },
  },
  build: {
   
  },
 
});
