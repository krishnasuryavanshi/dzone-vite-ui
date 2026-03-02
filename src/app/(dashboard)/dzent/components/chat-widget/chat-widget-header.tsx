import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FilesPreviewContainer } from './files-preview';

export const ChatWidgetHeader = () => {
  return (
    <DzBox style={{ padding: '0.5rem 0' }}>
      <Flex justify='end'>
        <FilesPreviewContainer />
      </Flex>
    </DzBox>
  );
};
