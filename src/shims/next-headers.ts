/**
 * Shim for `next/headers`.
 * Client-side implementation reads from document.cookie.
 */

function parseCookies(): Map<string, string> {
  const map = new Map<string, string>();
  if (typeof document === 'undefined') return map;
  document.cookie.split(';').forEach((c) => {
    const [key, ...val] = c.split('=');
    if (key) map.set(key.trim(), val.join('=').trim());
  });
  return map;
}

export function cookies() {
  const cookieMap = parseCookies();
  return {
    get: (name: string) => {
      const value = cookieMap.get(name);
      return value ? { name, value } : undefined;
    },
    getAll: () =>
      Array.from(cookieMap.entries()).map(([name, value]) => ({ name, value })),
    has: (name: string) => cookieMap.has(name),
    set: () => {
      /* no-op in client shim */
    },
    delete: () => {
      /* no-op in client shim */
    },
  };
}

export function headers() {
  return new Headers();
}
