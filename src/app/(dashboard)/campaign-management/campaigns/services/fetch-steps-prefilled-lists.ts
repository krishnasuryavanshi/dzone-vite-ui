import { BackendResources } from '@/lib/enums';
import { nextBackendRequest } from '@/services/backend-request';

export const fetchStepsPrefilledSteps = async (lookupKey: string) => {
  try {
    return nextBackendRequest({
      resource: BackendResources.StepsPrefilledListsForCampaign,
      params: { lookupKey },
    });
  } catch (error) {}
};
