export interface IRoles {
  id: string;
  name: string;
  users: number;
  description?: string;
  status: IStatus;
  editable?: boolean;
  tenantType: string;
}

export interface IModuleAttributes {
  moduleId: string;
  actionId: string;
  attributes?: {
    id: string;
  }[];
}

export interface IRoleDetails {
  id: string;
  name: string;
  description?: string;
  users: number;
  groups: number;
  attributes: number;
  status: {
    value: string;
    name: string;
  };
  moduleAttributes: IModuleAttributes[];
  tenantType: string;
}

export interface IStatus {
  name: string;
  value: string;
}

export interface IAction {
  id: string;
  value: string;
  dependsOnAction: string;
  children: string[];
}

export interface IModule {
  id: string;
  name: string;
  actions: IAction[];
}

export type ModuleConfig = IModule[];

export interface IGroupPermissions {
  type: string;
  attributes: [];
}

export interface IPermission {
  id: string;
  name: string;
  label: string;
  mandatory: boolean | null;
  parent: string;
  children: string[];
  actionsMapping?: { parentAction?: string; childrenActions?: string[] };
  internal?: boolean;
  // parent is parent action id of current parent rg. if current action in EDIT, and parent of EDIT is VIEW, then parent is VIEW
  // childrenActions is array of child action ids of current parent rg. if current action in EDIT, and parent of EDIT is VIEW, then childrenActions is array of child action ids of VIEW
}

export interface IRolePermissions {
  name: string;
  description: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  selected: string[];
  deselected: string[] | null;
}
