/**
 * Devtools provider — no-op in Vite app (Refine devtools not available).
 */
import React from 'react';

export const DevtoolsProvider = ({ children }: React.PropsWithChildren) => {
  return <>{children}</>;
};
