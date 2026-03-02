import { MapFunction } from '@/components/shared';
import React from 'react';
import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents/text';
import { FieldDescriptionText, FieldInfoList, FieldNote } from './field-info';
import { DzRecord } from '@/lib/types';

type FieldAdditionalContentProps = {
  config: Record<string, any>[];
};

export const FieldAdditionalContent = ({
  config,
}: FieldAdditionalContentProps) => {
  const renderItem = (item: DzRecord, index: number) => {
    switch (item.type) {
      case 'ordered_list':
        return <FieldInfoList key={index} config={item} />;
      case 'unordered_list':
        return <FieldInfoList key={index} config={item} />;
      case 'text':
        return <FieldDescriptionText key={index} config={item} />;
      case 'note':
        return <FieldNote key={index} config={item} />;
      default:
        return null;
    }
  };

  return (
    <DzBox style={{ paddingTop: '0.5rem' }}>
      <MapFunction items={config} renderItem={renderItem} />
    </DzBox>
  );
};
