import React, { FC } from 'react';
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { BreadCrumbContainer } from './breadcrumb-container';
import { Flex } from '@/uicomponents/layout';
import { FormContainer } from './form-container';
import { Hideable } from '@/components/shared/hideable';
import { AiCampaignCreate } from './ai-campaign-create';
import { HasPermission } from '@/components/auth/has-permission';
import { DzentActionsEnum } from '@/lib/enums/permissions';
import { useCampaignDetailQuery } from '../hooks/use-campaign-detail-query';

interface ICreateCampaignFormProps {
  campaignUUId?: string;
  tenantCode?: string[] | null;
  userDetails?: any;
  isDzoneUser?: boolean;
}

export const CreateCampaignForm: FC<ICreateCampaignFormProps> = ({
  campaignUUId,
  tenantCode,
  userDetails,
  isDzoneUser,
}) => {
  const { data: campaignResponse } = useCampaignDetailQuery(campaignUUId ?? '', false);
  const campaignData = campaignResponse?.data ?? null;

  return (
    <>
      <DzScrollContainer vertical scoll='outside'>
        <DzScrollContainer.Sticky>
          <BreadCrumbContainer campaignId={campaignData?.campaignId} id={campaignUUId} />
        </DzScrollContainer.Sticky>
        <DzScrollContainer.Scroll>
          <Flex
            vertical
            gap='0.5rem'
            style={{
              padding: '0.5rem',
              position: 'relative',
              paddingBottom: '0rem',
              height: '100%',
            }}
          >
            <DzBox dzOneBox>
              <Flex vertical gap='0.75rem'>
                <FormContainer
                  campaignData={campaignData}
                  campaignUUId={campaignUUId}
                  tenantCode={tenantCode}
                  userId={userDetails?.userId}
                  isDzoneUser={isDzoneUser}
                />
              </Flex>
            </DzBox>
          </Flex>
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
      <Hideable show={!campaignUUId}>
        <HasPermission permissions={DzentActionsEnum.View}>
          <AiCampaignCreate />
        </HasPermission>
      </Hideable>
    </>
  );
};
