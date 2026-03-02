import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchAllUsers = async () => {
  try {
    const users = await nextBackendRequest({
      resource: BackendResources.AllUsers,
    });
    return users.data.map((status: any) => {
      return {
        text: `${status.firstName} ${status.lastName}`,
        value: status.id,
      };
    });
  } catch (error) {}
};
