import { IOrganization } from '@/app/(dashboard)/(system-admin)/organizations/lib/types';

export interface IUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  type: string;
  isDzoneUser: boolean;
  roles: IUserRole[];
  organizations: IOrganization[];
  lastLoginTime: string;
  editable: boolean;
  autoAssignMarketers: boolean;
}

export interface IUserRole {
  id: string;
  name: string;
  type: string;
}
