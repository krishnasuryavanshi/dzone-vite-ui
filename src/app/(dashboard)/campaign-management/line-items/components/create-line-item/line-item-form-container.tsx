import { FC } from 'react';
import { LineItemBreadCrumbContainer } from './line-item-breadcrumb-container';
import { LineItemFormWrapper } from './line-item-form-wrapper';
import { DzScrollContainer } from '@/components/layout/v1';
import { ICreateLineItemBreadcrumbsProps } from './line-item-breadcrumbs';
import { ICustomRangeDetails } from '../../lib/types';
import { ICampaign } from '../../../campaigns/lib/types';

interface ILineItemFormContainer extends ICreateLineItemBreadcrumbsProps {
  customRangeLimit?: ICustomRangeDetails;
  campaignData?: ICampaign;
  tenantCode?: string | string[];
  userId?: string;
  campaignName?: string;
  isDzoneUser?: boolean;
}

export const LineItemFormContainer: FC<ILineItemFormContainer> = ({
  isDzoneUser,
  id,
  tenantCode,
  lineItemId,
  lineItemDetails,
  customRangeLimit,
  campaignData,
  userId,
}) => {
  return (
    <DzScrollContainer vertical scoll='outside'>
      <DzScrollContainer.Sticky>
        <LineItemBreadCrumbContainer {...{ campaignData, id, lineItemId }} />
      </DzScrollContainer.Sticky>
      <DzScrollContainer.Scroll>
        <LineItemFormWrapper
          campaignUuid={campaignData?.id as string}
          campaignData={campaignData}
          tenantCode={tenantCode}
          lineItemDetails={lineItemDetails}
          customRangeLimit={customRangeLimit!}
          userId={userId}
          isDzoneUser={isDzoneUser}
        />
      </DzScrollContainer.Scroll>
    </DzScrollContainer>
  );
};
