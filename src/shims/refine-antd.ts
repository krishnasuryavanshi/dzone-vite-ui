/**
 * Shim for `@refinedev/antd`.
 * Exports stubs for components imported from refine-antd.
 */
import React from 'react';

// ErrorComponent — renders a simple error message
export function ErrorComponent({ error }: { error?: string } & Record<string, any>) {
  return null;
}

// ThemedLayoutV2 — passthrough wrapper
export function ThemedLayoutV2({ children, ...rest }: { children?: React.ReactNode } & Record<string, any>) {
  return children ?? null;
}

// ThemedSiderV2 — no-op
export function ThemedSiderV2(_props: any) {
  return null;
}

// ThemedTitleV2 — no-op
export function ThemedTitleV2(_props: any) {
  return null;
}

// Types
export interface RefineLayoutThemedTitleProps {
  collapsed?: boolean;
  [key: string]: any;
}

export interface RefineThemedLayoutV2SiderProps {
  Title?: React.ComponentType<any>;
  render?: (props: any) => React.ReactNode;
  [key: string]: any;
}
