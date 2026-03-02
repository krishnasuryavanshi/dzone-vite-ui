import React, { FC } from 'react';
import { Text } from '@/uicomponents/text';

interface MarketerPercentDisplayProps {
  percent: string;
  isPositive?: boolean | null;
}

const MarketerPercentDisplay: FC<MarketerPercentDisplayProps> = ({
  percent = '',
  isPositive,
}) => {
  let textColor = '#000';
  if (isPositive !== undefined) {
    if (isPositive) {
      textColor = '#12B30D';
    } else if (isPositive === false) {
      textColor = '#FF080C';
    }
  }

  return percent ? (
    <Text
      style={{
        fontSize: '1.125rem',
        fontWeight: 700,
        color: textColor,
        lineHeight: 'normal',
      }}>
      {isPositive ? `+${percent}%` : `${percent}%`}
    </Text>
  ) : (
    <span>-</span>
  );
};

export default MarketerPercentDisplay;
