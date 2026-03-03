/**
 * Auth guard — wraps protected routes.
 * Redirects to /login if not authenticated.
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from './stores';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?to=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <>{children}</>;
}
