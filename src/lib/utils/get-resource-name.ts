import { ICustomResource } from '../types';
import { IResourceItem } from '../types/resource.types';

const isMatchingUrl = (url: string, pattern: string): boolean => {
  const regexPattern = pattern.replace(/:[^\s/]+/g, '([\\w-]+)');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(url);
};

const isMatchingResourceUrls = (
  url: string,
  matchers: string[]
): string | null => {
  for (const pattern of matchers) {
    if (isMatchingUrl(url, pattern)) {
      return pattern;
    }
  }
  return null;
};

export const getResourceName = (
  url: string,
  customResources: ICustomResource[],
  resources?: IResourceItem[]
) => {
  // 1. Check custom resources first (edit/create pages)
  for (const resource of customResources) {
    if (isMatchingResourceUrls(url, resource.urls)) {
      return resource.name;
    }
  }

  // 2. Check standard resource list/show URLs
  if (resources) {
    for (const resource of resources) {
      if (resource.list && isMatchingUrl(url, resource.list as string)) {
        return resource.name;
      }
      if (resource.show && isMatchingUrl(url, resource.show as string)) {
        return resource.name;
      }
    }
  }

  return null;
};
