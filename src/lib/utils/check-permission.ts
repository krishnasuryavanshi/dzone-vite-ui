export function checkPermission(
  permission: string | string[],
  permissions:
    | Record<string, boolean>
    | Record<string, Record<string, string[]>>,
  checkAllPermissions: boolean = false,
) {
  if (!permission) {
    return false;
  }

  const permissionCheck = Array.isArray(permission) ? permission : [permission];

  const checkPermission = (perm: string) => {
    if (!perm) return false;
    const [moduleAccess = '', action = '', field = ''] = perm.split('.') || [];

    if (typeof permissions[moduleAccess] === 'object') {
      // permissions is of type Record<string, Record<string, string[]>>
      if (field) {
        return !!permissions[moduleAccess]?.[field]?.includes(action);
      } else {
        return !!permissions[moduleAccess]?.[action]?.includes('');
      }
    } else {
      // permissions is of type Record<string, boolean>
      return !!permissions[perm];
    }
  };

  return checkAllPermissions
    ? permissionCheck.every(checkPermission)
    : permissionCheck.some(checkPermission);
}
