import { Button, Text, Upload } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { CSSProperties, FC } from 'react';
import './file-upload.scss';
import { UploadButtonContent } from './upload-button-content';
import { DeleteOutlined } from '@/uicomponents/icons';

interface IFileUploadProps {
  value?: { id: string; fileName: string };
  uploadProps: any;
  uploadLabel: string;
  disabled?: boolean;
  uploading?: boolean;
  afterContent?: any;
  afterContentProps?: Record<string, string>;
  inputContainerStyles?: CSSProperties;
  beforeContent?: any;
}

export const FileUpload: FC<IFileUploadProps> = ({
  value,
  uploadProps,
  uploadLabel = 'Upload File',
  disabled = false,
  uploading = false,
  inputContainerStyles,
  beforeContent,
}) => {
  return (
    <Flex gap='.5rem' align='center' style={inputContainerStyles}>
      <Upload
        {...{ ...uploadProps, showUploadList: false, disabled }}
        className='file-upload form-control file-upload-control'
      >
        <Button type='primary' size='large'>
          <UploadButtonContent uploading={uploading} uploadLabel={uploadLabel} />
        </Button>
      </Upload>
      {value && (
        <Text
          style={{
            color: '#235AED',
            display: 'inline',
            maxWidth: '15rem',
            textDecoration: 'underline',
          }}
          className='ellipsis-text'
        >
          {value?.fileName}
        </Text>
      )}
      {value && uploadProps?.onRemove && (
        <DeleteOutlined style={{ color: '#ED2326' }} onClick={uploadProps?.onRemove} />
      )}
    </Flex>
  );
};
