
import { ICampaign } from '@/app/(dashboard)/campaign-management/campaigns/lib/types';
import { DzScrollContainer } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { fetchCampaignDetails } from '../services';
import { LineItemsContainer } from './line-items-container';
import { ViewCampaignBreadcrumb } from './view-campaign-breadcrumb';
import { CampaignSummaryViewFields } from '../lib/constants';
import { prepareViewData } from '../lib/utils';
import { CampaignField } from '../lib/enums';
import { useRestrictedAccess } from '@/lib/hooks';
import { RestrictedAccessKeys } from '@/lib/enums';
import { usePermissions } from '@/lib/hooks/use-auth';
import CampaignDetailsSchema from '../lib/schemas/campaign-form.json';
import { IShowItemDetailsProps } from '../../lib/types';
import { ShowItemDetails } from '../../components/show-page';
import { fetchFileDetails } from '../../line-items/services';

interface IViewCampaignContainerProps {
  campaignId: string;
  isDzoneUser?: boolean;
}

export const ViewCampaignContainer: FC<IViewCampaignContainerProps> = ({
  campaignId,
  isDzoneUser,
}) => {
  const { data: roles } = usePermissions<string[]>();
  const isIONumberRestricted = useRestrictedAccess(
    RestrictedAccessKeys.IONumberFieldInCampaignDetails,
  );
  const isUploadIOFileRestricted = useRestrictedAccess(
    RestrictedAccessKeys.UploadIOFileFieldInCampaignDetails,
  );
  const isBookedRevenueRestricted = useRestrictedAccess(
    RestrictedAccessKeys.BookedRevenueFieldInCampaignDetails,
  );

  const restrictedFields = useMemo(
    () => [
      isIONumberRestricted && CampaignField.IoNumber,
      isUploadIOFileRestricted,
      isBookedRevenueRestricted && CampaignField.BookedRevenue,
    ],
    [isBookedRevenueRestricted, isUploadIOFileRestricted, isIONumberRestricted],
  );

  const { data: campaignDetails } = useQuery({
    queryKey: [...queryKeys.campaigns.detail(campaignId), { restrictedFields }],
    queryFn: async () => {
      const data = await fetchCampaignDetails(campaignId);
      if (!data) throw new Error('Failed to fetch campaign details');

      let ioFileDetails = {};
      if (data?.data?.ioFileId) {
        const ioFileResponse = await fetchFileDetails(data.data.ioFileId);
        ioFileDetails = ioFileResponse;
      }

      const viewData = prepareViewData(data?.data, { restrictedFields });
      return { ...viewData, ioFileId: ioFileDetails } as ICampaign;
    },
    enabled: !!campaignId && !!roles?.length && restrictedFields.length > 0,
  });

  const detailsSectionProps: IShowItemDetailsProps = useMemo(
    () =>
      ({
        pageLabel: 'pages.campaigns.label.campaignDetails',
        formConfig: CampaignDetailsSchema,
        summaryViewFields: CampaignSummaryViewFields,
        updateUrl: 'edit',
        itemDetails: campaignDetails,
      }) as IShowItemDetailsProps,
    [campaignDetails],
  );

  return (
    <DzScrollContainer vertical scoll='outside'>
      <DzScrollContainer.Sticky>
        <Flex vertical style={{ padding: '0.5rem', paddingBottom: '0rem' }}>
          <ViewCampaignBreadcrumb campaignId={campaignDetails?.campaignId} />
        </Flex>
      </DzScrollContainer.Sticky>
      <DzScrollContainer.Scroll>
        <Flex vertical style={{ padding: '0.5rem', paddingTop: '0rem' }}>
          <ShowItemDetails {...detailsSectionProps} type='campaign' />
          <LineItemsContainer
            campaignId={campaignDetails?.campaignId}
            campaignUuId={campaignId}
          />
        </Flex>
      </DzScrollContainer.Scroll>
    </DzScrollContainer>
  );
};
