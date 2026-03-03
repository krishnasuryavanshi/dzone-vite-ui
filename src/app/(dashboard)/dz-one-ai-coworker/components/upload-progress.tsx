
import { Progress } from '@/uicomponents';
import { CloseOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { Hideable } from '@/components/shared';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  fileCount: number;
  onCancel?: () => void;
}

export const UploadProgress = ({
  isUploading,
  progress,
  fileCount,
  onCancel,
}: UploadProgressProps) => {
  return (
    <Hideable show={isUploading && fileCount > 0}>
      <Flex
        align='center'
        gap='0.75rem'
        style={{
          padding: '0.5rem 1rem',
          borderBottom: '1px solid #f0f0f0',
        }}>
        <Flex vertical style={{ flex: 1 }}>
          <Text style={{ fontSize: '0.75rem', color: '#595959' }}>
            Uploading {fileCount} file{fileCount > 1 ? 's' : ''}...
          </Text>
          <Progress
            percent={progress}
            size='small'
            strokeColor='#235aed'
            showInfo={false}
            style={{ marginBottom: 0 }}
          />
        </Flex>
        <Hideable show={!!onCancel}>
          <CloseOutlined
            onClick={onCancel}
            style={{
              fontSize: '0.875rem',
              color: '#8c8c8c',
              cursor: 'pointer',
            }}
          />
        </Hideable>
      </Flex>
    </Hideable>
  );
};
