
import { AccessKeys, RestrictedAccessKeys } from '@/lib/enums';
import { useRestrictedAccess } from '@/lib/hooks';
import { FC, ReactNode } from 'react';
import { PermissionDenied } from '../shared';

export const CanAccess: FC<CanAccessProps> = ({
  accessKey,
  children,
  showAccessDenied = false,
}) => {
  const isRestrictedAccess = useRestrictedAccess(accessKey);

  if (isRestrictedAccess) {
    if (!showAccessDenied) {
      return null;
    }
    return <PermissionDenied />;
  }
  return <>{children}</>;
};

export interface CanAccessProps {
  accessKey: AccessKeys | RestrictedAccessKeys;
  children: ReactNode;
  showAccessDenied?: boolean;
}
