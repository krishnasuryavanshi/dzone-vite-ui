import { Button } from '@/uicomponents';
import { FC } from 'react';

interface JobTitleAddButtonProps {
  onAdd: () => void;
  disabled: boolean;
}

export const JobTitleAddButton: FC<JobTitleAddButtonProps> = ({
  onAdd,
  disabled,
}) => {
  return (
    <Button type='primary' size='small' onClick={onAdd} disabled={disabled}>
      Add
    </Button>
  );
};
