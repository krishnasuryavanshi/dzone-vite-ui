import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';
import { ChatMessage } from '../lib/types';
import { MessageAttachmentPreview } from './message-attachment-preview';

interface UserMessageBubbleProps {
  message: ChatMessage;
}

export const UserMessageBubble: FC<UserMessageBubbleProps> = ({ message }) => {
  const hasAttachments = message.attachments && message.attachments.length > 0;

  return (
    <Flex justify='flex-end'>
      <Flex vertical style={{ maxWidth: '70%' }}>
        {hasAttachments && <MessageAttachmentPreview attachments={message.attachments!} />}
        <Flex
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#F0F4F7',
            borderRadius: '5px',
          }}
        >
          <Text style={{ whiteSpace: 'pre-wrap', fontSize: '1rem' }}>{message.content}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
