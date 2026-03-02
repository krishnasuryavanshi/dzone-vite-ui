import { DzIcon } from '@/components/shared';
import React, { CSSProperties, FC } from 'react';

interface IActionsDropdownProps {
  style?: CSSProperties;
}

export const ActionsDropdownIcon: FC<IActionsDropdownProps> = ({ style }) => {
  return <DzIcon src='/actions-dropdown.svg' style={style} />;
};
