import { DzIcon } from '@/components/shared';
import React, { FC } from 'react';

type IEmailLinkSentProps = Record<string, never>;

export const EmailLinkSent: FC<IEmailLinkSentProps> = () => {
  return <DzIcon src='/icons/email-sent.svg' />;
};
