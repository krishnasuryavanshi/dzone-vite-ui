import { Translate } from '@/components/i18n';
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { TabsProps } from '@/lib/types/uicomponents';
import { Tabs } from '@/uicomponents/tabs';
import React, { FC, useState } from 'react';
import { ShowCampaignTabsContent } from './show-campaign-tabs-content';
import { ShowCampaignTabsType } from '../lib/enums';
import { LineItemActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';

interface IShowCampaignTabsProps {
  campaignId: string;
  campaignUuId: string;
}

export const ShowCampaignTabs: FC<IShowCampaignTabsProps> = ({ campaignId, campaignUuId }) => {
  const isLineItemViewAllowed = usePermissionCheck(LineItemActionsEnum.View);
  const [activeTab, setActiveTab] = useState<string>(
    isLineItemViewAllowed ? ShowCampaignTabsType.LineItems : ShowCampaignTabsType.Files,
  );
  const items: TabsProps['items'] = [
    isLineItemViewAllowed && {
      key: ShowCampaignTabsType.LineItems,
      label: <Translate i18nKey='Line Items' />,
    },
    {
      key: ShowCampaignTabsType.Files,
      label: <Translate i18nKey='Files' />,
    },
  ].filter(Boolean) as TabsProps['items'];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <DzScrollContainer vertical scoll='outside'>
      <DzScrollContainer.Sticky>
        <DzBox
          dzOneBox
          style={{
            boxShadow: '4px 4px 10px 0 rgba(0, 0, 0, 0.06)',
            borderRadius: '0.5rem',
          }}
        >
          <Tabs activeKey={activeTab} onChange={handleTabChange} items={items} />
        </DzBox>
      </DzScrollContainer.Sticky>
      <ShowCampaignTabsContent
        activeKey={activeTab}
        campaignId={campaignId}
        campaignUuId={campaignUuId}
      />
    </DzScrollContainer>
  );
};
