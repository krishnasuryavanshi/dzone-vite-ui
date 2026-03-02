import { DzIcon } from '@/components/shared';
import { FC } from 'react';

type IPasswordLinkExpiredProps = Record<string, never>;

export const PasswordLinkExpired: FC<IPasswordLinkExpiredProps> = () => {
  return <DzIcon src='/icons/password-link-expired.svg' />;
};
