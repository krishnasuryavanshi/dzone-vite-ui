import { Translate } from '@/components/i18n';
import { UploadProps } from '@/lib/types/uicomponents';
import { DraggerUpload } from '@/uicomponents';
import { InboxOutlined } from '@/uicomponents/icons';
import { FC } from 'react';

interface IUploadButtonRowProps {
  uploadProps: UploadProps;
  fileName?: string;
}

export const UploadButtonRow: FC<IUploadButtonRowProps> = ({
  uploadProps,
  fileName,
}) => {
  return (
    <DraggerUpload {...uploadProps}>
      <p className='ant-upload-drag-icon'>
        <InboxOutlined />
      </p>
      <p className='ant-upload-text' style={{ fontSize: '1rem' }}>
        <Translate i18nKey='Click to select the file' />
      </p>
      {fileName ? (
        <p className='ant-upload-hint' style={{ fontSize: '0.75rem' }}>
          <Translate i18nKey='File: ' />
          {fileName}
        </p>
      ) : (
        <p className='ant-upload-hint' style={{ fontSize: '0.75rem' }}>
          <Translate i18nKey='Supported Formats:' />{' '}
          {uploadProps?.accept?.replaceAll('.', '').replaceAll(',', ', ')}
        </p>
      )}
    </DraggerUpload>
  );
};
