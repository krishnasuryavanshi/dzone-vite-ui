import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { ButtonAddLineItem } from './button-add-line-item';

interface ILineItemsActionsProps {}

export const LineItemsActions: FC<ILineItemsActionsProps> = ({}) => {
  return (
    <Flex gap='1rem' align='center'>
      <ButtonAddLineItem />
    </Flex>
  );
};
