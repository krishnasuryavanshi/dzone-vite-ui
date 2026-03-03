/**
 * Router hook — replaces next/navigation useRouter.
 * Wraps react-router to provide the same API as the Next.js shim.
 */
import { useMemo } from 'react';
import {
  useNavigate,
  useLocation,
  useSearchParams as useRRSearchParams,
  useParams as useRRParams,
} from 'react-router';

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

export type AppRouterInstance = ReturnType<typeof useRouter>;
