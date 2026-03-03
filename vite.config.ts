import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
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
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // @ant-design/icons — separate chunk for cache longevity
          if (id.includes('@ant-design/icons')) return 'vendor-antd-icons';

          // Antd core + ALL internal deps (rc-component, cssinjs, babel/runtime, etc.)
          if (
            id.includes('/antd/') ||
            id.includes('/@rc-component/') ||
            id.includes('/@ant-design/') ||
            id.includes('/scroll-into-view-if-needed/') ||
            id.includes('/throttle-debounce/') ||
            id.includes('/@babel/runtime/')
          )
            return 'vendor-antd';

          // React ecosystem + state management (zustand/immer peer-depend on react)
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router/') ||
            id.includes('/react-is/') ||
            id.includes('/scheduler/') ||
            id.includes('/use-sync-external-store/') ||
            id.includes('/zustand/') ||
            id.includes('/immer/')
          )
            return 'vendor-react';

          // Charts: recharts + d3 deps
          if (
            id.includes('/recharts/') ||
            id.includes('/d3-') ||
            id.includes('/victory-vendor/')
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

          // Markdown rendering (dzent AI pages)
          if (
            id.includes('/react-markdown/') ||
            id.includes('/remark-') ||
            id.includes('/rehype-') ||
            id.includes('/unified/') ||
            id.includes('/micromark') ||
            id.includes('/mdast-') ||
            id.includes('/unist-') ||
            id.includes('/hast-') ||
            id.includes('/dompurify/')
          )
            return 'vendor-markdown';

          // Everything else in node_modules
          return 'vendor-misc';
        },
      },
    },
  },
}));
