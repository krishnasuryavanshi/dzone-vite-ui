import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { CLR_WHITE } from '@/lib/constants';
import { DzentChatFilePreviewTrigger } from '@/uicomponents/icons/svgs';
import React, { CSSProperties, useState } from 'react';
import { FilesPreviewHeader, FileType } from './files-preview-header';
import { FilesPreview } from './files-preview';

const ContainerStyle: CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0,
  zIndex: 1000,
  backgroundColor: CLR_WHITE,
  borderRadius: '5px',
  padding: '1rem',
};

export const FilesPreviewContainer = () => {
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<FileType>('all');

  const handleFilePreviewToggle = (isOpen: boolean) => {
    setIsFilePreviewOpen(isOpen);
  };

  const handleFileTypeChange = (fileType: FileType) => {
    setSelectedFileType(fileType);
  };

  return (
    <>
      <DzBox
        // onClick={() => handleFilePreviewToggle(!isFilePreviewOpen)}
        style={{ cursor: 'pointer' }}>
        <DzentChatFilePreviewTrigger />
      </DzBox>
      <Hideable show={isFilePreviewOpen}>
        <DzBox style={ContainerStyle}>
          <DzBox style={{ height: '100%' }}>
            <DzBox>
              <FilesPreviewHeader
                type={selectedFileType}
                onTypeChange={handleFileTypeChange}
                onClose={() => handleFilePreviewToggle(false)}
              />
            </DzBox>
            <DzBox
              style={{
                height: 'calc(100% - 5rem)',
                overflowY: 'auto',
                marginTop: '1rem',
              }}>
              <FilesPreview type={selectedFileType} />
            </DzBox>
          </DzBox>
        </DzBox>
      </Hideable>
    </>
  );
};
