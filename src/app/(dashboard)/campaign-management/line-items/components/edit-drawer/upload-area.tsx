import React from 'react';
import { Button } from '@/uicomponents/button';
import { Text } from '@/uicomponents/text';
import { Flex } from '@/uicomponents/layout';
import { DzBox } from '@/components/layout/v1';
import { Upload } from '@/uicomponents/upload';
import { UploadIcon } from '@/uicomponents/icons/svgs';
import Dragger from 'antd/es/upload/Dragger';

interface UploadAreaProps {
  onFileUpload: (files: FileList) => void;
  dragOver: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  acceptedFileTypes: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const UploadArea: React.FC<UploadAreaProps> = ({
  onFileUpload,
  dragOver,
  onDrop,
  onDragOver,
  onDragLeave,
  acceptedFileTypes,
  fileInputRef,
}) => {
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dragger>
      <Flex vertical>
        <UploadIcon />
        <Text className='ant-upload-text'>
          Drop file to upload or <a>browse</a>
        </Text>
      </Flex>
    </Dragger>
  );
};
