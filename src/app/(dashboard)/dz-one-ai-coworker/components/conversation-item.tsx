'use client';

import { ClockCircleOutlined, MessageOutlined } from '@ant-design/icons';
import { Tooltip } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { Hideable } from '@/components/shared';
import { FC } from 'react';
import { ConversationMetadata } from '../lib/types';
import styles from './conversation-item.module.css';

interface ConversationItemProps {
  conversation: ConversationMetadata;
  isActive: boolean;
  isStreaming: boolean;
  onClick: () => void;
}

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

const getRelativeTime = (utcDateString: string): string => {
  // Check if date string already has timezone info (Z or +/-offset)
  const hasTimezone = /Z|[+-]\d{2}:\d{2}$/.test(utcDateString);
  const dateStr = hasTimezone ? utcDateString : `${utcDateString}Z`;
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(date);
};

export const ConversationItem: FC<ConversationItemProps> = ({
  conversation,
  isActive,
  isStreaming,
  onClick,
}) => {
  return (
    <Tooltip title={conversation.title} placement='right' mouseEnterDelay={0.5}>
      <Flex
        vertical
        gap='0.25rem'
        onClick={onClick}
        className={`${styles.item} ${isActive ? styles.active : ''}`}>
        {/* Row 1: Title with streaming indicator */}
        <Flex align='center' gap='0.375rem'>
          <Text className={styles.title}>{conversation.title}</Text>
          <Hideable show={isStreaming}>
            <span className={styles.streamingDot} />
          </Hideable>
        </Flex>

        {/* Row 2: Time and Message Count */}
        <Flex justify='space-between' align='center'>
          <Flex align='center' gap='0.25rem' className={styles.secondary}>
            <ClockCircleOutlined />
            <Text style={{ color: 'inherit' }} text12>
              {getRelativeTime(conversation.updatedAt)}
            </Text>
          </Flex>
          <Flex align='center' gap='0.25rem' className={styles.secondary}>
            <MessageOutlined />
            <Text style={{ color: 'inherit' }} text12>
              {conversation.messageCount} message
              {conversation.messageCount !== 1 ? 's' : ''}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Tooltip>
  );
};
