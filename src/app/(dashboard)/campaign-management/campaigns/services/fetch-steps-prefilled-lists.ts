import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { nextBackendRequest } from '@/services/backend-request';
import { LineItemPicklistMappings } from '../../line-items/lib/enums';

const StepsPrefilledListResources: Record<string, ApiResources> = {
  goals: ApiResources.CampaignsLookupGoals,
  delivery: ApiResources.CampaignsLookupDelivery,
};

export const fetchStepsPrefilledSteps = async (lookupKey: string) => {
  try {
    const resource = StepsPrefilledListResources[lookupKey];

    if (!resource) {
      return { data: {} };
    }

    const stepFetch = await nextBackendRequest({
      resource,
      apiHost: ApiHost.CampaignService,
    });

    if (lookupKey === 'delivery') {
      const [deliveryDaysFetch, deliveryMethodsFetch] = await Promise.all([
        nextBackendRequest({
          resource: ApiResources.Lookups,
          apiHost: ApiHost.CampaignService,
          params: { source: LineItemPicklistMappings.DeliveryDays },
        }),
        nextBackendRequest({
          resource: ApiResources.Lookups,
          apiHost: ApiHost.CampaignService,
          params: { source: LineItemPicklistMappings.DeliveryMethods },
        }),
      ]);

      return {
        data: {
          ...stepFetch.data,
          deliveryDays: deliveryDaysFetch.data || [],
          deliveryMethod: deliveryMethodsFetch.data || [],
        },
        message: stepFetch.message,
      };
    }

    return stepFetch;
  } catch (error) {}
};
