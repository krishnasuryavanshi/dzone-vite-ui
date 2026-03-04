import { Button, Dropdown, Link } from '@/uicomponents';
import { MoreOutlined } from '@/uicomponents/icons';
import React, { FC, SyntheticEvent, useState } from 'react';

import './record-actions.scss';
import { validateLineItem } from '../services';
import { showNotification } from '@/services/index';
import { useLineItemContextStore } from '../store/use-line-item-context-store';
import { useRouter } from '@/lib/hooks/use-router';
import { CloneLineItemModal } from './clone-line-item';
import { Space } from '@/uicomponents/layout';
import { usePermissionCheck } from '@/lib/hooks';
import { LeadActionsEnum, LineItemActionsEnum } from '@/lib/enums/permissions';
import { DZONE_CLR_BLACK } from '@/lib/constants';
import { ThreeDotsActionsIcon } from '@/uicomponents/icons/svgs';

interface IRecordActionsProps {
  lineItemId: string;
  campaignId: string;
  tenantCode?: string;
  marketerCode?: string;
}

type PermissionKeys = `${LineItemActionsEnum}` | `${LeadActionsEnum}`;

type ItemConfig = {
  key: string;
  permission: PermissionKeys;
  label: React.ReactNode;
};

export const LineItemRecordActions: FC<IRecordActionsProps> = ({
  lineItemId,
  campaignId,
  tenantCode,
  marketerCode,
}) => {
  const showLoader = useLineItemContextStore((s) => s.showLoader);

  const router = useRouter();

  const canViewLeads = usePermissionCheck(LeadActionsEnum.View);
  const permissions: Partial<Record<PermissionKeys, boolean>> = {
    [LineItemActionsEnum.View]: usePermissionCheck(LineItemActionsEnum.View),
    [LineItemActionsEnum.Edit]: usePermissionCheck(LineItemActionsEnum.Edit),
    [LeadActionsEnum.View]: usePermissionCheck(LeadActionsEnum.View),
    [LineItemActionsEnum.Create]: usePermissionCheck(LineItemActionsEnum.Create),
  };

  const ACTION_MAPPING: Partial<
    Record<
      PermissionKeys,
      (
        lineItemId: string,
        tenantCode: string,
        stopPropagation: (e: SyntheticEvent) => void,
      ) => React.ReactNode
    >
  > = {
    [LineItemActionsEnum.View]: (lineItemId, stopPropagation) => (
      <Link href={LineItemLink}>View Line Item</Link>
    ),
    [LineItemActionsEnum.Edit]: (lineItemId, stopPropagation) => (
      <Link
        onClick={(e) => {
          e.stopPropagation();
          validateLineItemDetails(lineItemId as string);
        }}
      >
        Edit Line Item
      </Link>
    ),
    [LeadActionsEnum.View]: (lineItemId, stopPropagation) => (
      <Link href={`/campaign-management/leads?lineItemId=${lineItemId}&tenantCode=${tenantCode}`}>
        View Leads
      </Link>
    ),
    [LineItemActionsEnum.Create]: (lineItemId, stopPropagation) => (
      <Link onClick={cloneLineItemAction}>Clone Line Item</Link>
    ),
  };

  const [openModal, setOpenModal] = useState<boolean>(false);

  const closeModal = () => {
    setOpenModal(false);
  };

  const cloneLineItemAction = (e: SyntheticEvent) => {
    e.stopPropagation();
    setOpenModal(true);
  };

  const LineItemLink = `/campaign-management/line-items/${lineItemId}`;
  const editLineItemLink = `${LineItemLink}/edit`;

  const validateLineItemDetails = async (lineItemId: string) => {
    showLoader(true);
    try {
      const data = await validateLineItem(lineItemId);
      if (data?.data) {
        router.replace(editLineItemLink);
      }
    } catch (error) {
      showNotification({ message: error as string, type: 'error' });
    } finally {
      showLoader(false);
    }
  };

  const getDropdownMenus = (lineItemId: string) => {
    const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();

    const itemsConfig: ItemConfig[] = Object.entries(ACTION_MAPPING).map(([key, render]) => ({
      key,
      permission: key as PermissionKeys,
      label: render(lineItemId, tenantCode ?? '', stopPropagation),
    }));

    const filteredMenu = itemsConfig
      .filter((item) => permissions[item.permission])
      .map(({ key, label }) => ({ key, label }));

    return filteredMenu;
  };

  const handleModalClick = (e: SyntheticEvent) => {
    e.stopPropagation(); // Prevent click from closing the modal if clicking inside the modal
  };

  return (
    <>
      <Dropdown menu={{ items: getDropdownMenus(lineItemId) }} placement='bottomLeft'>
        <Button
          onClick={(e) => e.stopPropagation()}
          icon={<ThreeDotsActionsIcon />}
          type='text'
          className='icon-only-button'
        />
      </Dropdown>
      <Space onClick={handleModalClick}>
        <CloneLineItemModal
          lineItemId={lineItemId}
          campaignId={campaignId}
          editLineItemLink={editLineItemLink}
          openModal={openModal}
          closeModal={closeModal}
          marketerCode={marketerCode}
        />
      </Space>
    </>
  );
};
