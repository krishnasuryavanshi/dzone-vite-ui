import { useState } from 'react';
import { Flex } from '@/uicomponents/layout';
import { DzRecord } from '@/lib/types';
import { submitFeedback } from '../../../services';
import { useDzentStore } from '../../../store';
import styles from './message-feedback.module.css';

interface MessageFeedbackProps {
  feedback: DzRecord;
  conversationId: string;
  orgId: string;
  userId: string;
  feedbackGiven?: 'up' | 'down' | null;
}

export const MessageFeedback = ({
  feedback,
  conversationId,
  orgId,
  userId,
  feedbackGiven,
}: MessageFeedbackProps) => {
  const { setCurrentFeedbackGiven } = useDzentStore();
  const [selected, setSelected] = useState<'up' | 'down' | null>(
    feedbackGiven || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (rating: 'up' | 'down') => {
    if (selected || isSubmitting) return;
    setIsSubmitting(true);
    setSelected(rating);
    setCurrentFeedbackGiven(rating);

    await submitFeedback({
      orgId,
      userId,
      conversationId,
      agentType: feedback.agentType,
      flowType: feedback.flowType,
      agentMessageId: feedback.messageId,
      feedback: rating === 'up' ? 'THUMBS_UP' : 'THUMBS_DOWN',
    });

    setIsSubmitting(false);
  };

  if (selected) {
    return (
      <Flex gap='0.5rem' className={styles.feedbackContainer}>
        <div className={`${styles.feedbackButton} ${styles.selected}`}>
          {selected === 'up' ? '👍' : '👎'}
        </div>
      </Flex>
    );
  }

  return (
    <Flex gap='0.5rem' className={styles.feedbackContainer}>
      <div
        className={styles.feedbackButton}
        onClick={() => handleFeedback('up')}>
        👍
      </div>
      <div
        className={styles.feedbackButton}
        onClick={() => handleFeedback('down')}>
        👎
      </div>
    </Flex>
  );
};
