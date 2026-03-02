import { FC } from 'react';
import { ShowLineItems } from './show-line-items';
import { FilesContainer } from './files-container';
import { ShowCampaignTabsType } from '../lib/enums';
import { LineItemContextProvider } from '../../line-items/contexts';

interface IShowCampaignTabs {
  activeKey: string;
  campaignId: string;
  campaignUuId: string;
}

export const ShowCampaignTabsContent: FC<IShowCampaignTabs> = ({
  activeKey,
  campaignUuId,
  campaignId,
}) => {
  return (
    <LineItemContextProvider>
      <ShowLineItems
        campaignId={campaignId}
        show={activeKey === ShowCampaignTabsType.LineItems}
        campaignUuId={campaignUuId}
      />
      <FilesContainer show={activeKey === ShowCampaignTabsType.Files} />
    </LineItemContextProvider>
  );
};
