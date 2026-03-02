import { DzBox } from '@/components/layout/v1';
import { DzRecord } from '@/lib/types';
import { UploadFile, UploadProps } from '@/lib/types/uicomponents';
import { fileSortAndUpload } from '@/lib/utils';
import { DZENT_ICON_PURPLE } from '@/lib/constants';
import { PaperClipOutlined } from '@/uicomponents/icons';
import { Upload } from '@/uicomponents/index';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { useDzentStore } from '../../../store';

const AllowedTypes = '.pdf, .docx, .csv, .xlsx, .jpg, .png';
const AllowedFileSize = '10MB';
const FileTypeName = 'chat-file';

type PaperClipProps = {
  disabled?: boolean;
  onAddAttachments: (attachments: DzRecord[]) => void;
  handleFileUploadInProgress: (flag: boolean) => void;
};

export const PaperClip = ({
  disabled,
  onAddAttachments,
  handleFileUploadInProgress,
}: PaperClipProps) => {
  const { tenantCode } = useDzentStore();
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  const handleFileSelectionChange = async (fileObj: DzRecord) => {
    setFileList(fileObj?.fileList || []);
    handleFileUploadInProgress(true);
    const isUploaded = await handleFileUpload(fileObj);
    if (isUploaded) {
      setFileList([]);
    }
    handleFileUploadInProgress(false);
  };

  const deboncedHandleFileChanges = debounce(handleFileSelectionChange, 1000);

  const handleFileChanges = (fileObj: DzRecord) => {
    deboncedHandleFileChanges(fileObj);
  };

  const handleFileUpload = async (fileObject: DzRecord) => {
    try {
      const uploadedFiles = await fileSortAndUpload(
        fileObject,
        { size: AllowedFileSize },
        tenantCode as string,
        FileTypeName,
      );
      if (uploadedFiles?.length) {
        onAddAttachments && onAddAttachments(uploadedFiles);
        setFileList([]);
      }
    } catch (error) {}
    return true;
  };

  const props: UploadProps = {
    accept: AllowedTypes,
    fileList: fileList as UploadFile<any>[],
    onChange: handleFileChanges,
    beforeUpload: () => false,
    showUploadList: false,
    multiple: true,
  };
  return (
    <Upload {...props} disabled={disabled}>
      <DzBox
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}>
        <PaperClipOutlined
          style={{
            color: DZENT_ICON_PURPLE,
            fontSize: '1.25rem',
            opacity: disabled ? 0.5 : 1,
          }}
        />
      </DzBox>
    </Upload>
  );
};
