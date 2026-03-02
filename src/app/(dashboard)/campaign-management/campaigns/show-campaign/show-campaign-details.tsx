import { ICampaign } from '@/app/(dashboard)/campaign-management/campaigns/lib/types';
import { Translate } from '@/components/i18n';
import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { usePathname } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { ShowDetailsSectionFooterAction } from '../../components/show-page';
import { CampaignStep } from '../lib/enums';

interface IShowCampaignDetailsProps {
  campaignDetails?: ICampaign;
}
export const ShowCampaignDetails: FC<IShowCampaignDetailsProps> = ({
  campaignDetails,
}) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [campaignUpdateLink, setCampaignUpdateLink] = useState('');

  useEffect(() => {
    if (campaignDetails) {
      const stepId = campaignDetails.stepId;
      const campaignFormStepCount = Object.keys(CampaignStep).length / 2;
      const updateCampaignLink = `${pathname}/edit?step=${
        stepId < campaignFormStepCount ? stepId : 0
      }`;
      setCampaignUpdateLink(updateCampaignLink);
    }
  }, [campaignDetails]);

  const handleCollapse = (collapsedState: boolean) => {
    setIsCollapsed(collapsedState);
  };

  return (
    <Flex vertical gap='0.75rem'>
      <Text strong style={{ marginBottom: '0' }}>
        <Translate i18nKey='pages.campaigns.label.campaignDetails' />
      </Text>

      <DzBox dzOneBox>
        <ShowDetailsSectionFooterAction
          type='campaign'
          isCollapsed={isCollapsed}
          handleCollapse={handleCollapse}
          updateLink={campaignUpdateLink}
        />
      </DzBox>
    </Flex>
  );
};
