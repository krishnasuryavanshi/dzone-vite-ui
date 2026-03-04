import { OptionsKeys } from '@/lib/enums/options-keys.enum';
import { getOptions } from '../lib/utils';
import { fetchStepsPrefilledSteps } from './fetch-steps-prefilled-lists';
import { fetchOrganizationsByType } from '@/app/(dashboard)/(system-admin)/organizations/services';

export const prefilledLists = async (userId?: string) => {
  const lists: Record<OptionsKeys, any[]> = {} as Record<OptionsKeys, any[]>;

  const orgResponse = await fetchOrganizationsByType('Marketer', userId);
  const marketerList =
    orgResponse?.data?.map(({ id, name: label, code }: any) => ({
      label,
      value: code,
      tenantCode: code,
      id,
    })) || [];
  lists[OptionsKeys.Marketers] = marketerList;

  const goalsResponse = await fetchStepsPrefilledSteps('goals');
  lists[OptionsKeys.CampaignGoals] = getOptions(goalsResponse?.data?.campaignGoals);

  const step4Response = await fetchStepsPrefilledSteps('delivery');
  lists[OptionsKeys.InvoicingTerm] = getOptions(step4Response?.data?.invoicingTerm);
  lists[OptionsKeys.PaymentTerm] = getOptions(step4Response?.data?.paymentTerm);
  lists[OptionsKeys.DeliveryMethod] = getOptions(step4Response?.data?.deliveryMethod);
  lists[OptionsKeys.DeliveryDays] = getOptions(step4Response?.data?.deliveryDays);

  return lists;
};
