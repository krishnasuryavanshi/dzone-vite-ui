import { Flex } from '@/uicomponents/layout';
import { ChatWidgetIcon } from '@/uicomponents/icons/svgs';
import styles from './streaming-indicator.module.css';

export const StreamingIndicator = () => {
  return (
    <Flex className={styles.glowContainer}>
      <ChatWidgetIcon />
    </Flex>
  );
};
