import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { RadioChangeEvent } from '@/lib/types/uicomponents';
import { Radio, RadioGroup } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { useEffect, useState } from 'react';
import { ValidationSettingRuleSectionProps } from '../../../lib/types';
import { useValidationSettingStore } from '../../../store';
import { FieldAdditionalContent } from '../../field-additional-content';

export const ValidationRuleRadioGroup = ({
  section,
  isDisabled,
}: ValidationSettingRuleSectionProps) => {
  const [selected, setSelected] = useState<string>('');
  const { selectedValues, setSelectedValues } = useValidationSettingStore();

  useEffect(() => {
    setSelected(Object.keys(selectedValues[section.name] || {})?.[0] || '');
  }, [selectedValues, section]);

  const handleRadioChange = (e: RadioChangeEvent) => {
    const selectedValuesOfSection = { [e.target.value]: true };
    setSelectedValues(section.name, selectedValuesOfSection);
  };

  const renderRadio = (item: Record<string, any>, index: number) => {
    const isLastItem = index === section.attributes.length - 1;
    const borderBottom = isLastItem ? 'none' : '1px solid #EAF1FF';

    return (
      <DzBox style={{ padding: '1rem', borderBottom }} key={index}>
        <Radio value={item.name}>
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
        </Radio>
      </DzBox>
    );
  };

  return (
    <RadioGroup
      disabled={isDisabled}
      value={selected}
      onChange={handleRadioChange}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <MapFunction items={section.attributes} renderItem={renderRadio} />
    </RadioGroup>
  );
};
