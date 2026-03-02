import { Hideable } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { useState } from 'react';
import { useDzentStore } from '../../store';
import { ActionButtons } from '../chat-messages/actions';

export const ChatWidgetInitialActions = () => {
  const { idleActions, chatStatus, handleUserMessage } = useDzentStore();

  const [selected, setSelected] = useState<DzRecord | null>(null);

  const handleActionClick = async (action: DzRecord) => {
    setSelected(action);
    const userMessageData = {
      userMessage: action.label,
      files: null,
    };
    await handleUserMessage(userMessageData);
  };

  return (
    <Hideable show={chatStatus === 'Idle' && idleActions.length > 0}>
      <ActionButtons
        options={idleActions}
        handleActionClick={handleActionClick}
        selected={selected || idleActions[0]}
      />
    </Hideable>
  );
};
