import { DZONE_CLR_BLACK } from '@/lib/constants';
import { Button } from '@/uicomponents/button';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';
import { useTemplateStore } from '../../../stores';

interface IActionCellProps {
  index: number;
  isDisabled: boolean;
}

export const ActionCell: FC<IActionCellProps> = ({ index, isDisabled }) => {
  const { selectField } = useTemplateStore();

  const handleFieldSelection = () => {
    selectField(index);
  };

  return (
    <Button
      onClick={handleFieldSelection}
      type='link'
      disabled={isDisabled}
      style={{
        pointerEvents: isDisabled ? 'none' : 'auto',
      }}>
      <Text
        style={{
          textDecoration: isDisabled ? 'none' : 'underline',
          color: isDisabled ? '#A9A9A9' : `${DZONE_CLR_BLACK}`,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}>
        More
      </Text>
    </Button>
  );
};
