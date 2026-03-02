'use client';

import { CloudUploadOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { Hideable } from '@/components/shared';
import styles from './drop-zone-overlay.module.css';

interface DropZoneOverlayProps {
  isVisible: boolean;
}

export const DropZoneOverlay = ({ isVisible }: DropZoneOverlayProps) => {
  return (
    <Hideable show={isVisible}>
      <Flex
        className={styles.overlay}
        vertical
        align='center'
        justify='center'
        gap='0.5rem'>
        <CloudUploadOutlined className={styles.icon} />
        <Text className={styles.text}>Drop files here to upload</Text>
      </Flex>
    </Hideable>
  );
};
