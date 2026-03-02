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
      '@/refine-components': path.resolve(
        __dirname,
        'src/components/refine-components',
      ),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/providers': path.resolve(__dirname, 'src/providers'),
      '@/config': path.resolve(__dirname, 'src/config'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/stores': path.resolve(__dirname, 'src/stores'),
      '@/tests': path.resolve(__dirname, 'src/__tests__'),
      '@/public': path.resolve(__dirname, 'public'),
      '@app/auth-options': path.resolve(__dirname, 'src/shims/next-auth.ts'),

      // ── Next.js module shims ──
      'next/navigation': path.resolve(
        __dirname,
        'src/shims/next-navigation.ts',
      ),
      'next/link': path.resolve(__dirname, 'src/shims/next-link.tsx'),
      'next/image': path.resolve(__dirname, 'src/shims/next-image.tsx'),
      'next/headers': path.resolve(__dirname, 'src/shims/next-headers.ts'),
      'next/font/google': path.resolve(__dirname, 'src/shims/next-font.ts'),
      'next/server': path.resolve(__dirname, 'src/shims/next-server.ts'),
      'next/script': path.resolve(__dirname, 'src/shims/next-script.tsx'),
      'next/dist/shared/lib/app-router-context.shared-runtime': path.resolve(
        __dirname,
        'src/shims/next-app-router-context.ts',
      ),
      next: path.resolve(__dirname, 'src/shims/next.ts'),

      // ── NextAuth shims ──
      'next-auth/react': path.resolve(
        __dirname,
        'src/shims/next-auth-react.ts',
      ),
      'next-auth/providers/credentials': path.resolve(
        __dirname,
        'src/shims/next-auth.ts',
      ),
      'next-auth': path.resolve(__dirname, 'src/shims/next-auth.ts'),

      // ── Refine framework shims ──
      '@refinedev/core': path.resolve(__dirname, 'src/shims/refine-core.ts'),
      '@refinedev/antd': path.resolve(__dirname, 'src/shims/refine-antd.ts'),
      '@refinedev/kbar': path.resolve(__dirname, 'src/shims/refine-kbar.ts'),
      '@refinedev/nextjs-router': path.resolve(
        __dirname,
        'src/shims/refine-nextjs-router.ts',
      ),
      '@refinedev/simple-rest': path.resolve(
        __dirname,
        'src/shims/refine-simple-rest.ts',
      ),
      '@ant-design/nextjs-registry': path.resolve(
        __dirname,
        'src/shims/ant-design-nextjs-registry.tsx',
      ),

      // ── Node.js module shims ──
      https: path.resolve(__dirname, 'src/shims/https.ts'),
      cryptr: path.resolve(__dirname, 'src/shims/cryptr.ts'),
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
