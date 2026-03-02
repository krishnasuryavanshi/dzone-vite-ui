import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const fetchFilterOptions = async (url: string): Promise<string[]> => {
  try {
    const data = await nextBackendRequest({
      method: HttpMethod.GET,
      resource: BackendResources.LeadFilterOptions,
      params: {
        url,
      },
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
