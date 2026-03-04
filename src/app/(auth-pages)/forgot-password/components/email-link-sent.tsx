import React, { FC } from 'react';
import { ILinkSent } from '../types';
import { DzIcon } from '@/components/shared';

interface IEmailLinkSentProps extends ILinkSent {}
export const EmailLinkSent: FC<IEmailLinkSentProps> = ({ isLinkSent }) => {
  if (!isLinkSent) {
    return null;
  }
  return <DzIcon src='/images/email-link-sent.svg' style={{ marginBottom: '2rem' }} />;
};
