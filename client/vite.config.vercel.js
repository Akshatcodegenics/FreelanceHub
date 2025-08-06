import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vercel-optimized Vite configuration
// This configuration avoids Terser dependency issues on Vercel
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-icons', 'react-hot-toast'],
          utils: ['axios', 'date-fns', 'clsx']
        },
        // Ensure consistent file names for caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Use esbuild for minification (faster and more compatible)
    minify: 'esbuild',
    // Ensure compatibility with older browsers
    target: 'es2015'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    global: 'globalThis'
  },
  // Ensure proper handling of environment variables
  envPrefix: 'VITE_',
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  }
})
