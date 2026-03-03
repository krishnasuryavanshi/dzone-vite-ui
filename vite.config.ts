import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // ── Source path aliases (match dzone-ui tsconfig) ──
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/services': path.resolve(__dirname, 'src/services'),
      '@/uicomponents': path.resolve(__dirname, 'src/components/uicomponents'),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/providers': path.resolve(__dirname, 'src/providers'),
      '@/config': path.resolve(__dirname, 'src/config'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/stores': path.resolve(__dirname, 'src/stores'),
      '@/tests': path.resolve(__dirname, 'src/__tests__'),
      '@/public': path.resolve(__dirname, 'public'),
    },
  },
  server: {
    port: 3001,
    proxy: {
      // Forward all /api/* requests to the Next.js backend on port 3000
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  define: {
    // Remaining process.env references (service-specific auth tokens, etc.)
    // are server-side only — they resolve to undefined which is fine.
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
});
