import React, { useState } from 'react';
import { Button } from '@/uicomponents/button';
import { Text } from '@/uicomponents/text';
import { Flex } from '@/uicomponents/layout';
import { DzBox } from '@/components/layout/v1';
import { FileItemType } from './file-manager';
import { Checkbox } from '@/uicomponents/form/input';
import { DeleteIcon, DownloadIcon } from '@/uicomponents/icons/svgs';

interface FileItemProps {
  file: FileItemType;
  onSelect: (fileId: string, isDisabled: boolean) => void;
  onDelete?: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
}

export const FileItem: React.FC<FileItemProps> = ({ file, onSelect, onDelete, onDownload }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <DzBox
      style={{
        marginBottom: '0.5rem',
        padding: '0.75rem',
        borderRadius: '0.375rem',
        backgroundColor:
          (file.selected ?? !file.isDisabled) || isHovering ? '#EBF3FE' : 'transparent',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Flex justify='space-between' align='center'>
        <Flex align='center' gap='0.75rem' style={{ flex: 1 }}>
          <Checkbox
            checked={file.selected ?? !file.isDisabled} // Use selected if available, otherwise invert isDisabled
            onChange={(e) => onSelect(file.id, e.target.checked)}
          />
          <DzBox style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#374151',
                margin: 0,
              }}
            >
              {file.name}
            </Text>
          </DzBox>
        </Flex>

        <Flex align='center' gap='0.5rem'>
          {onDelete && (
            <DzBox
              style={{
                backgroundColor: '#fff',
                borderRadius: '5px',
                padding: '0.25rem 0.5rem',
                border: '1px solid #ddd',
                cursor: 'pointer',
              }}
              onClick={() => onDelete(file.id)}
            >
              <DeleteIcon />
            </DzBox>
          )}
          {onDownload && (
            <DzBox
              style={{
                backgroundColor: '#fff',
                borderRadius: '5px',
                padding: '0.25rem 0.5rem',
                border: '1px solid #ddd',
                cursor: 'pointer',
              }}
              onClick={() => onDownload(file.id)}
            >
              <DownloadIcon />
            </DzBox>
          )}
        </Flex>
      </Flex>
    </DzBox>
  );
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
