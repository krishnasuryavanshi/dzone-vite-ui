import { DzBox } from '@/components/layout/v1';
import { CLR_BLUE_LIGHT } from '@/lib/constants';
import { CampaignActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { showNotification } from '@/services/notification';
import { Select } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Modal } from '@/uicomponents/modal';
import { Spin } from '@/uicomponents/spin';
import { LoadingOutlined } from '@ant-design/icons';
import { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import './campaign-status-action.scss';
import { ICampaign } from '../lib/types';
import { putCreateCampaign } from '../services';
import { CampaignStatus } from '../../components/campaign-status';
import { ALLOWED_STATUS } from '../lib/constants';
import { ConfirmationModal } from './status-confirmation-modal';
import { useRouter } from '@/lib/hooks/use-router';
import { useCampaignStatusesQuery } from '../hooks';

interface IStatusActionProps {
  record: ICampaign;
}

interface IStatus {
  name: string;
  value: string;
}

export const CampaignStatusAction: FC<IStatusActionProps> = ({ record }) => {
  const router = useRouter();
  const isUpdateStatusAllowed = usePermissionCheck(CampaignActionsEnum.Edit);

  const [selectedStatus, setSelectedStatus] = useState<IStatus | null>();
  const [updateStatus, setUpdateStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { data: statusesData } = useCampaignStatusesQuery();

  const statusList = useMemo<IStatus[]>(() => {
    if (!statusesData) return [];
    return statusesData
      .filter((status: { value: string }) =>
        ALLOWED_STATUS.includes(status.value),
      )
      .map((status: { text: string; value: string }) => ({
        name: status.text,
        value: status.value,
      }));
  }, [statusesData]);

  const handleChange = (value: string) => {
    const status = statusList.find((status: any) => status?.value === value);
    setSelectedStatus(status);
    if (status?.value === 'ARCHIVED') {
      setOpenModal(true);
    }
  };

  const fetchUpdatedData = async (statusData: IStatus, id: string) => {
    try {
      setIsLoading(true);
      const params = {
        status: statusData.value,
      };
      const data = await putCreateCampaign(params, id);
      if (data?.data) {
        showNotification({
          message:
            statusData.value === 'BOOKED'
              ? `Campaign status updated successfully`
              : 'Campaign is archived successfully',
        });
        router.push('/campaign-management/campaigns');
      }
    } catch (error) {
      setSelectedStatus(null);
    } finally {
      setIsLoading(false);
      setUpdateStatus(false);
    }
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.stopPropagation();
    setOpenModal(false);
    setUpdateStatus(false);
  };

  const confirmCancel = (event: SyntheticEvent) => {
    event.stopPropagation();
    if (selectedStatus) {
      fetchUpdatedData(selectedStatus, record.id);
      setOpenModal(false);
    }
  };

  useEffect(() => {
    if (!selectedStatus) return;

    const isDifferentStatus = selectedStatus.value !== record.status.value;

    if (isDifferentStatus && !openModal) {
      fetchUpdatedData(selectedStatus, record.id);
    }
  }, [selectedStatus]);

  if (isLoading) {
    return (
      <Spin
        style={{ marginLeft: '30%' }}
        indicator={
          <LoadingOutlined
            style={{ fontSize: 24, color: `${CLR_BLUE_LIGHT}` }}
            spin
          />
        }
      />
    );
  }
  return (
    <>
      {openModal ? (
        <Modal
          open={openModal}
          onCancel={handleCancel}
          footer={null}
          closable={false}
          className='confirm-cancel-modal'>
          <ConfirmationModal
            className='confirmation-modal'
            onProceed={confirmCancel}
            onCancel={handleCancel}
          />
        </Modal>
      ) : null}
      {updateStatus ? (
        <Select
          className='custom-status-select'
          open={updateStatus}
          size='large'
          value={selectedStatus || record.status?.value}
          placeholder={record.status?.value}
          onClick={(e) => e.stopPropagation()}
          onDropdownVisibleChange={(visible) => {
            if (!visible) {
              setUpdateStatus(false);
            }
          }}
          onChange={handleChange}>
          {statusList.map((status: any) => {
            return (
              <Select.Option key={status?.value} value={status?.value}>
                <Flex justify='space-between'>
                  <span style={{ marginLeft: '8px' }}>{status?.name}</span>
                </Flex>
              </Select.Option>
            );
          })}
        </Select>
      ) : (
        <DzBox
          onClick={(e) => {
            e.stopPropagation();
            if (isUpdateStatusAllowed) {
              setUpdateStatus(true);
            }
          }}>
          <CampaignStatus status={record.status} />
        </DzBox>
      )}
    </>
  );
};
