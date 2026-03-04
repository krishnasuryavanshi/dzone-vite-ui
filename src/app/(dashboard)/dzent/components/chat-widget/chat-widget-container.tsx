import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useDzentStore } from '../../store';
import { ChatWidgetFooter } from './chat-widget-footer';
import { ChatWidgetHeader } from './chat-widget-header';
import { ChatMessagesContainer } from '../chat-messages';
import { CLR_WHITE } from '@/lib/constants';

export const ChatWidgetContainer = () => {
  const { chatStatus, userMessage, systemMessage } = useDzentStore();
  const footerRef = useRef<HTMLDivElement>(null);
  const messagesOuterRef = useRef<HTMLDivElement>(null);
  const hiddenLastRef = useRef<HTMLDivElement>(null);
  const [chatFooterHeight, setChatFooterHeight] = useState(0);

  useEffect(() => {
    const footerElem = footerRef.current;
    if (!footerElem) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === footerElem) {
          const height = entry.contentRect.height;
          setChatFooterHeight(height);
        }
      }
    });
    observer.observe(footerElem);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Scroll to bottom when chat messages change
  useEffect(() => {
    const container = messagesOuterRef.current;
    const lastElem = hiddenLastRef.current;
    if (container && lastElem) {
      setTimeout(() => {
        lastElem.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 500);
    }
  }, [chatStatus, userMessage, systemMessage]);

  return (
    <Flex vertical style={{ height: 'calc(100vh - 10rem)' }}>
      <DzBox style={{ paddingInline: '0.75rem' }}>
        <ChatWidgetHeader />
      </DzBox>
      <DzBox style={{ flex: 1, padding: '1.25rem 1rem' }} className='chat-messages-wrapper'>
        <div
          className='chat-messages-container-outer'
          ref={messagesOuterRef}
          style={{
            maxHeight: `calc(100vh - 12.5rem - ${chatFooterHeight}px)`,
            overflowY: 'auto',
          }}
        >
          <ChatMessagesContainer />
          <div style={{ height: 2, width: 2 }} ref={hiddenLastRef}></div>
        </div>
      </DzBox>
      <div
        ref={footerRef}
        className='chat-widget-footer-wrapper'
        style={{
          position: 'absolute',
          bottom: 4,
          left: 0,
          right: 0,
          background: CLR_WHITE,
          zIndex: 10,
        }}
      >
        <DzBox style={{ paddingInline: '0.75rem' }}>
          <ChatWidgetFooter />
        </DzBox>
      </div>
    </Flex>
  );
};
