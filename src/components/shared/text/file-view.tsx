import React, { FC } from 'react';
import { Flex } from '@/uicomponents/layout';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from '@/uicomponents/index';
import { TextView } from './text-view';
import { DzBox } from '@/components/layout/v1';

interface IFileViewProps {
  handleDownloadFiles: () => Promise<void>;
  value: { id: string; fileName: string; url: string };
  label: string;
}

export const FileView: FC<IFileViewProps> = ({
  handleDownloadFiles,
  value,
  label,
}) => {
  return (
    <Flex gap={'0.5rem'} align='center'>
      <Button
        type='primary'
        size='small'
        icon={<DownloadOutlined />}
        onClick={handleDownloadFiles}
      />
      <DzBox style={{ flex: 1 }}>
        <TextView label={label} lines={1} value={value.fileName} />
      </DzBox>
    </Flex>
  );
};
