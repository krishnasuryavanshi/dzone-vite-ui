import { usePermissionsStore } from '@/stores/permissions-store';

export const usePermissionCheck = (
  permission: string | string[],
  checkAllPermissions: boolean = false,
): boolean => {
  const { accesses, attributes } = usePermissionsStore();
  const permissionCheck = Array.isArray(permission) ? permission : [permission];

  const checkPermission = (perm: string) => {
    if (!perm) return false;
    if (!accesses) {
      return false;
    }
    const parts = perm.split('.');
    if (parts.length < 2) return false;
    const [moduleAccess = '', action = '', field = ''] = parts;
    if (field) {
      return !!attributes[moduleAccess]?.[field]
        ?.map((a) => a)
        .includes(action);
    } else {
      return !!accesses[`${moduleAccess}.${action}`];
    }
  };

  return checkAllPermissions
    ? permissionCheck.every(checkPermission)
    : permissionCheck.some(checkPermission);
};
