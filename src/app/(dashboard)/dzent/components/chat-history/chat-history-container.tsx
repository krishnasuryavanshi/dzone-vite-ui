import { Translate } from '@/components/i18n/translate';
import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { DZONE_PURPLE, DZENT_BTN_DARK, DZENT_TEXT_WHITE } from '@/lib/constants/color-constants';
import { Button, Modal, Text } from '@/uicomponents';
import { ExclamationCircleFilled } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout/flex';
import { useState } from 'react';
import { useDzentStore } from '../../store';
import styles from './chat-history-container.module.css';
import { EmptyHistory } from './empty-history';
import { MarketerSelection } from './marketer-selection';

export const ChatHistoryContainer = ({ fullHeight = false }: { fullHeight?: boolean }) => {
  const [isOpened, setIsOpened] = useState(false);

  const {
    initializeChat,
    handleUserMessage,
    chatHistory,
    activeHistoricalConversation,
    setActiveHistoricalConversation,
  } = useDzentStore();

  // Header height is 2rem, so scrollable area is either full or minus header
  const scrollAreaHeight = fullHeight ? '100%' : 'calc(100% - 2rem)';

  const initializeNewConversation = async () => {
    try {
      setIsOpened(false);
      await initializeChat();
    } catch (error) {}
  };

  const saveCampaignWhileCreatingNewChat = async () => {
    setIsOpened(false);
    await handleUserMessage({ userMessage: 'Save Campaign' });
    await initializeChat();
  };

  const handleNewChatAction = async () => {
    // if (campaignCreationInProgress) {
    //   setIsOpened(true);
    // } else {
    //   await initializeNewConversation();
    // }

    await initializeNewConversation();
  };

  return (
    <>
      <Flex
        vertical
        gap={'0.5rem'}
        className='chat-summary-container'
        style={{
          height: '100%',
        }}
      >
        <Flex justify='space-between' align='end'>
          <Text strong underline style={{ color: DZONE_PURPLE }}>
            <Translate i18nKey='Chats' />
          </Text>
          <Flex gap='0.5rem' align='center'>
            <MarketerSelection onMarketerChange={handleNewChatAction} />
            <Button
              type='primary'
              size='small'
              style={{
                backgroundColor: DZENT_BTN_DARK,
                borderColor: DZENT_BTN_DARK,
                color: DZENT_TEXT_WHITE,
              }}
              onClick={handleNewChatAction}
            >
              <Translate i18nKey='New' />
            </Button>
          </Flex>
        </Flex>
        <Hideable show={!!chatHistory?.length}>
          <Flex vertical style={{ overflowY: 'auto', height: scrollAreaHeight }}>
            {chatHistory?.map((chat) => {
              const isActive = activeHistoricalConversation?.conversationId === chat.conversationId;
              return (
                <DzBox
                  className={`${styles.chatHistoryItem} ${isActive ? styles.active : ''}`}
                  key={chat.conversationId}
                  onClick={() => setActiveHistoricalConversation?.(chat)}
                >
                  <Text ellipsis text14 title={chat.title}>
                    {chat.title}
                  </Text>
                </DzBox>
              );
            })}
          </Flex>
        </Hideable>
        <Hideable show={!chatHistory?.length}>
          <EmptyHistory />
        </Hideable>
      </Flex>
      <Modal
        title={
          <Flex align='center' gap={'0.5rem'}>
            <ExclamationCircleFilled style={{ color: 'orange' }} />
            <Text>
              <Translate i18nKey='Are you sure?' />
            </Text>
          </Flex>
        }
        closable={false}
        open={isOpened}
        onOk={saveCampaignWhileCreatingNewChat}
        onCancel={() => setIsOpened(false)}
        okText={<Translate i18nKey='Save and Start New' />}
        cancelText={<Translate i18nKey='Stay' />}
        okButtonProps={{ size: 'small', type: 'primary' }}
        cancelButtonProps={{ size: 'small' }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
            <Button size='small' type='primary' onClick={initializeNewConversation} danger>
              Start New
            </Button>
          </>
        )}
      >
        <Text>
          <Translate i18nKey='Campaign Creation/Modification is in progress.' />
        </Text>
      </Modal>
    </>
  );
};
