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

          // React ecosystem + state management (zustand/immer peer-depend on react)
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router/') ||
            id.includes('/react-is/') ||
            id.includes('/scheduler/') ||
            id.includes('/use-sync-external-store/') ||
            id.includes('/zustand/') ||
            id.includes('/immer/') ||
            id.includes('/@tanstack/react-query/') ||
            id.includes('/@tanstack/query-core/')
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
          // Includes transitive deps (vfile, devlop, bail, etc.) that would
          // otherwise fall to vendor-misc and create a circular chunk.
          if (
            id.includes('/react-markdown/') ||
            id.includes('/remark-') ||
            id.includes('/rehype-') ||
            id.includes('/unified/') ||
            id.includes('/micromark') ||
            id.includes('/mdast-') ||
            id.includes('/unist-') ||
            id.includes('/hast-') ||
            id.includes('/dompurify/') ||
            id.includes('/vfile') ||
            id.includes('/devlop/') ||
            id.includes('/bail/') ||
            id.includes('/trough/') ||
            id.includes('/property-information/') ||
            id.includes('/comma-separated-tokens/') ||
            id.includes('/space-separated-tokens/') ||
            id.includes('/decode-named-character-reference/') ||
            id.includes('/character-entities') ||
            id.includes('/ccount/') ||
            id.includes('/parse-entities/') ||
            id.includes('/stringify-entities/') ||
            id.includes('/longest-streak/') ||
            id.includes('/zwitch/') ||
            id.includes('/markdown-table/') ||
            id.includes('/trim-lines/') ||
            id.includes('/html-url-attributes/') ||
            id.includes('/escape-string-regexp/') ||
            id.includes('/is-plain-obj/') ||
            id.includes('/extend/') ||
            id.includes('/style-to-js/') ||
            id.includes('/estree-util-') ||
            id.includes('/@ungap/structured-clone/')
          )
            return 'vendor-markdown';

          // Everything else in node_modules
          return 'vendor-misc';
        },
      },
    },
  },
}));
