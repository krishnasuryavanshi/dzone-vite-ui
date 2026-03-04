import { useEffect, useRef } from 'react';
import { useSession } from '@/lib/hooks/use-session';
import { useAiAgentStore } from '../store/use-ai-agent-store';
import { AiAgentContainer } from './ai-agent-container';
import { useOrganizationsByTypeQuery } from '../../(system-admin)/organizations/hooks';
import { DzRecord } from '@/lib/types';

export const AiAgentContainerHost = () => {
  const reset = useAiAgentStore((state) => state.reset);
  const setMarketerList = useAiAgentStore((state) => state.setMarketerList);
  const setTenantCode = useAiAgentStore((state) => state.setTenantCode);
  const fetchConversationHistory = useAiAgentStore((state) => state.fetchConversationHistory);
  const tenantCode = useAiAgentStore((state) => state.tenantCode);
  const { data: userData } = useSession();

  const userId = (userData?.user as DzRecord)?.userId;
  const hasInitializedConversationsRef = useRef(false);

  // Fetch marketer list via query
  const { data: orgsData } = useOrganizationsByTypeQuery('Marketer', userId, !!userId);

  // Sync query data to Zustand store
  useEffect(() => {
    if (!orgsData?.data) return;
    const marketers = orgsData.data.map(({ name, code }: DzRecord) => ({
      label: name,
      value: code,
    }));
    setMarketerList(marketers || []);

    // Auto-select first marketer
    if (marketers?.length > 0) {
      setTenantCode(marketers[0].value);
    }
  }, [orgsData, setMarketerList, setTenantCode]);

  // Fetch conversation history when tenant is set (once)
  useEffect(() => {
    if (!tenantCode || hasInitializedConversationsRef.current) return;

    hasInitializedConversationsRef.current = true;
    fetchConversationHistory();
  }, [tenantCode, fetchConversationHistory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return <AiAgentContainer />;
};
