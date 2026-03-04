import { DzBox } from '@/components/layout/v1';
import React, { useMemo } from 'react';
import { FileType } from './files-preview-header';
import { FilePreview, Hideable, MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { CLR_GRAY_4 } from '@/lib/constants';
import { Text } from '@/uicomponents/text';
import { Flex } from '@/uicomponents/layout';
import { useConversationFilesQuery } from '../../../hooks';

type FilesPreviewProps = {
  type: FileType;
};

const FileTypes = {
  documents: ['document'],
  images: ['image'],
};

export const FilesPreview = ({ type }: FilesPreviewProps) => {
  const { data: filesResponse } = useConversationFilesQuery('12345'); // TODO: Example conversation ID
  const uploadedFiles: DzRecord[] = filesResponse?.data ?? [];

  const filteredFiles = useMemo(() => {
    if (type === 'all') return uploadedFiles;
    const fileTypes = FileTypes[type as keyof typeof FileTypes];
    return uploadedFiles.filter((file) => fileTypes.includes(file.type));
  }, [type, uploadedFiles]);

  const renderFile = (file: DzRecord) => {
    return <FilePreview file={file} />;
  };

  return (
    <DzBox>
      <Hideable show={!filteredFiles.length}>
        <Text style={{ color: CLR_GRAY_4 }}>No Files</Text>
      </Hideable>
      <Hideable show={filteredFiles.length > 0}>
        <Flex vertical gap='0.5rem'>
          <MapFunction items={filteredFiles} renderItem={renderFile} />
        </Flex>
      </Hideable>
    </DzBox>
  );
};
