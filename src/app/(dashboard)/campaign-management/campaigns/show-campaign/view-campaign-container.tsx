
import { ICampaign } from '@/app/(dashboard)/campaign-management/campaigns/lib/types';
import { DzScrollContainer } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useState } from 'react';
import {} from '../../components/show-page';
import { fetchCampaignDetails } from '../services';
import { LineItemsContainer } from './line-items-container';
import { ViewCampaignBreadcrumb } from './view-campaign-breadcrumb';
import { CampaignSummaryViewFields } from '../lib/constants';
import { prepareViewData } from '../lib/utils';
import { CampaignField } from '../lib/enums';
import { useRestrictedAccess } from '@/lib/hooks';
import { RestrictedAccessKeys } from '@/lib/enums';
import { debounce } from 'lodash';
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

  const [campaignDetails, setCampaignDetails] = useState<ICampaign>();
  const [detailsSectionProps, setDetailsSectionProps] =
    useState<IShowItemDetailsProps>({
      pageLabel: 'pages.campaigns.label.campaignDetails',
      formConfig: CampaignDetailsSchema,
      summaryViewFields: CampaignSummaryViewFields,
      updateUrl: 'edit',
    } as IShowItemDetailsProps);
  const [restrictedFields, setRestrictedFields] = useState<
    (boolean | string)[]
  >([]);

  useEffect(() => {
    setRestrictedFields([
      isIONumberRestricted && CampaignField.IoNumber,
      isUploadIOFileRestricted,
      isBookedRevenueRestricted && CampaignField.BookedRevenue,
    ]);
  }, [
    isBookedRevenueRestricted,
    isUploadIOFileRestricted,
    isIONumberRestricted,
  ]);

  useEffect(() => {
    if (campaignId && roles?.length && restrictedFields.length) {
      // until roles are accessible
      debouncedFetchCampaign();
    }
  }, [campaignId, roles, restrictedFields]);

  const fetchCampaign = async () => {
    const data = await fetchCampaignDetails(campaignId);
    let ioFileDetails = {};
    if (data?.data?.ioFileId) {
      const ioFileResponse = await fetchFileDetails(data?.data?.ioFileId);
      ioFileDetails = ioFileResponse;
    }
    const viewData = prepareViewData(data?.data, {
      restrictedFields,
    });

    const updatedCampagignDetails = {
      ...viewData,
      ioFileId: ioFileDetails,
    };

    setCampaignDetails(updatedCampagignDetails);
    setDetailsSectionProps({
      ...detailsSectionProps,
      itemDetails: updatedCampagignDetails,
    });
  };

  const debouncedFetchCampaign = debounce(fetchCampaign, 100);

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
