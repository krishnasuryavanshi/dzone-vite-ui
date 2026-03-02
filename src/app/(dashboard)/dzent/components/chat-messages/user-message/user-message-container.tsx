import { Hideable } from '@/components/shared';
import { UserMessageWrapper } from './user-message-wrapper';
import { useDzentStore } from '../../../store';
import { UserMessageView } from './user-message-view';

export const UserMessageContainer = () => {
  const { userMessage } = useDzentStore();

  return (
    <Hideable show={!!userMessage}>
      <UserMessageWrapper>
        <UserMessageView message={userMessage} />
      </UserMessageWrapper>
    </Hideable>
  );
};
