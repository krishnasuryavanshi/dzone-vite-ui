/**
 * Shim for `next/dist/shared/lib/app-router-context.shared-runtime`.
 * Provides AppRouterInstance type compatible with our useRouter shim.
 */

export interface AppRouterInstance {
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: (url: string) => void;
  pathname: string;
}
