import { DownloadOutlined, FileImageOutlined, FileTextOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Hideable } from '@/components/shared';
import { FileAttachment } from '../lib/types';
import { getDocumentLabel, isImageFile } from '../lib/utils/file-utils';
import { fileDownload } from '@/services/file-download/file-download';
import styles from './attachment-preview.module.css';

interface MessageAttachmentPreviewProps {
  attachments: FileAttachment[];
}

interface AttachmentItemProps {
  attachment: FileAttachment;
}

const AttachmentItem = ({ attachment }: AttachmentItemProps) => {
  const isImage = isImageFile(attachment.type, attachment.name);
  const FileIcon = isImage ? FileImageOutlined : FileTextOutlined;

  const handleDownload = async () => {
    await fileDownload(attachment.id);
  };

  return (
    <div className={styles.thumbnailWrapper} onClick={handleDownload}>
      <div className={styles.thumbnail} title={attachment.name}>
        <Flex vertical align='center' justify='center' className={styles.documentPreview}>
          <FileIcon className={styles.documentIcon} />
          <span className={styles.documentType}>{getDocumentLabel(attachment.name)}</span>
        </Flex>
      </div>

      <div className={styles.downloadOverlay} title={`Download ${attachment.name}`}>
        <DownloadOutlined className={styles.downloadIcon} />
      </div>
    </div>
  );
};

export const MessageAttachmentPreview = ({ attachments }: MessageAttachmentPreviewProps) => {
  return (
    <Hideable show={attachments.length > 0}>
      <Flex wrap='wrap' gap='0.5rem' className={styles.messageContainer}>
        {attachments.map((attachment) => (
          <AttachmentItem key={attachment.id} attachment={attachment} />
        ))}
      </Flex>
    </Hideable>
  );
};
