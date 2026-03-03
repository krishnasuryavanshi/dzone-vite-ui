import { ApiResources } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';
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

    const stepFetch = await authenticatedRequest({
      resource,
      apiHost: ApiHost.CampaignService,
    });

    if (lookupKey === 'delivery') {
      const [deliveryDaysFetch, deliveryMethodsFetch] = await Promise.all([
        authenticatedRequest({
          resource: ApiResources.Lookups,
          apiHost: ApiHost.CampaignService,
          params: { source: LineItemPicklistMappings.DeliveryDays },
        }),
        authenticatedRequest({
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
