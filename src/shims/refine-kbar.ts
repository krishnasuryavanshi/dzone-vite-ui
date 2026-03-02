/**
 * Shim for `@refinedev/kbar`.
 * Command palette is not included in the Vite app.
 */
import React from 'react';

export function RefineKbar(_props?: any) {
  return null;
}

export function RefineKbarProvider({ children }: { children?: React.ReactNode }) {
  return children ?? null;
}
