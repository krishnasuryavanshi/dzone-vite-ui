import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
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
    return <Navigate to="/" replace />;
  }

  return (
    <AuthPageVisualLayout>
      <Outlet />
    </AuthPageVisualLayout>
  );
};
