import { ActionType, ModuleNames, PermissionsGroupName } from '../enums';

export const getModuleEnumKey = (moduleName: string): ModuleNames | undefined => {
  const moduleKey = Object.keys(ModuleNames).find(
    (key) => ModuleNames[key as keyof typeof ModuleNames] === moduleName,
  );
  return ModuleNames[moduleKey as keyof typeof ModuleNames];
};

export const getPermissionsGroupEnumKey = (groupName: string): PermissionsGroupName => {
  const permissionKeys = Object.keys(PermissionsGroupName).find(
    (key) => PermissionsGroupName[key as keyof typeof PermissionsGroupName] === groupName,
  );
  return PermissionsGroupName[permissionKeys as keyof typeof PermissionsGroupName];
};

export const getActionsEnumKey = (actionName: string): ActionType => {
  const actionKey = Object.keys(ActionType).find(
    (key) => ActionType[key as keyof typeof ActionType] === actionName,
  );
  return ActionType[actionKey as keyof typeof ActionType];
};
