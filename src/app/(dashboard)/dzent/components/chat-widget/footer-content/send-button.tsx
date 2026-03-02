import { DzBox } from '@/components/layout/v1';
import { DZENT_ICON_PURPLE } from '@/lib/constants';
import { SendOutlined } from '@/uicomponents/icons';
import React from 'react';

type SendButtonProps = {
  disabled?: boolean;
  handleSend: () => void;
};

export const SendButton = ({ disabled, handleSend }: SendButtonProps) => {
  return (
    <DzBox
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={() => !disabled && handleSend()}>
      <SendOutlined
        style={{
          width: '1.4rem',
          height: '1.3rem',
          color: DZENT_ICON_PURPLE,
          fontSize: '1.25rem',
          opacity: disabled ? 0.5 : 1,
        }}
      />
    </DzBox>
  );
};
