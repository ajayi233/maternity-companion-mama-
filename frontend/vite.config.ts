import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  // server: {
  //   host: "::",
  //   port: 8080,
  // },
  define: {
    'import.meta.env.VITE_GHANA_NLP_API_BASE_URL': JSON.stringify(process.env.VITE_GHANA_NLP_API_BASE_URL || 'https://translation-api.ghananlp.org'),
    'import.meta.env.VITE_GHANA_NLP_SUBSCRIPTION_KEY': JSON.stringify(process.env.VITE_GHANA_NLP_SUBSCRIPTION_KEY || '8e7005744e6d4483a8dd5665c5a8c0f4'),
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast'],
        },
      },
    },
  },
}));
