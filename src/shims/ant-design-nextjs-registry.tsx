/**
 * Shim for `@ant-design/nextjs-registry`.
 * AntdRegistry is a Next.js SSR helper — passthrough in Vite.
 */
import React from 'react';

export function AntdRegistry({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
