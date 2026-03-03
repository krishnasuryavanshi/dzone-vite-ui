import { Hideable } from '@/components/shared';
import { useQueryState } from '@/lib/hooks';
import { FC, useEffect, useState } from 'react';
import {
  PasswordLinkExpiredContainer,
  SetPassword,
  SetPasswordEntry,
} from './components';
import { validateSetPasswordToken } from './services';

interface ISetPasswordContainerProps {}

type CurrentPageType = 'Loading' | 'Valid Token' | 'Invalid Token';

export const SetPasswordContainer: FC<ISetPasswordContainerProps> = ({}) => {
  const { queryState } = useQueryState();
  const [currentPage, setCurrentPage] = useState<CurrentPageType>('Loading');
  const [token, setToken] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    if (queryState) {
      let { token } = queryState;
      if (token) {
        setToken(token);
      } else {
        setToken(null);
      }
    }
  }, [queryState]);

  useEffect(() => {
    if (token) {
      setCurrentPage('Loading');
      validateToken(token);
    } else {
      setCurrentPage('Invalid Token');
    }
  }, [token]);

  const validateToken = async (token: string) => {
    const data = await validateSetPasswordToken(token);
    if (data?.data?.success) {
      setCurrentPage('Valid Token');
    } else {
      setCurrentPage('Invalid Token');
    }
    setAttemptCount(data?.data?.inviteAttempts);
  };

  if (currentPage === 'Loading') {
    return null;
  }

  return (
    <SetPasswordEntry>
      <Hideable show={currentPage === 'Valid Token'}>
        <SetPassword token={token as string} />
      </Hideable>
      <Hideable show={currentPage === 'Invalid Token'}>
        <PasswordLinkExpiredContainer attemptCount={attemptCount} />
      </Hideable>
    </SetPasswordEntry>
  );
};
