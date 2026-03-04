import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
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
      // Forward /api/* requests to the backend on port 3000
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
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // Ant Design — icons, core, and all internal deps in one chunk.
          // antd <-> @ant-design/icons are tightly coupled (mutual imports
          // via @ant-design/colors, @ant-design/icons-svg, @rc-component/*)
          // so they must share a chunk to avoid circular chunks.
          // NOTE: @babel/runtime is intentionally left in vendor-misc —
          // it's a universal runtime used across all chunks, and pinning it
          // here would create a vendor-antd <-> vendor-misc cycle.
          if (
            id.includes('/antd/') ||
            id.includes('/@ant-design/') ||
            id.includes('/@rc-component/') ||
            id.includes('/scroll-into-view-if-needed/') ||
            id.includes('/throttle-debounce/')
          )
            return 'vendor-antd';

          // Charts: recharts + d3 deps
          if (
            id.includes('/recharts/') ||
            id.includes('/d3-') ||
            id.includes('/victory-vendor/') ||
            id.includes('/react-redux/') ||
            id.includes('/@reduxjs/toolkit/')
          )
            return 'vendor-charts';

          // amcharts (only used in analytics pages, lazily loaded)
          if (id.includes('/@amcharts/')) return 'vendor-amcharts';

          // Date library
          if (id.includes('/dayjs/')) return 'vendor-dayjs';

          // i18n
          if (id.includes('/i18next') || id.includes('/react-i18next/'))
            return 'vendor-i18n';

          // Lodash
          if (id.includes('/lodash')) return 'vendor-lodash';

          // Everything else (React, state mgmt, sentry, markdown, etc.)
          // Kept in one chunk to avoid circular dependency issues.
          return 'vendor-core';
        },
      },
    },
  },
}));
