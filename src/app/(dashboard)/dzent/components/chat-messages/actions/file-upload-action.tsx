import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { DZONE_CLR_BLACK, CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { UploadFile, UploadProps } from '@/lib/types/uicomponents';
import { fileSortAndUpload } from '@/lib/utils';
import { DraggerUpload, FormInstance, Text, Upload } from '@/uicomponents';
import { UploadOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { AttachmentGrid } from '../../chat-widget/footer-content';
import { ChatWidgetActionButton } from '../../chat-widget/chat-widget-action-button';
import { useDzentStore } from '../../../store';

type FileUploadActionProps = {
  config?: DzRecord;
  name: string;
  form: FormInstance;
  multiple?: boolean;
};

export const FileUploadAction = ({
  config = {
    accept: '*',
    maxFileSize: '2MB',
    fileTypeName: 'chat-file',
  },
  form,
  name,
  multiple,
}: FileUploadActionProps) => {
  const { tenantCode } = useDzentStore();
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<DzRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    form.setFieldValue(name, uploadedFiles?.length ? uploadedFiles : null);
  }, [uploadedFiles]);

  const beforeUpload = () => {
    return false;
  };

  const handleFileSelectionChange = async (fileObj: DzRecord) => {
    setFileList(fileObj?.fileList || []);
    setIsLoading(true);
    const isUploaded = await handleFileUpload(fileObj);
    if (isUploaded) {
      setFileList([]);
    }
    setIsLoading(false);
  };

  const deboncedHandleFileChanges = debounce(handleFileSelectionChange, 1000);

  const handleFileChanges = (fileObj: DzRecord) => {
    deboncedHandleFileChanges(fileObj);
  };

  const handleFileUpload = async (fileObject: DzRecord) => {
    try {
      const uploadedFiles = await fileSortAndUpload(
        fileObject,
        { size: config?.maxFileSize },
        tenantCode as string,
        config?.fileTypeName || 'chat-file',
      );
      if (uploadedFiles?.length) {
        if (multiple) {
          setUploadedFiles((prev) => [...prev, ...uploadedFiles]);
        } else {
          setUploadedFiles(uploadedFiles);
        }
        setFileList([]);
      }
    } catch (error) {}
    return true;
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.filter((uploadedFile) => uploadedFile.id !== fileId),
    );
  };

  const props: UploadProps = {
    accept: config?.accept,
    fileList: fileList as UploadFile<any>[],
    onChange: handleFileChanges,
    beforeUpload: beforeUpload,
    showUploadList: false,
  };

  return (
    <Flex vertical gap='1rem'>
      <Hideable show={!!multiple}>
        <DraggerUpload
          multiple
          {...props}
          disabled={isLoading}
          style={{
            width: '20rem',
            background: CLR_WHITE,
            opacity: isLoading ? 0.5 : 1,
          }}>
          <DzBox className='ant-upload-drag-icon'>
            <UploadOutlined />
          </DzBox>
          <Text className='ant-upload-text' text14>
            Drop file to upload or{' '}
            <Text underline style={{ color: DZONE_CLR_BLACK }} text14>
              browse
            </Text>
          </Text>
        </DraggerUpload>
      </Hideable>
      <Hideable show={!multiple}>
        <Upload {...props} disabled={isLoading}>
          <ChatWidgetActionButton
            label={'Upload'}
            focused
            loading={isLoading}
          />
        </Upload>
      </Hideable>
      <Hideable show={uploadedFiles?.length > 0}>
        <DzBox style={{ width: '25rem' }}>
          <AttachmentGrid
            attachments={uploadedFiles}
            handleRemoveFile={handleRemoveFile}
            fullwidth
          />
        </DzBox>
      </Hideable>
    </Flex>
  );
};
