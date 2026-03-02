'use client';
import { DeleteOutlined } from '@/uicomponents/icons';
import { Tooltip } from '@/uicomponents';
import { FC } from 'react';

interface IDeleteFieldButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const DeleteFieldButton: FC<IDeleteFieldButtonProps> = ({
  onClick,
  disabled,
}) => {
  const button = (
    <DeleteOutlined
      style={{
        color: disabled ? '#d9d9d9' : 'red',
        fontSize: '1.5rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={disabled ? undefined : onClick}
    />
  );

  if (disabled) {
    return (
      <Tooltip title='Custom fields cannot be deleted after a line item has gone Live to protect historical lead data'>
        {button}
      </Tooltip>
    );
  }

  return button;
};
