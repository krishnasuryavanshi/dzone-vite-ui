import { DzScrollContainer } from '@/components/layout/v1';
import { RestrictedAccessKeys } from '@/lib/enums';
import { useRestrictedAccess } from '@/lib/hooks';
import { Flex } from '@/uicomponents/layout';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import BasicDetails from '../../lib/schemas/basic-details.json';
import CustomQuestions from '../../lib/schemas/custom-questions.json';
import { useLineItemContextStore } from '../../store/use-line-item-context-store';
import { LineItemSummaryViewFields } from '../../lib/constants';
import { LineItemFields } from '../../lib/enums';
import { ILineItem } from '../../lib/types';
import { useLineItemDetailQuery, useLineItemAdditionalDetailsQuery } from '../../hooks';
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
  const { reset } = useLineItemContextStore();

  useEffect(() => {
    return () => reset();
  }, []);

  const isTargetCplRestricted = useRestrictedAccess(RestrictedAccessKeys.CplFieldInLineItemDetails);

  const restrictedFields: (string | false)[] = useMemo(
    () => [isTargetCplRestricted && LineItemFields.TargetCostPerLead],
    [isTargetCplRestricted],
  );

  const { data: lineItemResponse } = useLineItemDetailQuery(lineItemId);

  const { data: lineItemDetails } = useLineItemAdditionalDetailsQuery(
    lineItemResponse?.data,
    restrictedFields,
    !!lineItemResponse?.data,
  );

  const detailsSectionProps: IShowItemDetailsProps = useMemo(
    () =>
      ({
        pageLabel: 'pages.lineItems.label.lineItemDetails',
        formConfig: [...BasicDetails],
        summaryViewFields: LineItemSummaryViewFields,
        updateUrl: 'edit',
        itemDetails: lineItemDetails,
      }) as IShowItemDetailsProps,
    [lineItemDetails],
  );

  return (
    <>
      <ShowLineItemWrapper
        lineItemId={lineItemId}
        campaignId={campaignId}
        lineItemDetails={lineItemDetails}
      >
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
