import { ApiResources, HttpMethod } from '@/lib/enums';
import { ApiHost } from '@/lib/constants';
import { authenticatedRequest } from '@/services/backend-request';

export const fetchRecommendations = async (type: string, value: string) => {
  try {
    const data = await authenticatedRequest({
      resource: ApiResources.JobTitleRecommendations,
      apiHost: ApiHost.RecommendationService,
      method: HttpMethod.POST,
      params: { [type]: value },
    });

    if (!data.length) return null;

    const jtRecommendations = {
      name: value,
      children: data.map((job_title: string) => ({
        label: job_title,
        value: `${job_title}###${value}`,
      })),
    };

    return jtRecommendations;
  } catch (error) {}
};
