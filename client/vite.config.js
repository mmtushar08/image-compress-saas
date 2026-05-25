import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          'vendor-stripe': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          'vendor-gsap': ['gsap', '@gsap/react'],
          'vendor-ui': ['lucide-react', '@headlessui/react'],
          'vendor-utils': ['file-saver', 'jszip', 'md5'],
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    },
    historyApiFallback: true
  }
})
