import { Flex } from '@/uicomponents/layout';
import React, { FC, PropsWithChildren } from 'react';

interface ILeadsFiltersManagerProps extends PropsWithChildren {}

export const LeadsFiltersManager: FC<ILeadsFiltersManagerProps> = ({
  children,
}) => {
  return <Flex justify='space-between'>{children}</Flex>;
};
