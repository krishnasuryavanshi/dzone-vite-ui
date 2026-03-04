import { DzIcon } from '@/components/shared';
import React from 'react';

export const BlueTickIcon = ({
  size = 16,
  color = '#1890ff',
}: {
  size?: number;
  color?: string;
}) => {
  return <DzIcon src='/icons/check-blue.svg' style={{ width: size, height: size, fill: color }} />;
};
