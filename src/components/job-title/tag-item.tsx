import { Flex } from '@/uicomponents/layout';
import { Tag } from '@/uicomponents/tag';
import { Text, Tooltip } from '@/uicomponents';
import { TagCloseButton } from './tag-close-button';
import { FC, useEffect, useState } from 'react';
import { JobTitleTokenType } from '@/app/(dashboard)/campaign-management/line-items/lib/enums';
import { DzBox } from '@/components/layout/v1';

interface ITagItemProps {
  text: string;
  type: string;
  variant?: 'default' | 'small'; // preview = small, input = default
  onClose?: () => void;
  onEdit?: () => void;
  show?: boolean;
}

const colorMap: Record<string, string> = {
  [JobTitleTokenType.UserEntered]: 'green',
  [JobTitleTokenType.AIRecommended]: 'blue',
};

export const TagItem: FC<ITagItemProps> = ({
  text,
  type,
  variant = 'default',
  onClose,
  onEdit,
  show = true,
}) => {
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    setColor(colorMap[type]);
  }, [type]);

  if (!show) return null;

  if (type === 'custom') {
    return (
      <TagElement
        type={type}
        color={color}
        text={text}
        variant={variant}
        onClose={onClose}
        onEdit={onEdit}
      />
    );
  }

  return (
    <Tooltip placement='right' title={text} arrow={true}>
      <DzBox>
        <TagElement
          type={type}
          color={color}
          text={text}
          variant={variant}
          onClose={onClose}
          onEdit={onEdit}
        />
      </DzBox>
    </Tooltip>
  );
};

interface TagElementProps {
  type: string;
  color: string;
  text: string;
  variant: string;
  onClose?: () => void;
  onEdit?: () => void;
}

const TagElement: FC<TagElementProps> = ({ type, color, text, variant, onClose, onEdit }) => {
  const handleClose = (e: any) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  const handleEdit = () => {
    if (onEdit && type === JobTitleTokenType.UserEntered) {
      onEdit();
    }
  };

  return (
    <Tag
      color={color}
      style={{
        fontSize: '1rem',
        border: 'none',
        ...(color ? {} : { backgroundColor: 'rgba(0,0,0,0.06)' }),
      }}
    >
      <Flex gap={'0.25rem'}>
        <Text
          style={{
            maxWidth: variant === 'small' ? '5rem' : '15rem',
            color: 'inherit',
            fontSize: 'inherit',
          }}
          className='ellipsis-text'
          onClick={handleEdit}
        >
          {text}
        </Text>
        <TagCloseButton onClose={handleClose} show={!!onClose} />
      </Flex>
    </Tag>
  );
};
