import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API requests to Flask backend during development
    proxy: {
      '/generate': 'http://127.0.0.1:5001/aireportgenrator/us-central1/api',
      '/history': 'http://127.0.0.1:5001/aireportgenrator/us-central1/api',
      '/preview': 'http://127.0.0.1:5001/aireportgenrator/us-central1/api',
      '/health': 'http://127.0.0.1:5001/aireportgenrator/us-central1/api',
    },
  },
  build: {
    // Increase chunk size limit (jsPDF + docx are large libraries)
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        // Code-split vendor libraries for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'markdown': ['react-markdown', 'remark-gfm'],
          'export': ['jspdf', 'jspdf-autotable', 'docx', 'file-saver'],
          'icons': ['react-icons'],
        },
      },
    },
  },
})
