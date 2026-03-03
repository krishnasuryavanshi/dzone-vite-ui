import { Filters } from '@/lib/utils/table';
import { ICampaign } from '@/app/(dashboard)/campaign-management/campaigns/lib/types';
import { ILineItem } from '@/app/(dashboard)/campaign-management/line-items/lib/types';

export const queryKeys = {
  campaigns: {
    all: ['campaigns'] as const,
    lists: () => [...queryKeys.campaigns.all, 'list'] as const,
    list: (params: { page: number; size: number; filters?: Filters<ICampaign> }) =>
      [...queryKeys.campaigns.lists(), params] as const,
    details: () => [...queryKeys.campaigns.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.campaigns.details(), id] as const,
    statuses: () => [...queryKeys.campaigns.all, 'statuses'] as const,
  },
  lineItems: {
    all: ['lineItems'] as const,
    lists: () => [...queryKeys.lineItems.all, 'list'] as const,
    list: (params: { page: number; size: number; campaignId?: string; filters?: Filters<ILineItem> }) =>
      [...queryKeys.lineItems.lists(), params] as const,
    details: () => [...queryKeys.lineItems.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.lineItems.details(), id] as const,
    statuses: () => [...queryKeys.lineItems.all, 'statuses'] as const,
  },
  // Future modules: leads, users, roles, organizations, etc.
};
