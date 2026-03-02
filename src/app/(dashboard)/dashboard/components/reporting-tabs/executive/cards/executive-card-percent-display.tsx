import React, { FC } from 'react';
import { Text } from '@/uicomponents/text';

interface PercentDisplayProps {
  percent: string;
  isPositive?: boolean | null;
}

const PercentDisplay: FC<PercentDisplayProps> = ({ percent, isPositive }) => {
  let textColor = '#000';
  if (isPositive !== undefined) {
    if (isPositive) {
      textColor = '#90BE6D';
    } else if (isPositive === false) {
      textColor = '#F64C4C';
    }
  }

  return (
    <Text
      style={{
        fontSize: '1.5rem',
        fontWeight: 500,
        color: textColor,
        lineHeight: 'normal',
      }}
    >
      {percent}
    </Text>
  );
};

export default PercentDisplay;
