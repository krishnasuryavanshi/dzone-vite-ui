import { LoadingOutlined, UploadOutlined } from '@/uicomponents/icons';
import { FC } from 'react';

interface IUploadButtonContentProps {
  uploading: boolean;
  uploadLabel: string;
}

export const UploadButtonContent: FC<IUploadButtonContentProps> = ({
  uploading,
  uploadLabel,
}) => {
  if (uploading) {
    return (
      <>
        <span>{'Uploading... '}</span>
        <LoadingOutlined style={{ marginLeft: '0.125rem' }} />
      </>
    );
  }

  return (
    <>
      <span>{uploadLabel}</span>
      <UploadOutlined style={{ marginLeft: '0.5rem' }} />
    </>
  );
};
