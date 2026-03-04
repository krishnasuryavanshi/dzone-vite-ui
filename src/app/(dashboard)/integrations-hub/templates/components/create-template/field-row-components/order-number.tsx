import { InputNumber } from '@/uicomponents/form/input';
import { Text } from '@/uicomponents/text';
import { FC, useEffect, useState } from 'react';

interface IOrderNumberProps {
  order: number;
  handleOrderChange: (order: number) => void;
}

export const OrderNumber: FC<IOrderNumberProps> = ({ order, handleOrderChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newOrder, setNewOrder] = useState(order);

  useEffect(() => {
    if (isEditing) {
      setNewOrder(order);
    }
  }, [order, isEditing]);

  const onOrderChange = (value: any) => {
    setNewOrder(value as number);
  };

  const onOrderInputAway = () => {
    handleOrderChange(newOrder);
    setIsEditing(false);
    setNewOrder(order);
  };

  if (isEditing) {
    return (
      <InputNumber
        autoFocus
        size='small'
        controls={false}
        style={{ width: '100%' }}
        value={newOrder}
        onChange={onOrderChange}
        min={1}
        max={99}
        onBlur={onOrderInputAway}
        onPressEnter={onOrderInputAway}
      />
    );
  }

  return (
    <Text style={{ cursor: 'pointer' }} onDoubleClick={() => setIsEditing(true)}>
      {order}
    </Text>
  );
};
