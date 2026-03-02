/**
 * Dashboard layout — in the Vite app, this is handled by AppLayout in the router.
 * This file exists for compatibility; it's a simple passthrough.
 */
import React from 'react';

export default function Layout({
  children,
}: Readonly<React.PropsWithChildren>) {
  return <>{children}</>;
}
