// Do not change default export

import { config } from './should-validate-path';

const isAuthorizedPage = (parent: string, path: string, moduleAccess: Record<string, boolean>) => {
  const pages = config[parent] || [];
  if (!pages.length) {
    return false;
  }

  const page = pages.find((page) => {
    if (page.url) {
      return page.url === path;
    } else if (page.urlRegexp) {
      return page.urlRegexp.test(path) && moduleAccess[page.action];
    }
  });

  if (page) {
    return moduleAccess[page.action];
  }

  return false;
};

export default isAuthorizedPage;
