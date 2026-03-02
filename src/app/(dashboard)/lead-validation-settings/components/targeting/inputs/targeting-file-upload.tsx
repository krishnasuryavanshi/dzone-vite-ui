import { DzRecord } from '@/lib/types';
import { UploadFile } from '@/lib/types/uicomponents';
import { UploadOutlined } from '@/uicomponents/icons';
import { Button, Upload } from '@/uicomponents/index';
import { Flex } from '@/uicomponents/layout';
import { debounce } from 'lodash';
import { useState } from 'react';

type TargetingFileUploadProps = {
  acceptedFileTypes?: string[];
  onFileChange: (file: any) => Promise<boolean>;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export const TargetingFileUpload = ({
  acceptedFileTypes,
  onFileChange,
  isDisabled,
  isLoading,
}: TargetingFileUploadProps) => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  const beforeUpload = () => {
    return false;
  };

  const handleFileSelectionChange = async (fileObj: DzRecord) => {
    setFileList(fileObj?.fileList || []);
    const isUploaded = await onFileChange(fileObj);
    if (isUploaded) {
      setFileList([]);
    }
  };

  const deboncedHandleFileChanges = debounce(handleFileSelectionChange, 1000);

  const handleFileChanges = (fileObj: DzRecord) => {
    deboncedHandleFileChanges(fileObj);
  };

  return (
    <Flex align='center' gap='0.5rem'>
      <Upload
        accept={
          acceptedFileTypes?.length ? `.${acceptedFileTypes?.join(',.')}` : ''
        }
        fileList={fileList as UploadFile<any>[]}
        multiple
        onChange={handleFileChanges}
        beforeUpload={beforeUpload}
        showUploadList={false}>
        <Button
          type='primary'
          icon={<UploadOutlined />}
          disabled={isDisabled}
          loading={isLoading}>
          Upload
        </Button>
      </Upload>
    </Flex>
  );
};
