import { Modal } from '@/uicomponents/modal';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { ModalHeader } from './modal-header';
import { ModalFooter } from './modal-footer';
import { ModalBody } from './modal-body';
import { fetchCampaignsByMarketer } from '../../services';
import { IActiveCampaignList } from '../../lib/types';
import { useQueryState } from '@/lib/hooks';
import { usePathname, useRouter } from '@/lib/hooks/use-router';
import { useCloneLineItemMutation } from '../../hooks';

interface ICloneLineItemContainerProps {
  lineItemId: string;
  campaignId: string;
  openModal: boolean;
  editLineItemLink: string;
  closeModal: () => void;
  marketerCode?: string;
}

const LINE_ITEM_SOURCE = '/campaign-management/line-items';

export const CloneLineItemModal: FC<ICloneLineItemContainerProps> = ({
  lineItemId,
  campaignId,
  openModal,
  closeModal,
  editLineItemLink,
  marketerCode,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const { setQueryState } = useQueryState();
  const cloneMutation = useCloneLineItemMutation();

  const [selectedActiveCampaign, setSelectedActiveCampaign] =
    useState<string>('');
  const [activeCampaignList, setActiveCampaignList] = useState<
    IActiveCampaignList[]
  >([]);

  const campaignList = async () => {
    if (marketerCode) {
      const data = await fetchCampaignsByMarketer(marketerCode);
      setActiveCampaignList(data || []);
    } else {
      setActiveCampaignList([]);
    }
  };

  const selectCampaign = (campaign: string) => {
    setSelectedActiveCampaign(campaign);
  };

  useEffect(() => {
    if (openModal) {
      campaignList();
    }
  }, [openModal]);

  useEffect(() => {
    if (activeCampaignList?.length > 0) {
      const selectedCampaign = activeCampaignList.find(
        (campaign) => campaign.id === campaignId,
      );
      setSelectedActiveCampaign(selectedCampaign?.id || '');
    }
  }, [campaignId, activeCampaignList]);

  const handleCancel = (e: SyntheticEvent) => {
    e.stopPropagation();
    closeModal();
  };

  const handleClone = async (e: SyntheticEvent, isEditing: boolean) => {
    e.stopPropagation();
    cloneMutation.mutate(
      {
        lineItemId,
        data: { campaignId: selectedActiveCampaign! },
      },
      {
        onSuccess: (data) => {
          if (data?.data) {
            closeModal();
            if (
              pathname !== LINE_ITEM_SOURCE &&
              selectedActiveCampaign !== campaignId
            ) {
              router.replace(LINE_ITEM_SOURCE);
            } else if (isEditing) {
              router.replace(editLineItemLink);
            } else {
              setQueryState([{ name: 'refresh_id', value: new Date().getTime() }]);
            }
          }
        },
      },
    );
  };

  const loadingClone = cloneMutation.isPending && !cloneMutation.variables;
  const loadingCloneEdit = cloneMutation.isPending;

  return (
    <Modal
      width={'40%'}
      open={openModal}
      onCancel={handleCancel}
      title={<ModalHeader />}
      footer={
        <ModalFooter
          loadingClone={cloneMutation.isPending}
          loadingCloneEdit={cloneMutation.isPending}
          handleCancel={handleCancel}
          handleSubmit={handleClone}
        />
      }
      destroyOnClose
      maskClosable={false}>
      <ModalBody
        activeCampaignList={activeCampaignList}
        selectedActiveCampaign={selectedActiveCampaign!}
        selectCampaign={selectCampaign}
      />
    </Modal>
  );
};
