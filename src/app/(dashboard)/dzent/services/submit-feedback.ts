import { BackendResources, HttpMethod } from '@/lib/enums';
import { DzRecord } from '@/lib/types';
import { nextBackendRequest } from '@/services';

export async function submitFeedback(requestData: DzRecord) {
  try {
    return nextBackendRequest({
      resource: BackendResources.DzentAgentMessageFeedback,
      method: HttpMethod.POST,
      data: requestData,
    });
  } catch (error) {
    throw new Error(`Failed to submit feedback: ${error}`);
  }
}
