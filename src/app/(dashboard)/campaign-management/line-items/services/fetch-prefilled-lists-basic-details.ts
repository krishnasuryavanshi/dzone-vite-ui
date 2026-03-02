import { OptionsKeys } from '@/lib/enums';
import { getOptions } from '../../campaigns/lib/utils';
import { LineItemPicklistMappings } from '../lib/enums';
import { fetchLineItemFormPicklists } from './fetch-line-item-form-picklists';
import { fetchOrganizationsByType } from '@/app/(dashboard)/(system-admin)/organizations/services';

export const fetchPrefilledListsBasicDetails = async (userId?: string) => {
  let lists: Record<OptionsKeys, any[]> = {} as Record<OptionsKeys, any[]>;

  const { data: marketerData } = await fetchOrganizationsByType(
    'Marketer',
    userId,
  );
  let marketerList = marketerData?.map(({ id, name: label, code }: any) => ({
    label,
    value: code,
    tenantCode: code,
    id,
  }));
  lists[OptionsKeys.Marketers] = marketerList;
  lists[OptionsKeys.Products] = await fetchListByPicklistType(
    LineItemPicklistMappings.Products,
  );
  lists[OptionsKeys.DeliveryDays] = await fetchListByPicklistType(
    LineItemPicklistMappings.DeliveryDays,
  );
  lists[OptionsKeys.DeliveryMethod] = await fetchListByPicklistType(
    LineItemPicklistMappings.DeliveryMethods,
  );
  lists[OptionsKeys.Pacing] = await fetchListByPicklistType(
    LineItemPicklistMappings.Pacing,
  );
  lists[OptionsKeys.PacingSchedules] = await fetchListByPicklistType(
    LineItemPicklistMappings.PacingSchedules,
  );
  return lists;
};

const fetchListByPicklistType = async (
  picklistType: LineItemPicklistMappings,
  childrenKey?: string,
): Promise<any> => {
  const { data } = await fetchLineItemFormPicklists(picklistType);

  return getOptions(data, childrenKey);
};
