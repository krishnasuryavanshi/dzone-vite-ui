/**
 * Root layout — NOT USED in Vite app.
 * The equivalent functionality is in index.html + app.tsx.
 * This file exists only for compatibility with copied code.
 */
import React from 'react';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
