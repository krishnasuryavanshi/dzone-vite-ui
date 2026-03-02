'use client';

import {
  CloseOutlined,
  FileImageOutlined,
  FileTextOutlined,
} from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Progress } from '@/uicomponents';
import { Hideable } from '@/components/shared';
import { FileAttachment } from '../lib/types';
import { getDocumentLabel, isImageFile } from '../lib/utils/file-utils';
import styles from './attachment-preview.module.css';

interface AttachmentPreviewProps {
  attachments: FileAttachment[];
  onRemove: (id: string) => void;
}

interface AttachmentItemProps {
  attachment: FileAttachment;
  onRemove: (id: string) => void;
}

const AttachmentItem = ({ attachment, onRemove }: AttachmentItemProps) => {
  const isUploading = attachment.status === 'uploading';
  const isError = attachment.status === 'error';
  const isImage = isImageFile(attachment.type, attachment.name);
  const FileIcon = isImage ? FileImageOutlined : FileTextOutlined;

  return (
    <div className={styles.thumbnailWrapper}>
      <div
        className={`${styles.thumbnail} ${isError ? styles.thumbnailError : ''}`}
        title={attachment.name}>
        <Flex
          vertical
          align='center'
          justify='center'
          className={styles.documentPreview}>
          <FileIcon className={styles.documentIcon} />
          <span className={styles.documentType}>
            {getDocumentLabel(attachment.name)}
          </span>
        </Flex>

        <Hideable show={isUploading}>
          <div className={styles.progressOverlay} />
          <div className={styles.progressWrapper}>
            <Progress
              type='circle'
              percent={attachment.progress || 0}
              size={24}
              strokeColor='#323131'
              trailColor='rgba(0, 0, 0, 0.1)'
              showInfo={false}
              strokeWidth={8}
            />
          </div>
        </Hideable>
      </div>

      <button
        className={styles.removeButton}
        onClick={() => onRemove(attachment.id)}
        type='button'
        aria-label={`Remove ${attachment.name}`}>
        <CloseOutlined className={styles.removeIcon} />
      </button>
    </div>
  );
};

export const AttachmentPreview = ({
  attachments,
  onRemove,
}: AttachmentPreviewProps) => {
  return (
    <Hideable show={attachments.length > 0}>
      <Flex wrap='wrap' gap='0.5rem' className={styles.container}>
        {attachments.map((attachment) => (
          <AttachmentItem
            key={attachment.id}
            attachment={attachment}
            onRemove={onRemove}
          />
        ))}
      </Flex>
    </Hideable>
  );
};
