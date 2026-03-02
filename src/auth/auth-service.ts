/**
 * Client-side auth service.
 * Uses NextAuth endpoints through the Vite proxy so session cookies are set
 * automatically — the Next.js BFF works unchanged.
 */
import { useAuthStore, useTokenStore } from './stores';
import { usePermissionsStore } from '../stores/permissions-store';

/**
 * Login — authenticate through NextAuth on the Next.js backend (via proxy).
 * 1. Fetch CSRF token
 * 2. POST credentials to NextAuth callback
 * 3. Fetch the session to populate Zustand stores
 */
export async function login(email: string, password: string) {
  // 1. Get CSRF token from NextAuth
  const csrfRes = await fetch('/api/auth/csrf', { credentials: 'include' });
  if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');
  const { csrfToken } = await csrfRes.json();

  // 2. Sign in via NextAuth credentials provider
  const signInRes = await fetch('/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      email,
      password,
      csrfToken,
      json: 'true',
    }),
    credentials: 'include',
    redirect: 'manual', // Don't follow redirects — we handle it ourselves
  });

  // NextAuth returns 302 on success (redirect to callbackUrl)
  // or 200 with error on failure
  if (signInRes.status === 200) {
    const body = await signInRes.text();
    // Check if it's an error response (NextAuth returns a page with error param)
    if (body.includes('error') && !body.includes('"url"')) {
      throw new Error('Invalid credentials');
    }
  }

  // 3. Fetch the session — cookie was set by the signIn response
  const sessionRes = await fetch('/api/auth/session', {
    credentials: 'include',
  });
  if (!sessionRes.ok) throw new Error('Failed to fetch session');
  const session = await sessionRes.json();

  if (!session?.user) {
    throw new Error('Invalid credentials');
  }

  // 4. Store session data in Zustand stores (for UI access)
  useTokenStore.getState().setToken(session.accessToken || '', session.apiUrl);

  useAuthStore.getState().setAuth({
    user: session.user,
    roles: session.roles || [],
    tenantCode: session.tenantCode || [],
    isDzoneUser: session.isDzoneUser || false,
    tenantType: session.tenantType || '',
    modules: session.modules || {},
    moduleAccessList: session.moduleAccessList || [],
  });

  usePermissionsStore.getState().setAccesses(session.modules || {});
  usePermissionsStore.getState().setModules(session.moduleAccessList || []);

  return session;
}

/**
 * Logout — sign out via NextAuth then clear client-side state.
 */
export async function logout() {
  try {
    // Get CSRF token for signOut
    const csrfRes = await fetch('/api/auth/csrf', { credentials: 'include' });
    const { csrfToken } = await csrfRes.json();

    // Call NextAuth signOut endpoint to clear the session cookie
    await fetch('/api/auth/signout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ csrfToken }),
      credentials: 'include',
      redirect: 'manual',
    });
  } catch {
    // Best-effort — clear state regardless
  }

  useAuthStore.getState().clear();
  useTokenStore.getState().clearToken();
  usePermissionsStore.getState().clearPermissions();
}
