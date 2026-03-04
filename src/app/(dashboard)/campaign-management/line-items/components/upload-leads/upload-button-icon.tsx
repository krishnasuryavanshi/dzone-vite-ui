import { Translate } from '@/components/i18n';
import { LoadingOutlined, UploadOutlined } from '@/uicomponents/icons';
import { FC } from 'react';

interface IUploadButtonIconProps {
  isLoading: boolean;
  label?: string;
}

export const UploadButtonIcon: FC<IUploadButtonIconProps> = ({ isLoading, label = 'upload' }) => {
  if (isLoading) {
    return <LoadingOutlined style={{ marginLeft: '0.5rem' }} />;
  }

  return (
    <>
      <Translate i18nKey={label} />
      <UploadOutlined style={{ marginLeft: '0.5rem' }} />
    </>
  );
};
