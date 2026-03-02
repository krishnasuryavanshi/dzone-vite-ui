import { Text } from '@/uicomponents/text';
import React, { FC } from 'react';

interface IExampleCellProps {
  example: string;
}

export const ExampleCell: FC<IExampleCellProps> = ({ example }) => {
  return <Text style={{ color: '#888888' }}>{example}</Text>;
};
