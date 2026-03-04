import { FC, ReactNode } from 'react';
import { PermissionDenied } from '../shared';
import { usePermissionCheck } from '@/lib/hooks';

export const HasPermission: FC<HasPermissionsProps> = ({
  permissions,
  children,
  showAccessDenied = false,
}) => {
  const hasPermission = usePermissionCheck(permissions, Array.isArray(permissions) ? true : false);

  if (!hasPermission) {
    if (!showAccessDenied) {
      return null;
    }
    return <PermissionDenied />;
  }

  return <>{children}</>;
};

export interface HasPermissionsProps {
  permissions: string | string[];
  children: ReactNode;
  showAccessDenied?: boolean;
}
