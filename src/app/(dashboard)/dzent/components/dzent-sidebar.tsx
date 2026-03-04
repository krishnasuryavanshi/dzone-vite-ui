import { DzBox } from '@/components/layout/v1';
import { CSSProperties } from 'react';
import { DZENT_BG_LIGHT_GRAY, DZENT_BG_WHITE } from '@/lib/constants/color-constants';
import { useDzentStore } from '../store';
import { ChatHistoryContainer } from './chat-history';
import { ChatSummaryContainer } from './chat-summary';

const CommonStyles: CSSProperties = {
  height: 'calc(100vh - 5rem)',
  position: 'relative',
  backgroundColor: DZENT_BG_WHITE,
  borderRadius: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  padding: '0.75rem',
};

export const DzentSidebar = () => {
  const { chatSummary } = useDzentStore();

  // Only history (full height) if no summary or no summary data
  if (!chatSummary || (!chatSummary.campaign && !chatSummary.lineItems)) {
    return (
      <DzBox style={CommonStyles}>
        <ChatHistoryContainer fullHeight />
      </DzBox>
    );
  }

  // Both summary and history (split 50/50)
  return (
    <DzBox style={CommonStyles}>
      <DzBox
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChatSummaryContainer />
      </DzBox>
      <DzBox
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: DZENT_BG_LIGHT_GRAY,
        }}
      >
        <ChatHistoryContainer />
      </DzBox>
    </DzBox>
  );
};
