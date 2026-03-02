import { OptionsKeys } from '@/lib/enums';
import { getOptions } from '../../campaigns/lib/utils';
import { LineItemPicklistMappings, LineItemSteps } from '../lib/enums';
import { fetchLineItemFormPicklists } from './fetch-line-item-form-picklists';
import { fetchOrganizationsByType } from '@/app/(dashboard)/(system-admin)/organizations/services';

export const fetchPrefilledListsByStep = async (
  step: LineItemSteps,
  userId?: string,
) => {
  let lists: Record<OptionsKeys, any[]> = {} as Record<OptionsKeys, any[]>;
  switch (step) {
    case LineItemSteps.BasicDetails: {
      const { data } = await fetchOrganizationsByType('Marketer', userId);
      let marketerList = data?.map(({ id, name: label, code }: any) => ({
        label,
        value: code,
        tenantCode: code,
        id,
      }));
      lists[OptionsKeys.Marketers] = marketerList;
      break;
    }
    case LineItemSteps.Goals: {
      lists[OptionsKeys.Products] = await fetchListByPicklistType(
        LineItemPicklistMappings.Products,
      );
      break;
    }
    case LineItemSteps.DeliveryAndPacing: {
      lists[OptionsKeys.DeliveryDays] = await fetchListByPicklistType(
        LineItemPicklistMappings.DeliveryDays,
      );
      lists[OptionsKeys.DeliveryMethod] = await fetchListByPicklistType(
        LineItemPicklistMappings.DeliveryMethods,
      );
      lists[OptionsKeys.Pacing] = await fetchListByPicklistType(
        LineItemPicklistMappings.Pacing,
      );
      break;
    }
    case LineItemSteps.Targeting: {
      lists[OptionsKeys.JobFunctions] = await fetchListByPicklistType(
        LineItemPicklistMappings.JobFunctions,
      );
      lists[OptionsKeys.JobLevels] = await fetchListByPicklistType(
        LineItemPicklistMappings.JobLevels,
      );
      lists[OptionsKeys.CompanySizesEmployeeCount] =
        await fetchListByPicklistType(
          LineItemPicklistMappings.CompanySizesByEmployeeCount,
        );
      lists[OptionsKeys.CompanySizesRevenue] = await fetchListByPicklistType(
        LineItemPicklistMappings.CompanySizesByRevenue,
      );
      lists[OptionsKeys.Industries] = await fetchListByPicklistType(
        LineItemPicklistMappings.Industries,
        'industries',
      );
      lists[OptionsKeys.GeographyByCountry] = await fetchListByPicklistType(
        LineItemPicklistMappings.Countries,
      );
      lists[OptionsKeys.GeographyByRegion] = await fetchListByPicklistType(
        LineItemPicklistMappings.Regions,
      );
      break;
    }
  }
  return lists;
};

const fetchListByPicklistType = async (
  picklistType: LineItemPicklistMappings,
  childrenKey?: string,
): Promise<any> => {
  const { data } = await fetchLineItemFormPicklists(picklistType);

  return getOptions(data, childrenKey);
};
