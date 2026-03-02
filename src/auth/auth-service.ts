/**
 * Client-side auth service.
 * Authenticates directly against the RBAC service (no NextAuth proxy).
 */
import { pick } from 'lodash';
import { ApiHost } from '@/lib/constants';
import { ApiResources, HttpMethod } from '@/lib/enums';
import { backendRequest } from '@/services/back-end-manager';
import { useAuthStore, useTokenStore } from './stores';
import { usePermissionsStore } from '../stores/permissions-store';

/**
 * Flatten modules array from the login response into a permissions object.
 * Mirrors the JWT callback logic from dzone-ui's NextAuth options.ts.
 */
function flattenPermissions(
  modules: { module: { name: string; access: string | string[] } }[],
): Record<string, boolean> {
  const allAccesses = modules.flatMap((item) => {
    const moduleName = item.module.name;
    const accesses = Array.isArray(item.module.access)
      ? item.module.access
      : item.module.access
        ? [item.module.access]
        : [];
    return accesses.map((access: string) => `${moduleName}.${access}`);
  });

  return allAccesses.reduce(
    (acc, perm) => {
      acc[perm] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );
}

/**
 * Login — POST credentials directly to the RBAC service.
 */
export async function login(email: string, password: string) {
  const response = await backendRequest({
    apiHost: ApiHost.RBACService,
    resource: ApiResources.AuthToken,
    method: HttpMethod.POST,
    isAuthenticated: false,
    data: { username: email, password },
  });

  const data = response.data;
  if (!data?.accessToken) {
    throw new Error('Invalid credentials');
  }

  data.name = data.name || 'DZOne';

  // Flatten modules → permissions object
  const permissionsObject = flattenPermissions(data.modules || []);

  // Pick user identity fields
  const user = pick(data, [
    'name',
    'email',
    'userId',
    'username',
    'firstName',
    'lastName',
  ]);

  // Populate stores
  useTokenStore.getState().setToken(data.accessToken);

  useAuthStore.getState().setAuth({
    user,
    roles: data.roles || [],
    tenantCode: data.tenantCode || [],
    isDzoneUser: data.isDzoneUser || false,
    tenantType: data.type || '',
    modules: permissionsObject,
    moduleAccessList: data.modules || [],
  });

  usePermissionsStore.getState().setAccesses(permissionsObject);
  usePermissionsStore.getState().setModules(data.modules || []);

  return data;
}

/**
 * Logout — call RBAC logout endpoint then clear all client-side state.
 */
export async function logout() {
  try {
    await backendRequest({
      apiHost: ApiHost.RBACService,
      resource: ApiResources.AuthLogout,
      method: HttpMethod.POST,
      isAuthenticated: true,
    });
  } catch {
    // Best-effort — clear state regardless
  }

  useAuthStore.getState().clear();
  useTokenStore.getState().clearToken();
  usePermissionsStore.getState().clearPermissions();
}
