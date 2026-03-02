import { DzIcon } from '@/components/shared';
import React, { CSSProperties, FC } from 'react';

interface IAlertTriangleProps {
  style: CSSProperties;
}

export const AlertTriangle: FC<IAlertTriangleProps> = ({ style }) => {
  return <DzIcon src='/icons/alert-triangle.svg' style={style} />;
};
