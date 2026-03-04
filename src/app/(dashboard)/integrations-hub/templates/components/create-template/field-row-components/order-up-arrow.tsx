import { DoubleRightOutlined } from '@/uicomponents/icons';
import React, { FC } from 'react';

interface IOrderUpArrowProps {
  isFirst: boolean;
  handleOrderChange: () => void;
  disabled: boolean;
}

export const OrderUpArrow: FC<IOrderUpArrowProps> = ({ isFirst, handleOrderChange, disabled }) => {
  const style = {
    cursor: 'pointer',
    fontSize: '0.75rem',
    strokeWidth: 50,
    stroke: 'black',
  };

  if (isFirst) return null;

  if (disabled) {
    style.stroke = '#8e8e8e';
    style.cursor = 'not-allowed';
  }

  return (
    <DoubleRightOutlined
      disabled={disabled}
      onClick={() => !disabled && handleOrderChange()}
      style={{
        transform: 'rotate(270deg)',
        ...style,
      }}
    />
  );
};
