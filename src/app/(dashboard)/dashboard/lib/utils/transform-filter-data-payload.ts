import { IDateRange } from './calculate-date-range';

interface SelectedFilters {
  selectedCampaigns: { campaignId: string }[];
  selectedLineItems: { lineItemId: string; campaignId: string }[];
}

interface LineItem {
  uuid: string;
}

interface Campaign {
  uuid: string;
  lineItems: LineItem[];
}

interface Campaign {
  uuid: string;
  lineItems: LineItem[];
}

export interface IFilterDataList extends Campaign {}

export interface IFilterDataPayload {
  range: IDateRange;
  campaigns: Campaign[];
}

export interface IExecutiveFilterDataPayload {
  unit?: string;
  timeframe?: string;
}

export const transformFilterDataPayload = (
  data: SelectedFilters,
): Campaign[] => {
  const campaignsMap: { [key: string]: Campaign } = {};

  // Create a map for campaigns
  data.selectedCampaigns.forEach((campaign) => {
    campaignsMap[campaign.campaignId] = {
      uuid: campaign.campaignId,
      lineItems: [],
    };
  });

  // Organize line items under the correct campaign
  data.selectedLineItems.forEach((lineItem) => {
    const campaign = campaignsMap[lineItem.campaignId];
    if (campaign) {
      campaign.lineItems.push({ uuid: lineItem.lineItemId });
    }
  });

  // Convert the campaigns map to an array
  return Object.values(campaignsMap);
};
