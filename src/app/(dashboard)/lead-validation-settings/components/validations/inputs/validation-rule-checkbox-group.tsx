import React, { useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../../store';
import { Checkbox, CheckboxGroup } from '@/uicomponents/form/input';
import { MapFunction } from '@/components/shared';
import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents/text';
import { ValidationSettingRuleSectionProps } from '../../../lib/types';
import { Flex } from '@/uicomponents/layout';
import { FieldAdditionalContent } from '../../field-additional-content';

export const ValidationRuleCheckboxGroup = ({
  section,
  isDisabled,
}: ValidationSettingRuleSectionProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { selectedValues, setSelectedValues } = useValidationSettingStore();

  useEffect(() => {
    setSelected(Object.keys(selectedValues[section.name] || {}) || []);
  }, [selectedValues, section]);

  const handleCheckboxChange = (checkedValue: string[]) => {
    const selectedValuesOfSection: Record<string, boolean> = {};

    // Check if this is the ENTITY_LEVEL section
    const isDuplicationEntityLevel = section.name === 'ENTITY_LEVEL';

    for (let i = 0; i < checkedValue.length; i++) {
      selectedValuesOfSection[checkedValue[i]] = true;
    }

    // Auto-select logic: if 'campaign' (Campaign Level) is selected,
    // automatically select 'lineItem' (Line Item Level)
    if (
      isDuplicationEntityLevel &&
      selectedValuesOfSection['Campaign'] &&
      !selectedValuesOfSection['lineItem']
    ) {
      selectedValuesOfSection['lineItem'] = true;
    }

    setSelectedValues(section.name, selectedValuesOfSection);
  };

  const renderCheckbox = (item: Record<string, any>, index: number) => {
    const isLastItem = index === section.attributes.length - 1;
    const borderBottom = isLastItem ? 'none' : '1px solid #EAF1FF';

    return (
      <DzBox style={{ padding: '1rem', borderBottom }} key={index}>
        <Checkbox value={item.name} onChange={() => {}}>
          <Flex vertical gap={'1rem'}>
            <DzBox>
              <Text style={{ marginLeft: '0.5rem' }} strong>
                {item.label}
              </Text>
            </DzBox>
            <DzBox>
              <FieldAdditionalContent config={item.config} />
            </DzBox>
          </Flex>
        </Checkbox>
      </DzBox>
    );
  };

  return (
    <CheckboxGroup
      value={selected}
      disabled={isDisabled}
      onChange={handleCheckboxChange}
      style={{ display: 'flex', flexDirection: 'column' }}>
      <MapFunction items={section.attributes} renderItem={renderCheckbox} />
    </CheckboxGroup>
  );
};
