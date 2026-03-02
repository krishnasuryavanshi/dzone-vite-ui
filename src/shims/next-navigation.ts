/**
 * Shim for `next/navigation`.
 * Maps Next.js navigation hooks to React Router equivalents.
 */
import {
  useNavigate,
  useLocation,
  useSearchParams as useRRSearchParams,
  useParams as useRRParams,
} from 'react-router-dom';
import { useMemo } from 'react';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return useMemo(
    () => ({
      push: (url: string) => navigate(url),
      replace: (url: string) => navigate(url, { replace: true }),
      back: () => navigate(-1),
      forward: () => navigate(1),
      refresh: () => navigate(0),
      pathname: location.pathname,
      prefetch: (_url: string) => {
        /* no-op */
      },
    }),
    [navigate, location.pathname],
  );
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useSearchParams() {
  const [searchParams] = useRRSearchParams();
  return searchParams;
}

export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useRRParams() as T;
}

export function redirect(url: string) {
  window.location.href = url;
}

export function notFound() {
  throw new Response('Not Found', { status: 404 });
}

// Re-export ReadonlyURLSearchParams type for compatibility
export type ReadonlyURLSearchParams = URLSearchParams;
