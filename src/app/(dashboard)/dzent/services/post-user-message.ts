import { BackendResources, HttpMethod } from '@/lib/enums';
import { DzRecord } from '@/lib/types';
import { nextBackendRequest } from '@/services';

export async function postUserMessage(requestData: DzRecord) {
  try {
    return nextBackendRequest({
      resource: BackendResources.DzentPostUserMessage,
      method: HttpMethod.POST,
      data: requestData,
    });
  } catch (error) {
    throw new Error(`Failed to post user message: ${error}`);
  }
}
