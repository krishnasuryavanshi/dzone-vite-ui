import { FC, useEffect } from 'react';
import { ShowLineItems } from './show-line-items';
import { FilesContainer } from './files-container';
import { ShowCampaignTabsType } from '../lib/enums';
import { useLineItemContextStore } from '../../line-items/store/use-line-item-context-store';

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
  const { fetchStatusData, reset } = useLineItemContextStore();

  useEffect(() => {
    fetchStatusData();
    return () => reset();
  }, []);

  return (
    <>
      <ShowLineItems
        campaignId={campaignId}
        show={activeKey === ShowCampaignTabsType.LineItems}
        campaignUuId={campaignUuId}
      />
      <FilesContainer show={activeKey === ShowCampaignTabsType.Files} />
    </>
  );
};
