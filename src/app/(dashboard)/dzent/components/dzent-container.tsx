import { Hideable } from '@/components/shared';
import { useSession } from '@/lib/hooks/use-session';
import { useEffect } from 'react';
import { useDzentStore } from '../store';
import { DzentWrapper } from './dzent-wrapper';
import { TenantSelection } from './tenant-selection';
import { useUnsavedDataStore } from '@/stores/unsaved-data-store';
import { DzRecord } from '@/lib/types';

export type DZentContainerProps = {
  action?: string;
};

export const DzentContainer = ({ action }: DZentContainerProps) => {
  const {
    setSourceObject,
    setTargetObject,
    setActionsObject,
    setActionsDataObject,
  } = useUnsavedDataStore();

  const {
    initiateChatSetup,
    chatStatus,
    tenantCode,
    setTenantCode,
    campaignCreationInProgress,
    handleUserMessage,
  } = useDzentStore();
  const { data: userData } = useSession();

  useEffect(() => {
    setSourceObject({ campaignCreationInProgress: false });
    setTargetObject({ campaignCreationInProgress: false });
    setActionsObject({
      save: {
        label: 'Save Campaign',
        type: 'primary',
        handler: saveCampaignWhileNavigatingAway,
        navigateAfterCompletion: true,
      },
      exit: {
        label: 'Exit Without Saving',
        type: 'primary',
        danger: true,
        handler: navigateWithoutSaving,
        navigateAfterCompletion: true,
      },
    });
    setActionsDataObject({
      // save: { lineItemId: 'skjdhjsa' },
      // exit: { sessionId: 'sdfh' },
    });
  }, []);

  useEffect(() => {
    setTargetObject({ campaignCreationInProgress });
  }, [campaignCreationInProgress]);

  useEffect(() => {
    if (chatStatus === 'Idle' && tenantCode) {
      initializeConversation();
    }
  }, [tenantCode]);

  useEffect(() => {
    if (userData?.tenantCode?.length === 1) {
      setTenantCode(userData?.tenantCode[0]);
    }
  }, [userData]);

  const initializeConversation = async () => {
    try {
      await initiateChatSetup();
    } catch (error) {}
  };

  const saveCampaignWhileNavigatingAway = async (
    key: string,
    data: DzRecord,
  ) => {
    await handleUserMessage({ userMessage: 'Save Campaign' });
  };

  const navigateWithoutSaving = async (key: string, data: DzRecord) => {
    return true;
  };

  if (!chatStatus) {
    return null;
  }

  return (
    <>
      <Hideable show={!tenantCode && (userData?.user as any)?.userId}>
        <TenantSelection userId={(userData?.user as any)?.userId} />
      </Hideable>
      <Hideable show={!!tenantCode}>
        <DzentWrapper action={action} />
      </Hideable>
    </>
  );
};
