import { IUser } from '@/app/(dashboard)/ums/users/lib/types';
import { RestrictedAccessKeys } from '@/lib/enums';
import { useRestrictedAccess } from '@/lib/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useLineItemFilterOptionsQuery } from '../../hooks/use-line-item-filter-options-query';
import { LineItemFields } from '../enums';

export function useLineItemFilterOptions(hasFilters?: boolean, assignedTo?: string) {
  const [options, setOptions] = useState({
    isReady: false,
    dynamicFilters: {},
    hiddenColumns: [] as LineItemFields[],
  });

  const [userId, setUserId] = useState<string | null>(null);

  const { data: filterOptionsData } = useLineItemFilterOptionsQuery(hasFilters === true);

  const isCplColumnHidden = useRestrictedAccess(RestrictedAccessKeys.CplColumnInLineItemList);

  const dynamicFilters = useMemo(() => {
    if (!filterOptionsData) return {};
    const { statuses, assignedUsers } = filterOptionsData;
    return {
      [LineItemFields.Status]: {
        isDynamicOptions: true,
        filters: statuses,
      },
      [LineItemFields.AssignedTo]: {
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
    if (isCplColumnHidden) {
      setOptions((prev) => ({
        ...prev,
        hiddenColumns: [LineItemFields.TargetCostPerLead],
      }));
    }
  }, [isCplColumnHidden]);

  useEffect(() => {
    if (hasFilters === false) {
      setOptions((prev) => ({ ...prev, isReady: true, dynamicFilters: {} }));
    }
  }, [hasFilters]);

  useEffect(() => {
    if (userId) {
      const currentUser = dynamicFilters?.[LineItemFields.AssignedTo]?.filters?.find(
        (user: any) => user.value === userId,
      );
      setOptions((prev) => ({
        ...prev,
        isReady: !!filterOptionsData || hasFilters === false,
        dynamicFilters: {
          ...dynamicFilters,
          [LineItemFields.AssignedTo]: {
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
