import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchValidationTemplates = async (orgCode: string) => {
  try {
    const data = await nextBackendRequest({
      resource: BackendResources.ValidationTemplates,
      params: { orgCode },
    });
    return data;
  } catch (error) {
    return { isError: true, error };
  }
};
