import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { CreateNewTemplateAction } from './create-new-template-action';
import { HasPermission } from '@/components/auth';
import { DeliveryTemplateActionsEnum } from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { Text } from '@/uicomponents/text';
import { Translate } from '@/components/i18n';
import { DZONE_CLR_BLACK } from '@/lib/constants';

interface ITemplateListHeaderProps {}

export const TemplateListHeader: FC<ITemplateListHeaderProps> = () => {
  const isCreatePermission = usePermissionCheck(DeliveryTemplateActionsEnum.Create);
  return (
    <Flex justify={'space-between'} align='center'>
      <Text
        style={{
          color: DZONE_CLR_BLACK,
          fontWeight: 600,
          fontSize: '1.125rem',
        }}
      >
        <Translate i18nKey='pages.templates.title' />
      </Text>
      <HasPermission permissions={DeliveryTemplateActionsEnum.Create}>
        <CreateNewTemplateAction />
      </HasPermission>
    </Flex>
  );
};
