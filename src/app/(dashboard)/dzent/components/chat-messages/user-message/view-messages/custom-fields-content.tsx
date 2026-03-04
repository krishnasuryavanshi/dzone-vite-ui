import { DzBox } from '@/components/layout/v1';
import { Hideable, MapFunction } from '@/components/shared';
import { CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React from 'react';

interface ICustomFieldsContentProps {
  data: {
    customFields: DzRecord[];
    customFieldInstructions: string;
  };
  children?: React.ReactNode;
}

export const CustomFieldsContent = ({ data, children }: ICustomFieldsContentProps) => {
  const { customFields, customFieldInstructions } = data;

  const renderField = (field: DzRecord, index: number) => {
    const srNo = field.position || index + 1;
    const typeDisplay = field.format ? `${field.type} (${field.format})` : field.type;

    return (
      <Flex key={index} vertical gap='0.25rem' style={{ marginLeft: '0.5rem' }}>
        <Text style={{ fontSize: '0.875rem', color: CLR_WHITE }} strong>
          {srNo}) {field.label || 'Untitled Field'}
        </Text>
        <DzBox style={{ marginLeft: '1rem' }}>
          <Text style={{ fontSize: '0.875rem', color: CLR_WHITE }}>
            <strong>Type: </strong>
            {typeDisplay}
          </Text>
        </DzBox>
        <Hideable show={!!field.required}>
          <DzBox style={{ marginLeft: '1rem' }}>
            <Text style={{ fontSize: '0.875rem', color: CLR_WHITE }}>
              <strong>Required: </strong>Yes
            </Text>
          </DzBox>
        </Hideable>
        <Hideable show={!!field.inclusion}>
          <DzBox style={{ marginLeft: '1rem' }}>
            <Text style={{ fontSize: '0.875rem', color: CLR_WHITE }}>
              <strong>Inclusion: </strong>
              {field.inclusion}
            </Text>
          </DzBox>
        </Hideable>
        <Hideable show={!!field.exclusion}>
          <DzBox style={{ marginLeft: '1rem' }}>
            <Text style={{ fontSize: '0.875rem', color: CLR_WHITE }}>
              <strong>Suppression: </strong>
              {field.exclusion}
            </Text>
          </DzBox>
        </Hideable>
      </Flex>
    );
  };

  return (
    <Flex vertical gap='0.5rem'>
      <DzBox>{children}</DzBox>
      <Hideable show={customFields?.length > 0}>
        <MapFunction items={customFields} renderItem={renderField} />
      </Hideable>
      <Hideable show={!!customFieldInstructions}>
        <DzBox style={{ marginTop: '0.5rem' }}>
          <Text style={{ fontSize: '0.875rem', color: CLR_WHITE }}>
            <strong>Instructions: </strong>
            {customFieldInstructions}
          </Text>
        </DzBox>
      </Hideable>
    </Flex>
  );
};
