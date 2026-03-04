import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { OrderDownArrow } from './order-down-arrow';
import { OrderNumber } from './order-number';
import { OrderUpArrow } from './order-up-arrow';
import { ITemplateFieldResponse } from '../../../lib/types';

interface IOrderCellProps {
  isFirst: boolean;
  isLast: boolean;
  id: number;
  templateField: ITemplateFieldResponse;
  handleOrderChange: (order: number, templateField: ITemplateFieldResponse) => void;
  disabledArrowIndexes: { up: number; down: number };
  isEditTemplateAllowed: boolean;
}

export const OrderCell: FC<IOrderCellProps> = ({
  id,
  templateField,
  handleOrderChange,
  isFirst,
  isLast,
  disabledArrowIndexes,
  isEditTemplateAllowed,
}) => {
  const updateOrder = (order: number) => {
    handleOrderChange(order, templateField);
  };

  return (
    <Flex gap={'1rem'} align='center'>
      <DzBox style={{ width: '2.5rem', textAlign: 'center' }}>
        <OrderNumber order={id} handleOrderChange={updateOrder} />
      </DzBox>
      <Flex vertical gap={'0.25rem'}>
        <OrderUpArrow
          isFirst={isFirst}
          handleOrderChange={() => updateOrder(id - 1)}
          disabled={disabledArrowIndexes.up === id - 1 || !isEditTemplateAllowed}
        />
        <OrderDownArrow
          isLast={isLast}
          handleOrderChange={() => updateOrder(id + 1)}
          disabled={disabledArrowIndexes.down === id - 1 || !isEditTemplateAllowed}
        />
      </Flex>
    </Flex>
  );
};
