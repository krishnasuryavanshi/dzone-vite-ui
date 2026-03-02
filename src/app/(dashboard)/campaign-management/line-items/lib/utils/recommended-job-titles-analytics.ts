import { StorageKey } from '@/lib/enums';
import { Store } from '@/services/local-storage-store';

export const storeRecommendedJobTitlesAnalytics = (
  recommendedJobTitles: Record<string, any>[],
  jtList: Record<string, any>[],
) => {
  Store.set(StorageKey.JobTitleRecommendationAnalytics, {
    recommendedJobTitles,
    jtList,
  });
};

export const getRecommendedJobTitlesAnalytics = () => {
  return Store.get(StorageKey.JobTitleRecommendationAnalytics);
};
