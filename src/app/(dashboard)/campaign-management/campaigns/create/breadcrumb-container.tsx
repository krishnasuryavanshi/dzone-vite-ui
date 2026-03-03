import React, { FC } from 'react';
import { ShowCampaignBreadcrumb } from './show-create-campaign-breadcrumbs';
import { Translate } from '@/components/i18n';
import { Flex } from 'antd';
import { Text } from '@/uicomponents/text';
import { ArrowLeft } from '@/uicomponents/icons/svgs';
import { DZONE_CLR_GRAY_DARK } from '@/lib/constants';
import { Link } from 'react-router-dom';

interface CreateCampaignBreadCrumbContainer {
  campaignId?: string;
  id?: string;
}

export const BreadCrumbContainer: FC<CreateCampaignBreadCrumbContainer> = ({
  campaignId,
  id,
}) => {
  return (
    <Flex
      vertical
      gap='0.5rem'
      style={{ padding: '0.5rem', paddingBottom: '0rem' }}>
      <ShowCampaignBreadcrumb campaignId={campaignId} id={id} />
      <Flex gap='0.5rem' align='center'>
        <Link to='/campaign-management/campaigns'>
          <Flex
            align='center'
            justify='center'
            style={{
              borderRadius: '17px',
              background: DZONE_CLR_GRAY_DARK,
              height: '1.5rem',
              width: '1.5rem',
              cursor: 'pointer',
              paddingTop: '0.25rem',
            }}>
            <ArrowLeft />
          </Flex>
        </Link>
        <Text strong>
          <Translate
            i18nKey={`${campaignId ? 'form.createCampaign.editFormHeader' : 'form.createCampaign.formHeader'}`}
          />
        </Text>
      </Flex>
    </Flex>
  );
};
