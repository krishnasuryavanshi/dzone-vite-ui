/**
 * Shim for `next-auth` and `@app/auth-options`.
 * Provides getServerSession that reads from Zustand (client-side),
 * plus type exports for compatibility.
 */
import { useAuthStore, useTokenStore } from '../auth/stores';

// Re-export everything from the react shim too
export { useSession, signIn, signOut, getSession, SessionProvider } from './next-auth-react';

export interface AuthOptions {
  pages?: { signIn?: string };
  providers?: any[];
  callbacks?: any;
  secret?: string;
  session?: any;
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

/**
 * Client-side equivalent of getServerSession.
 * Reads from Zustand stores instead of server session.
 */
export async function getServerSession(_authOptions?: any) {
  const auth = useAuthStore.getState();
  const token = useTokenStore.getState();

  if (!auth.isAuthenticated || !auth.user) return null;

  return {
    accessToken: token.accessToken || '',
    apiUrl: import.meta.env.VITE_API_URL || '',
    roles: auth.roles || [],
    tenantCode: auth.tenantCode || [],
    isDzoneUser: auth.isDzoneUser || false,
    user: auth.user,
    tenantType: auth.tenantType || '',
    modules: auth.modules || {},
    moduleAccessList: auth.moduleAccessList || [],
    permissions: [],
    error: '',
  };
}

// Default export (for @app/auth-options import)
const authOptions: AuthOptions = {
  pages: { signIn: '/login' },
};

export default authOptions;

// CredentialsProvider stub for files that import it
export function CredentialsProvider(_config: any) {
  return _config;
}
