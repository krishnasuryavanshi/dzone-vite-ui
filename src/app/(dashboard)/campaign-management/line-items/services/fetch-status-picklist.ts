import { BackendResources } from '@/lib/enums';
import { StatusPicklistData } from '@/public/mock/status-picklist';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchStatusPicklist = async () => {
  try {
    const resource = BackendResources.StatusPicklist;

    if (!resource) {
      return {
        data: {
          data: StatusPicklistData,
          message: 'Status picklist data fetched successfully',
        },
      };
    }

    const { data } = await nextBackendRequest({
      resource,
    });

    return { data };
  } catch (error) {
    return { isError: true, error };
  }
};
