import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { authenticatedRequest } from '@/services';

export async function submitFeedback(requestData: DzRecord) {
  try {
    return authenticatedRequest({
      resource: ApiResources.AiAgentFeedback,
      apiHost: ApiHost.PlatformService,
      method: HttpMethod.POST,
      data: requestData,
    });
  } catch (error) {
    throw new Error(`Failed to submit feedback: ${error}`);
  }
}
