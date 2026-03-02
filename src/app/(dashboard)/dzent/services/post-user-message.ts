import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { nextBackendRequest } from '@/services';

export async function postUserMessage(requestData: DzRecord) {
  try {
    return nextBackendRequest({
      resource: ApiResources.DzentPostUserMessage,
      apiHost: ApiHost.AICopilotService,
      method: HttpMethod.POST,
      data: requestData,
    });
  } catch (error) {
    throw new Error(`Failed to post user message: ${error}`);
  }
}
