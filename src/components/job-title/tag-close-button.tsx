import { CloseOutlined } from '@/uicomponents/icons';
import { FC } from 'react';

interface TagCloseButtonProps {
  show: boolean;
  onClose: (e: React.MouseEvent) => void;
}

export const TagCloseButton: FC<TagCloseButtonProps> = ({ show, onClose }) => {
  if (!show) return null;

  return <CloseOutlined style={{ width: '0.625rem' }} onClick={onClose} />;
};
