import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const validateUserEmail = async (email: string) => {
  return await nextBackendRequest({
    resource: BackendResources.ValidateUser,
    isAuthenticated: false,
    method: HttpMethod.POST,
    data: {
      email,
    },
  });
};
