import { Hideable } from '@/components/shared';
import { DzBox } from '@/components/layout/v1';
import { DzRecord } from '@/lib/types';
import { useDzentStore } from '../../../store';
import {
  MessageFeedback,
  SystemMessageInstructions,
  SystemMessageWrapper,
} from '../system-message';

interface SystemMessageProps {
  message: DzRecord[];
  feedback?: DzRecord | null;
  feedbackGiven?: 'up' | 'down' | null;
}

export const SystemMessage = ({ message, feedback, feedbackGiven }: SystemMessageProps) => {
  const { conversationId, tenantCode, userId } = useDzentStore();

  return (
    <Hideable show={!!message?.length}>
      <DzBox>
        <SystemMessageWrapper>
          <SystemMessageInstructions message={message} />
        </SystemMessageWrapper>
        <Hideable show={!!feedback}>
          <MessageFeedback
            feedback={feedback!}
            conversationId={conversationId!}
            orgId={tenantCode!}
            userId={userId!}
            feedbackGiven={feedbackGiven}
          />
        </Hideable>
      </DzBox>
    </Hideable>
  );
};
