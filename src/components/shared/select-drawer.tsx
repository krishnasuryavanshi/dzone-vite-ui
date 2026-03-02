import { Translate } from '@/components/i18n';
import { Drawer } from '@/uicomponents/drawers';
import { List, ListItem } from '@/uicomponents/layout/list';
import React from 'react';

interface ISelectDrawerProps {
  visible: boolean;
  omittedValues: Record<string, any>[];
  onClose: (e: any) => void;
  label: string;
}

export const SelectDrawer: React.FC<ISelectDrawerProps> = ({
  visible,
  omittedValues,
  onClose,
  label,
}) => {
  return (
    <Drawer
      onClick={(e) => null}
      title={<Translate i18nKey={label} />}
      placement='right'
      open={visible}
      width={400}
      maskClosable={false}
      onClose={onClose}>
      <List
        bordered
        style={{ maxHeight: '85vh', overflow: 'auto' }}
        size='small'
        itemLayout='horizontal'
        dataSource={omittedValues}
        renderItem={(item: any, index: number) => (
          <>
            <ListItem>
              {index + 1}. {item.label}
            </ListItem>
          </>
        )}
      />
    </Drawer>
  );
};
