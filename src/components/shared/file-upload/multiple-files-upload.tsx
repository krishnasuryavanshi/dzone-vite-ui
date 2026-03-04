import React, { useState } from 'react';
import { Upload, Typography, Progress, message } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import { Flex, Space } from '@/uicomponents/layout';
import { UploadIcon } from '@/uicomponents/icons/svgs';

const { Dragger } = Upload;
const { Text } = Typography;

interface MultiFileUploadProps {
  uploadProps: any;
  maxFiles: number;
  value?: UploadFile[];
}

export const MultipleFilesUpload: React.FC<MultiFileUploadProps> = ({
  uploadProps,
  maxFiles,
  value,
}) => {
  const handleRemove = (file: UploadFile) => {
    if (uploadProps?.onRemove) {
      uploadProps.onRemove(file);
    }
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Dragger {...uploadProps} fileList={value}>
        <Flex vertical>
          <UploadIcon />
          <Text className='ant-upload-text'>
            Drop file to upload or <a>browse</a>
          </Text>
        </Flex>
      </Dragger>

      {value
        ? value?.map((file) => (
            <Flex
              key={file.uid}
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: 8,
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Flex style={{ flex: 1 }}>
                <Text strong>{file.name}</Text>
                <br />
                {file.status === 'uploading' && (
                  <Progress percent={file.percent || 0} size='small' strokeColor='#52c41a' />
                )}
              </Flex>
              {(file.status === 'uploading' || file.status === 'done') && (
                <DeleteOutlined
                  onClick={() => handleRemove(file)}
                  style={{ color: '#f5222d', fontSize: 16, marginLeft: 10 }}
                />
              )}
            </Flex>
          ))
        : null}
    </Space>
  );
};
