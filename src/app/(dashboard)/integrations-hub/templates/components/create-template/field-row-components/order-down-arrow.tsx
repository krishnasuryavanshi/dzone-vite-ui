import { DoubleRightOutlined } from '@/uicomponents/icons';
import React, { FC } from 'react';

interface IOrderDownArrowProps {
  isLast: boolean;
  handleOrderChange: () => void;
  disabled: boolean;
}

export const OrderDownArrow: FC<IOrderDownArrowProps> = ({
  isLast,
  handleOrderChange,
  disabled,
}) => {
  const style = {
    cursor: 'pointer',
    fontSize: '0.75rem',
    strokeWidth: 50,
    stroke: 'black',
  };

  if (isLast) return null;

  if (disabled) {
    style.stroke = '#8e8e8e';
    style.cursor = 'not-allowed';
  }

  return (
    <DoubleRightOutlined
      disabled={disabled}
      onClick={() => !disabled && handleOrderChange()}
      style={{
        transform: 'rotate(90deg)',
        ...style,
      }}
    />
  );
};
