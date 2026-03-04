import { DzBox } from '@/components/layout/v1';
import { DZENT_BORDER_MEDIUM } from '@/lib/constants';
import { Flex } from '@/uicomponents/layout';
import { Row, Col } from '@/uicomponents/layout/grid';
import { ChatWidgetInitialActions } from './chat-widget-initial-actions';
import { AttachmentGrid, MicButton, PaperClip, SendButton, UserInput } from './footer-content';
import { useDzentStore } from '../../store';
import { useEffect, useState } from 'react';
import { DzRecord } from '@/lib/types';

const stripHtml = (text: string): string => {
  return text.replace(/<[^>]*>/g, '');
};

export const ChatWidgetFooter = () => {
  const {
    disableFileUpload,
    disableTextInput,
    chatStatus,
    footerInputPlaceholder,
    systemMessage,
    handleUserMessage,
    userPrefilledMessage,
    clearUserPrefilledMessage,
  } = useDzentStore();
  const [isFileUploadInProgress, setIsFileUploadInProgress] = useState(false);
  const [footerActionDisabledStatus, setFooterActionDisabledStatus] = useState({
    paperClip: true,
    userInput: true,
    sendButton: true,
  });
  const [userInputMessage, setUserInputMessage] = useState('');
  const [attachments, setAttachments] = useState<DzRecord[]>([]);

  useEffect(() => {
    if (isFileUploadInProgress) {
      setFooterActionDisabledStatus({
        paperClip: true,
        userInput: true,
        sendButton: true,
      });
    } else {
      setFooterActionDisabledStatus({
        paperClip: disableFileUpload,
        userInput: disableTextInput,
        sendButton: true,
      });
    }
  }, [disableFileUpload, disableTextInput, isFileUploadInProgress]);

  useEffect(() => {
    if (chatStatus === 'InProgress') {
      setAttachments([]);
      setUserInputMessage('');
    }
  }, [chatStatus]);

  useEffect(() => {
    if (userInputMessage.trim()) {
      setFooterActionDisabledStatus((prev) => ({
        ...prev,
        sendButton: false,
      }));
    } else {
      setFooterActionDisabledStatus((prev) => ({
        ...prev,
        sendButton: true,
      }));
    }
  }, [userInputMessage, attachments]);

  // Populate textarea when userPrefilledMessage is received from API
  useEffect(() => {
    if (userPrefilledMessage) {
      setUserInputMessage(userPrefilledMessage);
      clearUserPrefilledMessage();
    }
  }, [userPrefilledMessage]);

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((attachment) => attachment.id !== attachmentId));
  };

  const handleAddAttachments = (newAttachments: DzRecord[]) => {
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleSendMessage = () => {
    if (userInputMessage.trim()) {
      const sanitizedMessage = stripHtml(userInputMessage.trim());
      const userMessage: DzRecord = {
        userMessage: sanitizedMessage,
      };

      if (attachments.length > 0) {
        userMessage.fileUploads = attachments;
      }

      userMessage.fields = systemMessage
        ?.filter(({ field }: DzRecord) => field)
        ?.map(({ field }: DzRecord) => ({
          type: field.type,
          label: field.label,
          name: field.name,
          value: null,
          skip: false,
        }));

      handleUserMessage(userMessage);

      setUserInputMessage('');
      setAttachments([]);
    }
  };

  return (
    <DzBox style={{ paddingBottom: '1rem' }}>
      <Row gutter={[10, 10]}>
        <Col xs={24} sm={24} md={24} xl={24} xxl={{ offset: 4, span: 16 }}>
          <Flex vertical gap='0.5rem'>
            <ChatWidgetInitialActions />
            <Flex
              className='chat-input-container'
              vertical
              align='stretch'
              style={{
                borderRadius: '1.5rem',
                border: `1px solid ${DZENT_BORDER_MEDIUM}`,
                minHeight: '3rem',
              }}
            >
              <Flex
                className='input-row'
                gap={'1rem'}
                style={{ width: '100%', padding: '0.75rem 1rem' }}
                align='center'
              >
                <PaperClip
                  disabled={footerActionDisabledStatus.paperClip}
                  onAddAttachments={handleAddAttachments}
                  handleFileUploadInProgress={(flag: boolean) => setIsFileUploadInProgress(flag)}
                />
                <UserInput
                  disabled={footerActionDisabledStatus.userInput}
                  placeholder={footerInputPlaceholder}
                  value={userInputMessage}
                  onChange={(value) => {
                    setUserInputMessage(value);
                  }}
                  onEnter={handleSendMessage}
                />
                <MicButton />
                <SendButton
                  disabled={footerActionDisabledStatus.sendButton}
                  handleSend={handleSendMessage}
                />
              </Flex>
              <AttachmentGrid attachments={attachments} handleRemoveFile={handleRemoveAttachment} />
            </Flex>
          </Flex>
        </Col>
      </Row>
    </DzBox>
  );
};
