import { MapFunction } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import React from 'react';
import { ShowTargetingOptionsAttribute } from './show-targeting-options-attribute';
import { ShowTargetingFileAttribute } from './show-targeting-files-attribute';
import { Flex } from '@/uicomponents/layout';

type ShowTargetingAttributesContainerProps = {
  targetingRuleDetails?: Record<string, any>;
  isEditing?: boolean;
};

export const ShowTargetingAttributesContainer = ({
  targetingRuleDetails,
  isEditing = false,
}: ShowTargetingAttributesContainerProps) => {
  const renderAttribute = (attribute: DzRecord, index: number) => {
    if (!attribute?.value?.type || !attribute?.value?.data?.length) {
      return null;
    }

    if (attribute?.value?.type === 'OPTIONS') {
      return (
        <ShowTargetingOptionsAttribute
          name={attribute.name}
          label={attribute.label}
          values={attribute.value.data}
          options={attribute?.options || []}
          attributeId={attribute.id}
          isEditing={isEditing}
        />
      );
    } else if (attribute?.value?.type === 'INCLUSION' || attribute?.value?.type === 'EXCLUSION') {
      return (
        <ShowTargetingFileAttribute
          isFirst={index === 0}
          type={attribute.value.type}
          files={attribute.value.data}
          label={attribute.label}
          attributeId={attribute.id}
          isEditing={isEditing}
        />
      );
    } else {
      return null;
    }
  };

  const renderSection = (section: DzRecord) => {
    return <MapFunction items={section.attributes} renderItem={renderAttribute} />;
  };

  return (
    <Flex
      vertical
      gap='0.5rem'
      style={{
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
      }}
    >
      <MapFunction items={targetingRuleDetails?.sections} renderItem={renderSection} />
    </Flex>
  );
};
