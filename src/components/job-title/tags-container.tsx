import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { TagItem } from './tag-item';

interface ITagsContainerProps {
  value: Record<string, any>[];
  show: boolean;
  handleModeChange: (enableEditMode: boolean) => void;
  removeTag: (tag: Record<string, any>) => void;
}

export const TagsContainer: FC<ITagsContainerProps> = ({
  value,
  show,
  handleModeChange,
  removeTag,
}) => {
  if (!show) return null;

  return (
    <Flex
      align='center'
      onClick={() => handleModeChange(true)}
      style={{
        border: '1px solid d4d4d4',
        backgroundColor: '#fff',
        boxShadow: '0px 0px 4px 0px rgba(0, 0, 0, 0.25) inset',
        borderRadius: '8px',
        paddingInline: '0.625rem',
        height: '3rem',
        cursor: 'pointer',
      }}>
      <TagItem
        text={value?.[0]?.text}
        type={value?.[0]?.type}
        onClose={() => removeTag(value?.[0])}
        variant='small'
        show={value?.length > 0}
      />
      <TagItem
        text={value?.[1]?.text}
        type={value?.[1]?.type}
        onClose={() => removeTag(value?.[1])}
        variant='small'
        show={value?.length > 1}
      />
      <TagItem
        show={value?.length > 2}
        text={`+ ${value?.length - 2} more`}
        type='custom'
        variant='small'
      />
    </Flex>
  );
};
