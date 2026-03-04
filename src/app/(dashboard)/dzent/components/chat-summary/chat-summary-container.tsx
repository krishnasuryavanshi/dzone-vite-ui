import { Flex } from '@/uicomponents/layout';
import { SummaryHeader } from './summary-header';

import { Hideable } from '@/components/shared';
import { useDzentStore } from '../../store';
import { CampaignSummary } from './campaign-summary';
import './chat-summary-container.scss';
import { LineItemsSummary } from './line-items-summary';

export const ChatSummaryContainer = () => {
  const { chatSummary } = useDzentStore();

  if (!chatSummary) {
    return null;
  }

  return (
    <Flex vertical gap={'0.5rem'} style={{ height: '100%' }} className='chat-summary-container'>
      <SummaryHeader />
      <Hideable show={!!chatSummary}>
        <Flex vertical gap={'0.5rem'} style={{ overflowY: 'auto', height: 'calc(100% - 2rem)' }}>
          <Hideable show={Object.keys(chatSummary?.campaign || {}).length > 0}>
            <CampaignSummary campaign={chatSummary?.campaign || {}} />
          </Hideable>
          <Hideable show={Object.keys(chatSummary?.lineItems || {}).length > 0}>
            <LineItemsSummary lineItems={chatSummary?.lineItems || {}} />
          </Hideable>
        </Flex>
      </Hideable>
      {/* <Hideable show={!chatSummary || chatStatus === 'Idle'}>
        <Text italic>Start interacting with DZ One to create campaign </Text>
      </Hideable> */}
    </Flex>
  );
};
