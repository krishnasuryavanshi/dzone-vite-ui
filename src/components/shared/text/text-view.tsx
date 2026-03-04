import React, { FC, useState } from 'react';
import { TruncatedText } from './truncated-text';
import { Drawer } from '@/uicomponents/drawers';
import { Translate } from '@/components/i18n';
import { Button, Text } from '@/uicomponents/index';
import { CloseOutlined } from '@/uicomponents/icons';

interface ITextViewProps {
  value: string;
  label: string;
  lines?: number;
}

export const TextView: FC<ITextViewProps> = ({ value, label, lines = 2 }) => {
  const [showModal, setShowModal] = useState(false);
  const handleExpand = () => {
    setShowModal(true);
  };

  return (
    <>
      <TruncatedText lines={lines} handleExpand={handleExpand}>
        {value}
      </TruncatedText>
      <DrawerFullText
        label={label}
        show={showModal}
        value={value}
        handleClose={() => setShowModal(false)}
      />
    </>
  );
};

export const DrawerFullText = ({
  label,
  show,
  value,
  handleClose,
}: {
  show: boolean;
  value: string;
  label: string;
  handleClose: () => void;
}) => {
  if (!show) return null;
  return (
    <Drawer
      title={<Translate i18nKey={label} />}
      closeIcon={null} // Hide the default close icon
      onClose={handleClose}
      placement='right'
      footer={null}
      open={show}
    >
      <Button
        icon={<CloseOutlined />}
        onClick={handleClose}
        className='custom-drawer-close-button'
      />
      <Text>{value}</Text>
    </Drawer>
  );
};
