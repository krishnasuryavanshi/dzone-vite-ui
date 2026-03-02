/**
 * Replacement session-token-accessor for Vite app.
 * Reads from Zustand stores instead of server session.
 */
import { useTokenStore, useAuthStore } from '../../../auth/stores';
import { pick } from 'lodash';

export async function getAccessToken() {
  return useTokenStore.getState().accessToken;
}

export async function getUserProfile() {
  const user = useAuthStore.getState().user;
  if (user) {
    return pick(user, ['name', 'email', 'userId', 'emailId', 'username']);
  }
  return null;
}

export async function getUserRoleIds() {
  const roles = useAuthStore.getState().roles;
  if (roles?.length) {
    const roleIdsArray = roles.map((role: { id: string }) => role.id);
    return roleIdsArray.join(',');
  }
  return '';
}
