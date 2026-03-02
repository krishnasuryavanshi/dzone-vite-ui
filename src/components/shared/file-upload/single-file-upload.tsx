import { Button, Text, Upload } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { CSSProperties, FC } from 'react';
import './file-upload.scss';
import { UploadButtonContent } from './upload-button-content';
import { DeleteOutlined } from '@/uicomponents/icons';
import { LoaderButton } from '../loader-button';

interface IFileUploadProps {
  value?: { id: string; name: string; type?: string };
  uploadProps: {
    onRemove?: () => void;
    onChange?: (info: any) => void;
    accept?: string;
    beforeUpload?: (file: any) => boolean | Promise<boolean>;
  };
  uploadLabel: string;
  disabled?: boolean;
  uploading?: boolean;
  inputContainerStyles?: CSSProperties;
  isButtonLoading?: boolean;
}

export const SingleFileUpload: FC<IFileUploadProps> = ({
  value,
  uploadProps,
  uploadLabel = 'Upload File',
  disabled = false,
  uploading = false,
  inputContainerStyles,
  isButtonLoading,
}) => {
  return (
    <Flex gap='.5rem' align='center' style={inputContainerStyles}>
      <Upload
        {...{ ...uploadProps, showUploadList: false, disabled }}
        className='file-upload form-control file-upload-control'>
        {isButtonLoading ? (
          <LoaderButton style={{ width: '8.5rem' }} />
        ) : (
          <Button type='primary' size='large'>
            <UploadButtonContent
              uploading={uploading}
              uploadLabel={uploadLabel}
            />
          </Button>
        )}
      </Upload>
      {value && !isButtonLoading && (
        <Text
          style={{
            color: '#235AED',
            display: 'inline',
            maxWidth: '15rem',
            textDecoration: 'underline',
          }}
          className='ellipsis-text'>
          {value?.name}
        </Text>
      )}
      {value &&
        !isButtonLoading &&
        uploadProps?.onRemove &&
        value?.type !== 'io' && (
          <DeleteOutlined
            style={{ color: '#ED2326' }}
            onClick={uploadProps?.onRemove}
          />
        )}
    </Flex>
  );
};
