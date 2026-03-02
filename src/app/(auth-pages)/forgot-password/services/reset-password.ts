import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services';

export const resetPassword = async (email: string) => {
  const data = await nextBackendRequest({
    resource: BackendResources.ResetPassword,
    isAuthenticated: false,
    method: HttpMethod.PATCH,
    data: {
      email,
    },
  });
  return data;
};
