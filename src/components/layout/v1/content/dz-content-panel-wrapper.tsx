import React from 'react';
import { DzBox } from '../dz-box';

export const DzContentPanelWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <DzBox className="dz-content-panel-wrapper">{children}</DzBox>;
};
