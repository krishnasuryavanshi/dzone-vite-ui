import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents/text';
import React, { FC, useEffect, useState } from 'react';
import { ValidationStatusColors } from '../../../lib/constants';

const NoColor = { backgroundColor: '', color: '' };

interface IValidationStatusProps {
  validationStatus: string;
}

export const ValidationStatus: FC<IValidationStatusProps> = ({ validationStatus }) => {
  const [colors, setColors] = useState(NoColor);

  useEffect(() => {
    if (validationStatus) {
      const color = ValidationStatusColors[validationStatus as keyof typeof ValidationStatusColors];
      setColors(color ? color : NoColor);
    }
  }, [validationStatus]);

  return (
    <DzBox
      style={{
        width: 'fit-content',
        padding: '0.25rem 0.5rem',
        borderRadius: '4px',
        backgroundColor: colors.backgroundColor,
        minWidth: '4rem',
        minHeight: '2rem',
        filter: 'drop-shadow(0px 0px 4px rgba(35, 90, 237, 0.16))',
      }}
    >
      <Text style={{ color: colors.color }}>{validationStatus}</Text>
    </DzBox>
  );
};
