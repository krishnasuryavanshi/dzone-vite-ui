import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import React from 'react';
import { HtmlContent } from './html-content';

type TextContentProps = {
  data: string;
  children?: React.ReactNode;
  isUserInput?: boolean; // Flag to indicate if this is user input
};

export const TextContent = ({ data, children, isUserInput = false }: TextContentProps) => {
  return (
    <Flex vertical>
      <DzBox>{children}</DzBox>
      <HtmlContent htmlStr={data} isUserInput={isUserInput} />
    </Flex>
  );
};
