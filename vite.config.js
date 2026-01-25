import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import packageJson from './package.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      react: 'react',
      'react-dom': 'react-dom',
    },
  },
  optimizeDeps: {
    include: ['mermaid', 'framer-motion', 'react', 'react-dom', 'react-router-dom'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [/mermaid/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 1. Core React Vendor (Critical for Singleton Pattern)
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/react-dom') || 
              id.includes('node_modules/react-router-dom') ||
              id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }

          // 2. Firebase Vendor
          if (id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
          }

          // 3. Visualization Vendor
          if (id.includes('node_modules/mermaid') || 
              id.includes('node_modules/recharts') || 
              id.includes('node_modules/d3')) {
            return 'vendor-viz';
          }

          // 4. Animation Vendor
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-animation';
          }
          
          // 5. Everything else from node_modules
          if (id.includes('node_modules')) {
            return 'vendor-utils';
          }
        },
      },
    },
  },
  // ✅ FIX: Modernized Pool Configuration for Vitest 4+
  pool: 'forks',
  poolOptions: {
    forks: {
      singleFork: true,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    testTimeout: 10000,
  },
})
