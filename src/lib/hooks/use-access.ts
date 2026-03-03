import { usePermissions } from './use-auth';
import { isArray } from 'lodash';

export function useAccess(roles: string | string[]) {
  const { data } = usePermissions<string[]>();
  if (!roles) {
    return false;
  }
  if (isArray(roles)) {
    return roles.some((role) => !!data?.includes(role));
  } else if (data?.includes(roles)) {
    return true;
  }
}
