import { DzBox } from '@/components/layout/v1';
import { FilePreview, Hideable, MapFunction } from '@/components/shared';
import { useScreenBreakpoint } from '@/lib/hooks';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';

type AttachmentGridProps = {
  fullwidth?: boolean;
  attachments: DzRecord[];
  handleRemoveFile: (fileId: string) => void;
};

export const AttachmentGrid = ({
  attachments,
  handleRemoveFile,
  fullwidth,
}: AttachmentGridProps) => {
  const { currentScreenSize } = useScreenBreakpoint();
  const renderFilePreview = (file: DzRecord) => {
    return (
      <DzBox
        style={{
          width: fullwidth || ['lg', 'md', 'sm', 'xs'].includes(currentScreenSize) ? '100%' : '49%',
        }}
      >
        <FilePreview file={file} handleRemoveFile={() => handleRemoveFile(file.id)} />
      </DzBox>
    );
  };

  return (
    <Hideable show={attachments.length > 0}>
      <DzBox style={{ width: '100%', padding: '0 1rem 0.5rem 1rem' }}>
        <Flex
          vertical={['lg', 'md', 'sm', 'xs'].includes(currentScreenSize) ? true : false}
          className='attachment-grid'
          wrap='wrap'
          gap='0.5rem'
          style={{
            maxHeight: '8rem',
            overflowY: 'auto',
          }}
        >
          <MapFunction items={attachments} renderItem={renderFilePreview} />
        </Flex>
      </DzBox>
    </Hideable>
  );
};
