import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
import { ITransformAndExportLeads } from '../lib/types';

export const transformAndExportLeads = async (
  requestPayload: ITransformAndExportLeads,
) => {
  try {
    const response = await authenticatedRequest({
      resource: ApiResources.TransformAndExportLeads,
      apiHost: ApiHost.TransformationService,
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
