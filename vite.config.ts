import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true,
    watch: {
      ignored: ['**/*.pdf', '**/scratch/**', '**/.git/**']
    }
  },
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks: {
          katex: ['katex'],
          vendor: ['react', 'react-dom', 'lucide-react', 'canvas-confetti'],
        }
      }
    }
  }
});
