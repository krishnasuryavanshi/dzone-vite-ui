import { DrawerCloseButton } from '@/app/(dashboard)/components';
import { Drawer, Text } from '@/uicomponents/index';
import React, { PropsWithChildren } from 'react';

interface ITargetingAttributeValuesDrawerProps extends PropsWithChildren {
  isOpen: boolean;
  header: string;
  handleClose: () => void;
}
export const TargetingAttributeValuesDrawer = ({
  isOpen,
  header,
  handleClose,
  children,
}: ITargetingAttributeValuesDrawerProps) => {
  return (
    <Drawer
      className='dz-drawer targeting-attribute-values-drawer '
      closable
      destroyOnClose
      maskClosable={false}
      placement='right'
      closeIcon={<DrawerCloseButton />}
      title={<Text strong>{header}</Text>}
      open={isOpen}
      onClose={handleClose}>
      {children}
    </Drawer>
  );
};
