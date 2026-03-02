import { HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services';

const getApiHostFromUrl = (path: string): string => {
  if (path.includes('common-service')) return ApiHost.CommonService;
  if (path.includes('campaign-service')) return ApiHost.CampaignService;
  return ApiHost.PlatformService;
};

const getResourceFromUrl = (path: string): string => {
  return path
    .replace(/^\/api\//, '')
    .replace(/^(common-service|campaign-service|platform-service)\//, '');
};

export const fetchFilterOptions = async (url: string): Promise<string[]> => {
  try {
    const apiHost = getApiHostFromUrl(url);
    const resource = getResourceFromUrl(url);

    const data = await nextBackendRequest({
      method: HttpMethod.GET,
      resource,
      apiHost,
    });

    if (Array.isArray(data)) {
      return data.map((item) => {
        if (typeof item === 'string') {
          return item;
        }
        return (
          item.label || item.name || item.value || item.title || String(item)
        );
      });
    }

    if (data?.data && Array.isArray(data.data)) {
      return data.data.map((item: any) => {
        if (typeof item === 'string') {
          return item;
        }
        return (
          item.label || item.name || item.value || item.title || String(item)
        );
      });
    }

    return [];
  } catch (error) {
    return [];
  }
};
