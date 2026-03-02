import { DzBox } from '@/components/layout/v1';
import React, { useEffect, useState } from 'react';
import { FileType } from './files-preview-header';
import { FilePreview, Hideable, MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { CLR_GRAY_4 } from '@/lib/constants';
import { Text } from '@/uicomponents/text';
import { Flex } from '@/uicomponents/layout';
import { fetchConversationFiles } from '../../../services';

type FilesPreviewProps = {
  type: FileType;
};

const FileTypes = {
  documents: ['document'],
  images: ['image'],
};

export const FilesPreview = ({ type }: FilesPreviewProps) => {
  const [filteredFiles, setFilteredFiles] = useState<DzRecord[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<DzRecord[]>([]);

  useEffect(() => {
    fetchFilesInConversation('12345'); // TODO: Example conversation ID
  }, []);

  useEffect(() => {
    let filesToFilter = uploadedFiles;

    if (type !== 'all') {
      const fileTypes = FileTypes[type as keyof typeof FileTypes];
      filesToFilter = uploadedFiles.filter((file) =>
        fileTypes.includes(file.type),
      );
    }

    setFilteredFiles(filesToFilter);
  }, [type, uploadedFiles]);

  const fetchFilesInConversation = async (conversationId: string) => {
    try {
      const { data } = await fetchConversationFiles(conversationId);
      if (data?.length) {
        setUploadedFiles(data);
      }
    } catch (error) {}
  };

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
