import { resources } from '@/config/resources';
import { checkPermission } from './check-permission';

export function getFirstAllowedRoute(accesses: Record<string, boolean>): string {
  for (const resource of resources) {
    if (resource.list && resource.meta?.permissions) {
      if (checkPermission(resource.meta.permissions, accesses)) {
        return resource.list as string;
      }
    }
  }
  return '/unauthorized';
}
