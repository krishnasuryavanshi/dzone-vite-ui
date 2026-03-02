import { DzIcon } from '@/components/shared';
import React, { FC } from 'react';

type ICopyPasteProps = Record<string, never>;

export const CopyPasteIcon: FC<ICopyPasteProps> = () => {
  return <DzIcon src='/icons/copy-paste.svg' />;
};
