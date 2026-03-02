import { Text } from '@/uicomponents/text';
import React from 'react';

type TextContentProps = {
  data: string;
};

export const TextContent = ({ data }: TextContentProps) => {
  return <Text style={{ fontSize: '0.875rem', color: 'inherit' }}>{data}</Text>;
};
