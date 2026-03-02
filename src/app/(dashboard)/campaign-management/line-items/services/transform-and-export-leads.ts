import { BackendResources, HttpMethod } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';
import { ITransformAndExportLeads } from '../lib/types';

export const transformAndExportLeads = async (
  requestPayload: ITransformAndExportLeads,
) => {
  try {
    const response = await nextBackendRequest({
      resource: BackendResources.TransformAndExportLeads,
      method: HttpMethod.POST,
      includeResponseHeaders: true,
      data: { ...requestPayload },
    });
    return response;
  } catch (error: any) {
    const { message, messageHeader, statusCode } = error?.data?.error;
    if (statusCode === 400 || statusCode === 413) {
      return {
        isError: true,
        error: {
          statusCode,
          messageHeader: messageHeader,
          message: message,
        },
      };
    } else {
      return {
        isError: true,
        error: {
          statusCode,
          message: message,
        },
      };
    }
  }
};
