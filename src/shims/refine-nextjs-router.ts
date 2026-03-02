/**
 * Shim for `@refinedev/nextjs-router`.
 * routerProvider and NavigateToResource are shimmed.
 */
import React from 'react';

// Default export — routerProvider (no-op, routing is handled by React Router)
const routerProvider = {};
export default routerProvider;

// NavigateToResource — redirects to /dashboard
export function NavigateToResource(_props?: { resource?: string }) {
  if (typeof window !== 'undefined') {
    window.location.href = '/dashboard';
  }
  return null;
}
