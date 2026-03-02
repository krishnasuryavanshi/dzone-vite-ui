import { Button } from '@/uicomponents';
import { FC } from 'react';

interface IGotItButtonProps {
  onClose: () => void;
}

export const GotItButton: FC<IGotItButtonProps> = ({ onClose }) => {
  return (
    <Button
      type='primary'
      size='small'
      style={{ alignSelf: 'end', boxShadow: 'none' }}
      onClick={onClose}>
      Got it
    </Button>
  );
};
