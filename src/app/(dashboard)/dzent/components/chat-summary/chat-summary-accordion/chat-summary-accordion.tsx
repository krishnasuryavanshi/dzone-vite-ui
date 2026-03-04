import { DzBox } from '@/components/layout/v1';
import { Hideable, MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { DownOutlined, UpOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React, { useState } from 'react';
import { DZENT_BG_LIGHT_BLUE, DZENT_TEXT_BLACK } from '@/lib/constants/color-constants';
import { ChatSummaryAccordionItem } from './chat-summary-accordion-item';

type ChatSummaryAccordionProps = {
  name: string;
  sections: DzRecord;
};

export const ChatSummaryAccordion = ({ name, sections }: ChatSummaryAccordionProps) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const renderSection = (section: string, index: number) => {
    return (
      <ChatSummaryAccordionItem
        title={section}
        fields={sections[section]}
        key={index}
        defaultExpanded
      />
    );
  };
  return (
    <DzBox
      style={{
        backgroundColor: DZENT_BG_LIGHT_BLUE,
        padding: '0.625rem 1rem',
        borderRadius: '5px',
      }}
    >
      <Flex vertical gap='0.5rem'>
        <Flex justify='space-between' align='center'>
          <Text style={{ color: DZENT_TEXT_BLACK, fontSize: '0.875rem' }}>{name}</Text>
          <DzBox onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
            <Hideable show={!isCollapsed}>
              <DownOutlined />
            </Hideable>
            <Hideable show={isCollapsed}>
              <UpOutlined />
            </Hideable>
          </DzBox>
        </Flex>
        <Hideable show={!isCollapsed}>
          <Flex vertical gap='0.5rem'>
            <MapFunction items={Object.keys(sections)} renderItem={renderSection} />
          </Flex>
        </Hideable>
      </Flex>
    </DzBox>
  );
};
