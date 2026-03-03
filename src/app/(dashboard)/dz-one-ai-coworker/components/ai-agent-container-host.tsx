
import { useEffect, useRef } from 'react';
import { useSession } from '@/lib/hooks/use-session';
import { useAiAgentStore } from '../store/use-ai-agent-store';
import { AiAgentContainer } from './ai-agent-container';
import { fetchOrganizationsByType } from '../../(system-admin)/organizations/services';
import { DzRecord } from '@/lib/types';

export const AiAgentContainerHost = () => {
  const reset = useAiAgentStore((state) => state.reset);
  const setMarketerList = useAiAgentStore((state) => state.setMarketerList);
  const setTenantCode = useAiAgentStore((state) => state.setTenantCode);
  const fetchConversationHistory = useAiAgentStore(
    (state) => state.fetchConversationHistory,
  );
  const tenantCode = useAiAgentStore((state) => state.tenantCode);
  const { data: userData } = useSession();

  // Refs to track initialization (prevents repeated fetches)
  const hasInitializedMarketersRef = useRef(false);
  const hasInitializedConversationsRef = useRef(false);

  // Fetch marketer list on mount (once)
  useEffect(() => {
    const fetchMarketers = async () => {
      const userId = (userData?.user as DzRecord)?.userId;
      if (!userId || hasInitializedMarketersRef.current) return;

      hasInitializedMarketersRef.current = true;

      try {
        const { data } = await fetchOrganizationsByType('Marketer', userId);
        const marketers = data?.map(({ name, code }: DzRecord) => ({
          label: name,
          value: code,
        }));
        setMarketerList(marketers || []);

        // Auto-select first marketer
        if (marketers?.length > 0) {
          setTenantCode(marketers[0].value);
        }
      } catch (error) {
        // Silently fail
      }
    };

    fetchMarketers();
  }, [userData, setMarketerList, setTenantCode]);

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
