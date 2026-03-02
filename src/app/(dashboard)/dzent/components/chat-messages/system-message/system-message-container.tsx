import { Hideable } from '@/components/shared';
import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { useDzentStore } from '../../../store';
import { MessageFeedback } from './message-feedback';
import { SystemMessageActions } from './system-message-actions';
import { SystemMessageWrapper } from './system-message-wrapper';

export const SystemMessageContainer = () => {
  const {
    systemMessage,
    currentFeedback,
    currentFeedbackGiven,
    conversationId,
    tenantCode,
    userId,
  } = useDzentStore();

  return (
    <Hideable show={!!systemMessage?.length}>
      <DzBox>
        <SystemMessageWrapper>
          <Flex vertical className='system-message-container' gap='0.5rem'>
            <SystemMessageActions actions={systemMessage || []} />
          </Flex>
        </SystemMessageWrapper>
        <Hideable show={!!currentFeedback}>
          <MessageFeedback
            key={currentFeedback?.agentMessageId}
            feedback={currentFeedback!}
            conversationId={conversationId!}
            orgId={tenantCode!}
            userId={userId!}
            feedbackGiven={currentFeedbackGiven}
          />
        </Hideable>
      </DzBox>
    </Hideable>
  );
};
