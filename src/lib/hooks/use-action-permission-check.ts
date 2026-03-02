import { usePermissionsStore } from '@/stores/permissions-store';

export function usePermissionCheck(
  permission: string | string[],
  checkAllPermissions: boolean = false,
) {
  const { accesses } = usePermissionsStore();

  if (!permission) {
    return false;
  }
  const permissionCheck = Array.isArray(permission) ? permission : [permission];
  return checkAllPermissions
    ? permissionCheck.every((perm) => accesses[perm] === true)
    : permissionCheck.some((perm) => accesses[perm] === true);
}
