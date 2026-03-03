
import React from 'react';
import { Upload, Button } from '@/uicomponents';
import { Text } from '@/uicomponents/text';
import { Space } from '@/uicomponents/layout/space';
import { UploadFile, UploadProps } from '@/lib/types/uicomponents';
import {
  UploadOutlined,
  FileOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

interface FtpFileUploadSectionProps {
  fileList: UploadFile[];
  isUploading: boolean;
  uploadProps: UploadProps;
  onRemoveFile: () => void;
}

export const FtpFileUploadSection: React.FC<FtpFileUploadSectionProps> = ({
  fileList,
  isUploading,
  uploadProps,
  onRemoveFile,
}) => {
  return (
    <Space direction='horizontal' style={{ width: '100%' }}>
      <Upload {...uploadProps} showUploadList={false}>
        <Button type='primary' icon={<UploadOutlined />} loading={isUploading}>
          {isUploading ? 'Uploading...' : 'Choose File'}
        </Button>
      </Upload>

      {fileList.length > 0 ? (
        <Space style={{ flex: 1 }}>
          <FileOutlined />
          <Text
            ellipsis={{ tooltip: fileList[0].name }}
            style={{ maxWidth: '200px' }}>
            {fileList[0].name}
          </Text>
          <Button
            type='text'
            danger
            size='small'
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemoveFile();
            }}
          />
        </Space>
      ) : (
        <Text type='secondary' style={{ fontSize: '0.875rem' }}>
          No file selected
        </Text>
      )}
    </Space>
  );
};
