import { DzBox } from '@/components/layout/v1';
import { Hideable, MapFunction } from '@/components/shared';
import { DZENT_CHECKMARK_TEAL } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { CheckCircleFilled, DownOutlined, UpOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React, { useEffect, useState } from 'react';
import { ChatSummaryField } from '../chat-summary-field';
import { CLR_GRAY_4 } from '@/lib/constants';

type ChatSummaryAccordionItemProps = {
  title: string;
  fields: DzRecord[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
};

export const ChatSummaryAccordionItem = ({
  title,
  fields,
  collapsible = false,
  defaultExpanded = false,
}: ChatSummaryAccordionItemProps) => {
  const [isCollapsed, setIsCollapsed] = useState(!defaultExpanded);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (fields && fields.length > 0) {
      const completed = fields.filter((field) => field.value).length;
      setCompletedCount(completed);
    } else {
      setCompletedCount(0);
    }
  }, [fields]);

  const renderField = (field: DzRecord, index: number) => {
    return (
      <ChatSummaryField label={field.name} value={field.value} type={field.dataType} key={index} />
    );
  };

  return (
    <DzBox>
      <Flex justify='space-between'>
        <Flex gap={8} align='center'>
          <CheckCircleFilled
            style={{
              color: DZENT_CHECKMARK_TEAL,
              // color: completedCount < fields.length ? '#D8E2E9' : DZENT_CHECKMARK_TEAL,
              fontSize: '1.25rem',
            }}
          />
          <DzBox>
            <Text
              style={{
                fontWeight: 400,
                fontSize: '0.875rem',
                color: CLR_GRAY_4,
              }}
            >
              {title}
              {/* {completedCount}/{fields.length} */}
            </Text>
          </DzBox>
        </Flex>
        <Hideable show={collapsible}>
          <DzBox
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ cursor: 'pointer', marginRight: '1rem' }}
          >
            <Hideable show={!isCollapsed}>
              <DownOutlined />
            </Hideable>
            <Hideable show={isCollapsed}>
              <UpOutlined />
            </Hideable>
          </DzBox>
        </Hideable>
      </Flex>
      <Hideable show={!isCollapsed}>
        <Flex vertical gap={10} style={{ marginTop: '0.5rem', paddingLeft: '1.75rem' }}>
          <MapFunction items={fields} renderItem={renderField} />
        </Flex>
      </Hideable>
    </DzBox>
  );
};
