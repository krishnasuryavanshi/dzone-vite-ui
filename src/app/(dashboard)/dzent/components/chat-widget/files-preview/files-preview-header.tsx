import { DzBox } from '@/components/layout/v1';
import { Button } from '@/uicomponents/button';
import { CloseOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React from 'react';

export type FileType = 'all' | 'documents' | 'images';

type FilesPreviewHeaderProps = {
  type: FileType;
  onTypeChange: (type: FileType) => void;
  onClose: () => void;
};

export const FilesPreviewHeader = ({
  type,
  onTypeChange,
  onClose,
}: FilesPreviewHeaderProps) => {
  return (
    <DzBox style={{ borderBottom: '1px solid #F5F5F5' }}>
      <Flex justify='space-between'>
        <Flex gap='0.25rem' style={{ padding: '0.5rem' }}>
          <Button
            type='text'
            style={{ fontWeight: type === 'all' ? 600 : 400 }}
            onClick={() => onTypeChange('all')}>
            All
          </Button>
          <Button
            type='text'
            style={{ fontWeight: type === 'documents' ? 600 : 400 }}
            onClick={() => onTypeChange('documents')}>
            Documents
          </Button>
          <Button
            type='text'
            style={{ fontWeight: type === 'images' ? 600 : 400 }}
            onClick={() => onTypeChange('images')}>
            Images
          </Button>
        </Flex>
        <DzBox
          style={{ cursor: 'pointer', marginRight: '0.25rem' }}
          onClick={onClose}>
          <CloseOutlined />
        </DzBox>
      </Flex>
    </DzBox>
  );
};
