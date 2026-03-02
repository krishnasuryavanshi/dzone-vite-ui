import { MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { ChatSummaryAccordion } from './chat-summary-accordion';

type LineItemsSummaryProps = {
  lineItems: DzRecord;
};

export const LineItemsSummary = ({ lineItems }: LineItemsSummaryProps) => {
  const renderLineItem = (lineItemName: string, index: number) => {
    return (
      <ChatSummaryAccordion
        name={lineItemName}
        key={index}
        sections={lineItems[lineItemName]}
      />
    );
  };
  return (
    <DzBox style={{ marginTop: '1rem' }}>
      <Flex vertical gap='0.5rem'>
        <MapFunction
          items={Object.keys(lineItems)}
          renderItem={renderLineItem}
        />
      </Flex>
    </DzBox>
  );
};
