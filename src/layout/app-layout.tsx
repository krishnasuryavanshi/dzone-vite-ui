import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthGuard } from '../auth/auth-guard';
import PageLayout from '../components/layout/v1/page-layout';

/**
 * Dashboard layout wrapper — replaces (dashboard)/layout.tsx
 * Wraps authenticated pages with the sidebar + header layout.
 */
export const AppLayout = () => {
  return (
    <AuthGuard>
      <PageLayout>
        <Outlet />
      </PageLayout>
    </AuthGuard>
  );
};
