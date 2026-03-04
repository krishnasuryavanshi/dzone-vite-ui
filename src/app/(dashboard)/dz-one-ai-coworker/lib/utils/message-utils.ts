import { ChatMessage, ChatHistoryMessage, FileUploadStatus, MessageRole } from '../types';
import { getFileTypeFromName } from './file-utils';

export const mapChatHistoryToMessages = (messages: ChatHistoryMessage[]): ChatMessage[] => {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role === 'user' ? MessageRole.USER : MessageRole.ASSISTANT,
    content: msg.content,
    timestamp: new Date(msg.timestamp),
    attachments: msg.attachments?.map((att) => ({
      id: att.id,
      name: att.name,
      size: 0,
      type: getFileTypeFromName(att.name),
      status: FileUploadStatus.SUCCESS,
    })),
  }));
};

export const truncateTitle = (content: string, maxLength: number): string => {
  return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
};
