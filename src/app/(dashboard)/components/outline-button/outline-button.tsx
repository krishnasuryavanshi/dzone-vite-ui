import React, { CSSProperties } from 'react';
import { Button } from '@/uicomponents/button';

interface OutlineBlueButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  style?: CSSProperties;
  size?: 'small' | 'middle' | 'large';
}

const OutlineBlueButton: React.FC<OutlineBlueButtonProps> = ({
  onClick,
  children,
  style,
  size = 'middle',
}) => {
  return (
    <Button
      type='default'
      size={size}
      style={{
        color: '#2563EB',
        borderRadius: 4,
        fontWeight: 500,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default OutlineBlueButton;
