import { Modal } from '@/uicomponents/modal';
import { FC, SyntheticEvent, useMemo, useState } from 'react';
import { ModalHeader } from './modal-header';
import { ModalFooter } from './modal-footer';
import { ModalBody } from './modal-body';
import { IActiveCampaignList } from '../../lib/types';
import { useQueryState } from '@/lib/hooks';
import { usePathname, useRouter } from '@/lib/hooks/use-router';
import { useCloneLineItemMutation, useCampaignsByMarketerQuery } from '../../hooks';

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

  const { data: campaignsData } = useCampaignsByMarketerQuery(marketerCode, openModal);

  const activeCampaignList: IActiveCampaignList[] = useMemo(
    () => campaignsData ?? [],
    [campaignsData],
  );

  const [selectedActiveCampaign, setSelectedActiveCampaign] = useState<string>('');

  // Auto-select campaign when list loads
  useMemo(() => {
    if (activeCampaignList.length > 0) {
      const selectedCampaign = activeCampaignList.find((campaign) => campaign.id === campaignId);
      setSelectedActiveCampaign(selectedCampaign?.id || '');
    }
  }, [campaignId, activeCampaignList]);

  const selectCampaign = (campaign: string) => {
    setSelectedActiveCampaign(campaign);
  };

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
            if (pathname !== LINE_ITEM_SOURCE && selectedActiveCampaign !== campaignId) {
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
      maskClosable={false}
    >
      <ModalBody
        activeCampaignList={activeCampaignList}
        selectedActiveCampaign={selectedActiveCampaign!}
        selectCampaign={selectCampaign}
      />
    </Modal>
  );
};
