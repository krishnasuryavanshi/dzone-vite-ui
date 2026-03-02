import { Hideable } from '@/components/shared';
import React from 'react';
import {
  UserMessageView,
  UserMessageViewProps,
  UserMessageWrapper,
} from '../user-message';

export const UserMessage = ({ message }: UserMessageViewProps) => {
  return (
    <Hideable show={!!message}>
      <UserMessageWrapper>
        <UserMessageView message={message} />
      </UserMessageWrapper>
    </Hideable>
  );
};
