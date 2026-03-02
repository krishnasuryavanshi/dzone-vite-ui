import { DzRecord } from '@/lib/types';
import React from 'react';
import { MapFunction } from '@/components/shared';
import { ChatSummaryAccordionItem } from './chat-summary-accordion';

type CampaignSummaryProps = {
  campaign: DzRecord;
};

export const CampaignSummary = ({ campaign }: CampaignSummaryProps) => {
  const renderSection = (section: string, index: number) => {
    return (
      <ChatSummaryAccordionItem
        title={section}
        fields={campaign[section]}
        collapsible
        defaultExpanded={index === 0}
      />
    );
  };
  return (
    <MapFunction items={Object.keys(campaign)} renderItem={renderSection} />
  );
};
