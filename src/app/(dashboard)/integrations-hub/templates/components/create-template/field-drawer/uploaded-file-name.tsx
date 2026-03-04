import { DeleteOutlined, DownloadOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC, useState } from 'react';
import { IDataMapperFileDetails } from '../../../lib/types';
import { downloadDataMapperFile } from '../../../services/download-data-mapper-file';
import { saveFileFromBlob } from '@/lib/utils';
import { showNotification } from '@/services/notification';

interface IUploadedFileNameProps {
  file: IDataMapperFileDetails | null;
  removeFile: () => void;
  isDisabled?: boolean;
}

export const UploadedFileName: FC<IUploadedFileNameProps> = ({ file, removeFile, isDisabled }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  if (!file?.fileName || !file?.id) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { data, headers } = await downloadDataMapperFile(file?.id);
      if (data) {
        const fileName = headers.get('content-disposition').split('filename=')[1];
        saveFileFromBlob(data, fileName.replaceAll('"', ''), headers.get('content-type'));
      }
    } catch (error) {
      showNotification({
        message: 'Failed to download data mapper file',
        type: 'error',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Flex align='center' gap='0.5rem'>
      <Text
        style={{
          color: '#235AED',
          display: 'inline',
          maxWidth: '15rem',
          textDecoration: 'underline',
        }}
        className='ellipsis-text'
      >
        {file?.fileName}
      </Text>
      <DownloadOutlined
        disabled={isDownloading}
        style={{ color: '#235AED', cursor: 'pointer' }}
        onClick={handleDownload}
      />
      <DeleteOutlined style={{ color: '#ED2326' }} onClick={removeFile} disabled={isDisabled} />
    </Flex>
  );
};
