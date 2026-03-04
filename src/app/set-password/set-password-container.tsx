import { Hideable } from '@/components/shared';
import { useQueryState } from '@/lib/hooks';
import { FC, useMemo } from 'react';
import { PasswordLinkExpiredContainer, SetPassword, SetPasswordEntry } from './components';
import { useQuery } from '@tanstack/react-query';
import { validateSetPasswordToken } from './services';

interface ISetPasswordContainerProps {}

export const SetPasswordContainer: FC<ISetPasswordContainerProps> = ({}) => {
  const { queryState } = useQueryState();

  const token = useMemo(() => queryState?.token ?? null, [queryState]);

  const { data, isLoading } = useQuery({
    queryKey: ['setPassword', 'validateToken', token],
    queryFn: () => validateSetPasswordToken(token!),
    enabled: !!token,
  });

  const isValid = data?.data?.success === true;
  const attemptCount = data?.data?.inviteAttempts ?? 0;

  if (!token) {
    return (
      <SetPasswordEntry>
        <PasswordLinkExpiredContainer attemptCount={0} />
      </SetPasswordEntry>
    );
  }

  if (isLoading) {
    return null;
  }

  return (
    <SetPasswordEntry>
      <Hideable show={isValid}>
        <SetPassword token={token} />
      </Hideable>
      <Hideable show={!isValid}>
        <PasswordLinkExpiredContainer attemptCount={attemptCount} />
      </Hideable>
    </SetPasswordEntry>
  );
};
