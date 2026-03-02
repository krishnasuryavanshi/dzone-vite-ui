import { IModuleAttributes } from '../types';

export const createActionsPermissions = (
  moduleAttributes: IModuleAttributes[],
) => {
  const actions: Record<string, string[]> = {};
  const permissions: Record<string, string[]> = {};
  moduleAttributes.forEach((module) => {
    if (module.attributes?.length) {
      permissions[module.actionId] = module.attributes.map(
        (attribute) => attribute.id,
      );
    }
    if (actions[module.moduleId]?.length) {
      actions[module.moduleId].push(module.actionId);
    } else {
      actions[module.moduleId] = [module.actionId];
    }
  });
  return { actions, permissions };
};
