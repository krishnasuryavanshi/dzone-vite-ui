import { Button } from '@/uicomponents';
import { PlusOutlined } from '@/uicomponents/icons';
import { FC } from 'react';

interface IAddQuestionButtonProps {
  add: () => void;
}

export const AddQuestionButton: FC<IAddQuestionButtonProps> = ({ add }) => {
  return (
    <Button
      type='primary'
      style={{ marginBottom: '0.5rem', boxShadow: 'none' }}
      onClick={add}
      icon={<PlusOutlined />}>
      Add Question
    </Button>
  );
};
