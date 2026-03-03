/**
 * Auth guard — wraps protected routes.
 * Redirects to /login if not authenticated.
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { logger } from '@/services/logger';
import { useAuthStore } from './stores';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const blockedPath = `${location.pathname}${location.search}`;
    logger.warn('AuthGuard: unauthenticated — redirecting to login', { blockedPath });
    return <Navigate to={`/login?to=${encodeURIComponent(blockedPath)}`} replace />;
  }

  return <>{children}</>;
}
