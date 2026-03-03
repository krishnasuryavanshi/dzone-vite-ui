import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { convertFromBytes } from '@/lib/utils';
import { fileDownload } from '@/services/file-download';
import {
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileOutlined,
} from '@/uicomponents/icons';
import { Button } from '@/uicomponents/index';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';

type FilePreviewProps = {
  file: DzRecord;
  handleRemoveFile?: (file: DzRecord) => void;
  variant?: 'light' | 'transparent';
};

export const FilePreview = ({
  file,
  handleRemoveFile,
  variant,
}: FilePreviewProps) => {
  const handleDownloadFile = async () => {
    const res = await fileDownload(file.id);
  };

  const handleDeleteFile = (file: DzRecord) => {
    if (handleRemoveFile) {
      handleRemoveFile(file);
    }
  };

  return (
    <DzBox
      style={{
        borderRadius: '5px',
        border: '1px solid rgba(35, 90, 237, 0.16)',
        padding: '1rem',
        width: '100%',
        background: variant === 'light' ? '#fff' : 'transparent',
      }}>
      <Flex
        justify='space-between'
        gap={'1rem'}
        align='center'
        style={{ width: '100%' }}>
        <Flex gap={'0.5rem'} align='center'>
          <DzBox
            style={{
              borderRadius: '5px',
              border: '1px solid rgba(35, 90, 237, 0.16)',
              padding: '0.5rem',
            }}>
            <FileOutlined style={{ fontSize: '2rem', color: '#3D71FB' }} />
          </DzBox>
          <DzBox style={{ flex: 1 }}>
            <Hideable show={file.variant !== 'error'}>
              <Flex vertical gap='0.25rem'>
                <DzBox>
                  <Text
                    strong
                    ellipsis
                    title={file.name}
                    style={{ maxWidth: '10rem' }}>
                    {file.name}
                  </Text>
                </DzBox>
                <DzBox>
                  <Text type='secondary'>
                    {typeof file.size === 'number'
                      ? convertFromBytes(file.size)
                      : file.size}
                  </Text>
                </DzBox>
              </Flex>
            </Hideable>
            <Hideable show={file.variant === 'error'}>
              <Flex vertical gap='0.25rem'>
                <Text type='danger'>{file.error || 'Upload unsuccessful'}</Text>
              </Flex>
            </Hideable>
          </DzBox>
        </Flex>
        <Flex gap='0.5rem'>
          <Hideable show={file.variant !== 'error'}>
            <Button
              style={{ border: '1px solid #DDD', background: '#FFF' }}
              icon={<DownloadOutlined />}
              onClick={handleDownloadFile}
            />
            <Hideable show={!!handleRemoveFile}>
              <Button
                style={{ border: '1px solid #DDD', background: '#FFF' }}
                icon={<DeleteOutlined />}
                onClick={() => handleDeleteFile(file)}
                danger
              />
            </Hideable>
          </Hideable>
          <Hideable show={file.variant === 'error' && !!handleRemoveFile}>
            <Button
              style={{ border: '1px solid #DDD', background: '#FFF' }}
              icon={<CloseOutlined />}
              onClick={() => handleDeleteFile(file)}
            />
          </Hideable>
        </Flex>
      </Flex>
    </DzBox>
  );
};
