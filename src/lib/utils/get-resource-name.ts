import { ICustomResource } from '../types';

const isMatchingResourceUrls = (
  url: string,
  matchers: string[]
): string | null => {
  for (const pattern of matchers) {
    // Convert the pattern to a regular expression
    const regexPattern = pattern.replace(/:[^\s/]+/g, '([\\w-]+)');
    const regex = new RegExp(`^${regexPattern}$`);

    // Check if the URL matches the pattern
    if (regex.test(url)) {
      return pattern;
    }
  }
  return null;
};

export const getResourceName = (
  url: string,
  customResources: ICustomResource[]
) => {
  for (const resource of customResources) {
    if (isMatchingResourceUrls(url, resource.urls)) {
      return resource.name;
    }
  }
  return null;
};
