/**
 * Auth-related types.
 */

export type SessionStatus = 'authenticated' | 'unauthenticated' | 'loading';

export interface Session {
  accessToken: string;
  apiUrl: string;
  roles: any[];
  tenantCode: string[];
  isDzoneUser: boolean;
  user: any;
  tenantType: string;
  modules: Record<string, boolean>;
  moduleAccessList: any[];
  permissions: string[];
  error: string;
}

export interface User {
  name?: string;
  email?: string;
  image?: string;
  userId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  accessToken?: string;
  tenantCode?: string[];
  isDzoneUser?: boolean;
  roles?: any[];
  permissions?: string[];
  modules?: any[];
  type?: string;
}
