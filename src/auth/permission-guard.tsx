import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { logger } from '@/services/logger';
import { useAuthStore } from './stores';
import shouldValidatePath from '@/lib/utils/auth/should-validate-path';
import isAuthorizedPage from '@/lib/utils/auth/is-authorized-page';

export function PermissionGuard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const modules = useAuthStore((s) => s.modules);
  const pathname = location.pathname;

  // Mirror dzone-ui middleware: download-file with URL token bypasses checks
  if (pathname === '/integrations-hub/download-file') {
    const params = new URLSearchParams(location.search);
    if (params.get('token')) {
      logger.debug('PermissionGuard: download-file token bypass');
      return <>{children}</>;
    }
  }

  const { shouldValidate, parent } = shouldValidatePath(pathname);

  if (shouldValidate && parent) {
    const isAuthorized = isAuthorizedPage(parent, pathname, modules || {});
    if (!isAuthorized) {
      logger.warn('PermissionGuard: unauthorized — redirecting', {
        path: pathname,
        parentModule: parent,
      });
      return <Navigate to='/unauthorized' replace />;
    }
  }

  return <>{children}</>;
}
