import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { Title } from '@/uicomponents';
import React, { FC, useState } from 'react';
import { Translate } from '@/components/i18n';
import { LineItemsActions } from './line-items-actions';
import { CreateLineIitemContainer } from '@/app/(dashboard)/campaign-management/campaigns/create-line-item';
import { HasPermission } from '@/components/auth';
import { LineItemActionsEnum } from '@/lib/enums/permissions';

interface ILineItemHeaderProps {
  totalLineItems: number;
  campaignId: string;
  campaignUuId: string;
  showCreateLineItem: boolean;
  handelCreateLineItemForm: (isOpen: boolean) => void;
}

export const LineItemHeader: FC<ILineItemHeaderProps> = ({
  showCreateLineItem,
  handelCreateLineItemForm,
  totalLineItems,
  campaignId,
  campaignUuId,
}) => {
  return (
    <DzBox dzOneBox>
      <Flex justify='space-between' align='center' style={{ height: '2.5rem' }}>
        <Title level={5} style={{ marginBottom: 0 }}>
          <Translate i18nKey='pages.lineItems.title' /> ({totalLineItems})
        </Title>
        <HasPermission permissions={LineItemActionsEnum.Create}>
          <LineItemsActions />
        </HasPermission>
      </Flex>
      <CreateLineIitemContainer
        show={showCreateLineItem}
        campaignUuid={campaignUuId}
        campaignId={campaignId}
        handleCloseLineItemForm={() => handelCreateLineItemForm(false)}
      />
    </DzBox>
  );
};
