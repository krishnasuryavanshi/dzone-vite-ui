/**
 * Auth-related types — extracted from Refine and NextAuth shims.
 */

export interface AuthBindings {
  login?: (params: any) => Promise<any>;
  logout?: (params?: any) => Promise<any>;
  check?: (params?: any) => Promise<any>;
  onError?: (error: any) => Promise<any>;
  getPermissions?: (params?: any) => Promise<any>;
  getIdentity?: (params?: any) => Promise<any>;
}

export interface I18nProvider {
  translate: (key: string, options?: any) => string;
  changeLocale: (lang: string) => Promise<any> | void;
  getLocale: () => string;
}

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
