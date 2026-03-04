import { DrawerCloseButton } from '@/app/(dashboard)/components';
import { Translate } from '@/components/i18n';
import { Drawer } from '@/uicomponents/drawers';
import { FC, useEffect, useState } from 'react';
import { BodyContent } from './body-content';
import { useModulesStore } from '../../../stores';
import { IAction } from '../../../lib/types';

interface IPermissionsDrawerProps {
  open: boolean;
  onClose: () => void;
  actionId: string;
}

export const PermissionsDrawer: FC<IPermissionsDrawerProps> = ({ open, onClose, actionId }) => {
  const { selectedModule, modules } = useModulesStore();
  const [actionName, setActionName] = useState('');

  useEffect(() => {
    const actions = modules?.[selectedModule as string].actions || [];
    if (actions.length) {
      setActionName(actions.find((action: IAction) => action?.id === actionId)?.value || '');
    }
  }, [selectedModule, actionId]);

  return (
    <Drawer
      className='dz-drawer dz-permissions-drawer'
      width={500}
      placement='right'
      closable
      title={
        <Translate
          i18nKey='pages.rolesAndPermissions.label.drawerHeading'
          options={{ actionName }}
        />
      }
      open={open}
      destroyOnClose
      maskClosable={false}
      closeIcon={<DrawerCloseButton />}
      onClose={onClose}
    >
      <BodyContent open={open} onClose={onClose} actionId={actionId} />
    </Drawer>
  );
};
