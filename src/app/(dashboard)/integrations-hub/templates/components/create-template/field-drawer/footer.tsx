import { HasPermission } from '@/components/auth';
import { DeliveryTemplateActionsEnum } from '@/lib/enums/permissions';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { ITemplateFieldResponse } from '../../../lib/types';
import { useTemplateStore } from '../../../stores';
import { DrawerCancelButton, DrawerSaveTemplateButton } from '../field-toolbar-actions';

interface IFieldToolbarProps {
  getCurrentFieldData: () => Promise<{
    field: ITemplateFieldResponse;
    index: number;
  }>;
}

export const Footer: FC<IFieldToolbarProps> = ({ getCurrentFieldData }) => {
  const { templateId, closeFieldDrawer } = useTemplateStore();

  return (
    <Flex
      gap={'0.5rem'}
      align='center'
      justify='right'
      style={{
        padding: '0.5rem',
        borderTop: 'none',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <DrawerCancelButton closeFieldDrawer={closeFieldDrawer} />
      <HasPermission
        permissions={
          templateId ? DeliveryTemplateActionsEnum.Edit : DeliveryTemplateActionsEnum.Create
        }
      >
        <DrawerSaveTemplateButton
          closeFieldDrawer={closeFieldDrawer}
          getCurrentFieldData={getCurrentFieldData}
        />
      </HasPermission>
    </Flex>
  );
};
