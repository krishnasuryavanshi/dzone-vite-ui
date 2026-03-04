import { DzIcon } from '@/components/shared';
import React from 'react';

export const DirectInboxIcon = ({ style, ...rest }: { style?: React.CSSProperties }) => {
  return <DzIcon src='/icons/direct-inbox.svg' style={style} {...rest} />;
};
