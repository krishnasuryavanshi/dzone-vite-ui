import React, { FC } from 'react';
import { Flex } from '@/uicomponents/layout';
import { DzBox } from '@/components/layout/v1';

interface IFilesContainerProps {
  show: boolean;
}
export const FilesContainer: FC<IFilesContainerProps> = ({ show }) => {
  if (!show) return null;

  return (
    <Flex vertical gap='0.75rem'>
      <DzBox dzOneBox>
        <div style={{ height: '40vh', width: '100%' }}></div>
      </DzBox>
    </Flex>
  );
};
