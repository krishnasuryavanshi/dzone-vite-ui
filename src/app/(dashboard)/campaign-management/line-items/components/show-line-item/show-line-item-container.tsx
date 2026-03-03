
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { RestrictedAccessKeys } from '@/lib/enums';
import { useRestrictedAccess } from '@/lib/hooks';
import { Flex } from '@/uicomponents/layout';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import BasicDetails from '../../lib/schemas/basic-details.json';
import CustomQuestions from '../../lib/schemas/custom-questions.json';
import { useLineItemContextStore } from '../../store/use-line-item-context-store';
import { LineItemSummaryViewFields } from '../../lib/constants';
import { LineItemFields } from '../../lib/enums';
import { ILineItem } from '../../lib/types';
import { prepareViewData } from '../../lib/utils/prepare-view-data';
import {
  fetchFileDetails,
  fetchLineItem,
  fetchMultipleFileDetails,
} from '../../services';
import { LeadsContainer } from '../leads-container';
import { ShowLineItemBreadcrumb } from './../show-line-item-breadcrumb';
import { ShowLineItemWrapper } from './show-line-item-wrapper';
import { ShowLineItemDetails } from '../show-page/show-line-item-details';
import { IShowItemDetailsProps } from '../../../lib/types';

export interface IShowLineItemContainerProps extends PropsWithChildren {
  lineItemId: string;
  campaignId: string;
  lineItemDetails?: ILineItem;
  sessionTenantCode?: string | string[];
}

export const ShowLineItemContainer: FC<IShowLineItemContainerProps> = ({
  lineItemId,
  campaignId,
  sessionTenantCode,
}) => {
  const { fetchStatusData, reset } = useLineItemContextStore();

  useEffect(() => {
    fetchStatusData();
    return () => reset();
  }, []);

  const isTargetCplRestricted = useRestrictedAccess(
    RestrictedAccessKeys.CplFieldInLineItemDetails,
  );
  const [lineItemDetails, setLineItemDetails] = useState<ILineItem>();
  const [detailsSectionProps, setDetailsSectionProps] =
    useState<IShowItemDetailsProps>({
      pageLabel: 'pages.lineItems.label.lineItemDetails',
      formConfig: [...BasicDetails],
      summaryViewFields: LineItemSummaryViewFields,
      updateUrl: 'edit',
    } as IShowItemDetailsProps);

  useEffect(() => {
    if (lineItemId) {
      fetchLineItemDetails();
    }
  }, [lineItemId]);

  const fetchLineItemDetails = async () => {
    const data = await fetchLineItem(lineItemId);
    let assetFileIds = [];
    if (data?.data?.assetFileIds?.length > 0) {
      const assetFileResponse = await fetchMultipleFileDetails(
        data?.data?.assetFileIds,
      );
      assetFileIds = assetFileResponse?.data;
    }
    let deliveryTemplateDetails = {};
    if (data?.data?.deliveryTemplateId) {
      const deliveryTemplateResponse = await fetchFileDetails(
        data?.data?.deliveryTemplateId,
      );
      deliveryTemplateDetails = deliveryTemplateResponse;
    }
    const viewData = prepareViewData(data?.data, {
      restrictedFields: [
        isTargetCplRestricted && LineItemFields.TargetCostPerLead,
      ],
    });

    const updatedLineItemDetails = {
      ...viewData,
      assetFileIds: assetFileIds,
      deliveryTemplateId: deliveryTemplateDetails,
    };

    setLineItemDetails(updatedLineItemDetails);

    setDetailsSectionProps({
      ...detailsSectionProps,
      itemDetails: updatedLineItemDetails,
    });
  };

  return (
    <>
      <ShowLineItemWrapper
        lineItemId={lineItemId}
        campaignId={campaignId}
        lineItemDetails={lineItemDetails}>
        <DzScrollContainer vertical scoll='outside'>
          <DzScrollContainer.Sticky>
            <Flex vertical style={{ padding: '0.5rem', paddingBottom: '0rem' }}>
              <ShowLineItemBreadcrumb
                {...{
                  campaignId: lineItemDetails?.campaign?.campaignId,
                  lineItemId: lineItemDetails?.lineItemId,
                  campaignUuid: campaignId,
                }}
              />
            </Flex>
          </DzScrollContainer.Sticky>
          <DzScrollContainer.Scroll>
            <Flex vertical style={{ padding: '0.5rem', paddingTop: '0rem' }}>
              <ShowLineItemDetails {...detailsSectionProps} type='lineItem' />
              <LeadsContainer
                lineItemId={lineItemId}
                tenantCode={lineItemDetails?.sourceTenantCode}
                sessionTenantCode={sessionTenantCode}
              />
            </Flex>
          </DzScrollContainer.Scroll>
        </DzScrollContainer>
      </ShowLineItemWrapper>
    </>
  );
};
