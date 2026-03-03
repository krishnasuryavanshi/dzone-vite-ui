import { ApiHost } from '@/lib/constants';
import { ApiResources } from '@/lib/enums';
import { authenticatedRequest } from '@/services';
import { FilterMenuItemLabel } from '../components/filters-manager/filter-menu-item-label';
import { IFilterCampaign, IFilterLineItem, ILineItem } from '../lib/types';

export async function fetchFilterData() {
  const data = await authenticatedRequest({
    apiHost: ApiHost.CampaignService,
    resource: ApiResources.AllLineItems,
  });

  const lineItems: IFilterLineItem[] = [
    {
      key: 'all',
      label: (
        <FilterMenuItemLabel
          name='pages.lineItems.label.allLineItems'
          id={''}
          all
        />
      ),
    } as IFilterLineItem,
  ];
  const campaigns: Record<string, IFilterCampaign> = {
    all: {
      key: 'all',
      label: (
        <FilterMenuItemLabel
          name='pages.campaigns.label.allCampaigns'
          id={''}
        />
      ),
    } as IFilterCampaign,
  };

  data.data.forEach((item: ILineItem) => {
    const campaign = item.campaign;

    lineItems.push({
      key: item.id,
      label: <FilterMenuItemLabel name={item.name} id={item.lineItemId} />,
      value: item.id,
      lineItemId: item.lineItemId,
      name: item.name,
      campaignId: campaign.id,
    });

    if (!campaigns[campaign.id]) {
      campaigns[campaign.id] = {
        key: campaign.id,
        label: (
          <FilterMenuItemLabel name={campaign.name} id={campaign.campaignId} />
        ),
        value: campaign.id,
        campaignId: campaign.campaignId,
        name: campaign.name,
      };
    }
  });

  const campaignsList = [...Object.values(campaigns)];

  return {
    lineItems,
    campaigns: campaignsList,
  };
}
