import { DzBox } from '@/components/layout/v1';
import { FilePreview, Hideable, MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import React from 'react';

type FilesContentProps = {
  files: DzRecord[];
  children?: React.ReactNode;
};

export const FilesContent = ({ files, children }: FilesContentProps) => {
  const renderFile = (file: DzRecord) => {
    return <FilePreview file={file} variant='light' />;
  };

  return (
    <Hideable show={files.length > 0}>
      <Flex vertical gap='0.5rem'>
        <DzBox>{children}</DzBox>
        <MapFunction items={files} renderItem={renderFile} />
      </Flex>
    </Hideable>
  );
};
