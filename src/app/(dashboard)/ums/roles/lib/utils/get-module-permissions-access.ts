export const getModulePermissionsAccess = (
  selectedActions: Record<string, string[]>,
  selectedPermissions: Record<string, string[]>,
) => {
  const moduleAttributes: Record<string, any>[] = [];
  Object.keys(selectedActions).forEach((moduleId) => {
    const actions = selectedActions[moduleId].map((actionId) => {
      const attributes = selectedPermissions[actionId].map((permissionId) => ({
        id: permissionId,
      }));
      const actionItem: Record<string, any> = {
        moduleId: moduleId,
        actionId: actionId,
      };

      if (attributes?.length) {
        actionItem.attributes = attributes;
      }

      return actionItem;
    });
    moduleAttributes.push(...actions);
  });

  return moduleAttributes;
};
