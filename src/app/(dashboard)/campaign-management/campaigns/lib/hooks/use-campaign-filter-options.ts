import { IUser } from '@/app/(dashboard)/ums/users/lib/types';
import { RestrictedAccessKeys } from '@/lib/enums';
import { useRestrictedAccess } from '@/lib/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useCampaignFilterOptionsQuery } from '../../hooks/use-campaign-filter-options-query';
import { CampaignField } from '../enums';

export function useCampaignFilterOptions(hasFilters?: boolean, assignedTo?: string) {
  const [options, setOptions] = useState({
    isReady: false,
    dynamicFilters: {},
    hiddenColumns: [] as CampaignField[],
  });

  const [userId, setUserId] = useState<string | null>(null);

  const { data: filterOptionsData } = useCampaignFilterOptionsQuery(hasFilters === true);

  const isIONumberColumnHidden = useRestrictedAccess(
    RestrictedAccessKeys.IONumberColumnInCampaignList,
  );

  const dynamicFilters = useMemo(() => {
    if (!filterOptionsData) return {};
    const { statuses, assignedUsers } = filterOptionsData;
    return {
      [CampaignField.Status]: {
        isDynamicOptions: true,
        filters: statuses,
      },
      [CampaignField.AssignedTo]: {
        isDynamicOptions: true,
        filters:
          assignedUsers?.data?.map((user: IUser) => ({
            text: `${user.firstName} ${user.lastName}`,
            value: user.id,
          })) ?? [],
      },
    };
  }, [filterOptionsData]);

  useEffect(() => {
    if (!assignedTo || assignedTo === 'all') {
      setUserId(null);
    } else {
      setUserId(assignedTo);
    }
  }, [assignedTo]);

  useEffect(() => {
    if (isIONumberColumnHidden) {
      setOptions((prev) => ({
        ...prev,
        hiddenColumns: [CampaignField.IoNumber],
      }));
    }
  }, [isIONumberColumnHidden]);

  useEffect(() => {
    if (hasFilters === false) {
      setOptions((prev) => ({ ...prev, isReady: true, dynamicFilters: {} }));
    }
  }, [hasFilters]);

  useEffect(() => {
    if (userId) {
      const currentUser = dynamicFilters?.[CampaignField.AssignedTo]?.filters?.find(
        (user: any) => user.value === userId,
      );
      setOptions((prev) => ({
        ...prev,
        isReady: !!filterOptionsData || hasFilters === false,
        dynamicFilters: {
          ...dynamicFilters,
          [CampaignField.AssignedTo]: {
            isDynamicOptions: true,
            filters: [currentUser],
            isDisabled: true,
          },
        },
      }));
    } else {
      setOptions((prev) => ({
        ...prev,
        isReady: !!filterOptionsData || hasFilters === false,
        dynamicFilters,
      }));
    }
  }, [userId, dynamicFilters, filterOptionsData, hasFilters]);

  return options;
}
