import { Button } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { useAiAgentStore } from '../store/use-ai-agent-store';
import { ConversationList } from './conversation-list';
import { ConversationFilterSwitch } from './conversation-filter-switch';
import { MarketerSelection } from './marketer-selection';
import { COLORS } from '../lib/constants/colors';

export const ConversationSidebar = () => {
  const conversationHistory = useAiAgentStore((state) => state.conversationHistory);
  const currentConversationId = useAiAgentStore((state) => state.currentConversationId);
  const isLoadingHistory = useAiAgentStore((state) => state.isLoadingHistory);
  const loadConversation = useAiAgentStore((state) => state.loadConversation);
  const createNewConversation = useAiAgentStore((state) => state.createNewConversation);
  const tenantCode = useAiAgentStore((state) => state.tenantCode);
  const marketerList = useAiAgentStore((state) => state.marketerList);
  const isTenantUnavailable = useAiAgentStore((state) => state.isTenantUnavailable);
  const streamingConversationId = useAiAgentStore((state) => state.streamingConversationId);

  const isTenantValid =
    tenantCode && !isTenantUnavailable && marketerList?.some((m) => m.value === tenantCode);
  const isNewChatDisabled = !isTenantValid;

  return (
    <Flex
      vertical
      style={{
        width: '18.75rem',
        backgroundColor: '#fff',
        border: `1px solid ${COLORS.BORDER}`,
        borderRadius: '0.75rem',
        margin: '0.5rem 0 1rem 0.5rem',
      }}
    >
      <Flex
        vertical
        gap='0.5rem'
        style={{
          padding: '0.75rem 0.5rem',
        }}
      >
        <MarketerSelection onMarketerChange={createNewConversation} />
        <Button type='primary' block disabled={isNewChatDisabled} onClick={createNewConversation}>
          + New Chat
        </Button>
      </Flex>

      <ConversationFilterSwitch />

      <ConversationList
        conversations={conversationHistory}
        currentConversationId={currentConversationId}
        isLoading={isLoadingHistory}
        onLoadConversation={loadConversation}
        streamingConversationId={streamingConversationId}
      />
    </Flex>
  );
};
