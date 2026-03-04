import { AccessKeys, RestrictedAccessKeys } from '@/lib/enums';
import { accessKeys } from '@/lib/constants';
import { RestrictedAccessPermissions } from '@/lib/constants';
import { useAccess } from '@/lib/hooks';

export function useRestrictedAccess(accessKey: AccessKeys | RestrictedAccessKeys) {
  const accesibleRoles = accessKeys[accessKey as AccessKeys] || [];
  const restrictedRoles = RestrictedAccessPermissions[accessKey as RestrictedAccessKeys] || [];
  const allowedAccess = useAccess(accesibleRoles);
  const restrictedAccess = useAccess(restrictedRoles);

  if ((restrictedRoles?.length && restrictedAccess) || (accesibleRoles?.length && !allowedAccess)) {
    return true;
  }
  return false;
}
