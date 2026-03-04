import React from 'react';
import { Outlet, Navigate } from 'react-router';
import { logger } from '@/services/logger';
import { useAuthStore } from '../auth/stores';
import AuthPageVisualLayout from '../app/(auth-pages)/layout';

/**
 * Auth pages layout — combines auth guard with the visual wrapper.
 * If already authenticated, redirect to dashboard.
 * Otherwise render the auth page visual layout with the page content.
 */
export const AuthLayout = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    const toParam = new URLSearchParams(window.location.search).get('to');
    const redirectTo = toParam ? decodeURIComponent(toParam) : '/';
    logger.info('AuthLayout: already authenticated — redirecting', { redirectTo });
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <AuthPageVisualLayout>
      <Outlet />
    </AuthPageVisualLayout>
  );
};
