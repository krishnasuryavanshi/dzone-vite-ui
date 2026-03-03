
import { Switch } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { useAiAgentStore } from '../store/use-ai-agent-store';
import { Hideable } from '@/components/shared';
import { COLORS } from '../lib/constants/colors';

export const ConversationFilterSwitch = () => {
  const conversationFilter = useAiAgentStore(
    (state) => state.conversationFilter,
  );
  const setConversationFilter = useAiAgentStore(
    (state) => state.setConversationFilter,
  );
  const fetchConversationHistory = useAiAgentStore(
    (state) => state.fetchConversationHistory,
  );
  const marketerList = useAiAgentStore((state) => state.marketerList);

  const hasMultipleMarketers = marketerList && marketerList.length > 1;

  const handleChange = (checked: boolean) => {
    const newFilter = checked ? 'all' : 'current';
    setConversationFilter(newFilter);
    fetchConversationHistory();
  };

  return (
    <Hideable show={!!hasMultipleMarketers}>
      <Flex
        align='center'
        justify='flex-start'
        gap={8}
        style={{
          padding: 'var(--dzone-spacing-sm) var(--dzone-spacing-lg)',
          margin: '0 0.5rem 0.5rem',
          background: 'var(--dzent-color-bg-light)',
          borderRadius: 'var(--dzone-radius-md)',
          border: '1px solid var(--dzent-color-border-light)',
        }}>
        <Text
          text12
          style={{
            color: COLORS.GRAY_MEDIUM,
            fontWeight: 600,
          }}>
          Current Tenant
        </Text>
        <Switch
          checked={conversationFilter === 'all'}
          onChange={handleChange}
          size='small'
        />
        <Text
          text12
          style={{
            color: COLORS.GRAY_MEDIUM,
            fontWeight: 600,
          }}>
          All
        </Text>
      </Flex>
    </Hideable>
  );
};
