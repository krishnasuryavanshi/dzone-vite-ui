import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { Switch, Text } from '@/uicomponents';
import { useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../../store';
import { ValidationSettingRuleSectionProps } from '../../../lib/types';
import { Flex } from '@/uicomponents/layout';
import { FieldAdditionalContent } from '../../field-additional-content';

export const ValidationRuleSwitch = ({
  section,
  isDisabled,
}: ValidationSettingRuleSectionProps) => {
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const { selectedValues, setSelectedValues } = useValidationSettingStore();

  useEffect(() => {
    setSelected({ ...(selectedValues[section.name] || {}) });
  }, [selectedValues, section]);

  const handleSwitchChange = (name: string, isChecked: boolean) => {
    const selectedValuesOfSection = { ...selected, [name]: isChecked };
    setSelectedValues(section.name, selectedValuesOfSection);
  };

  const renderSwitches = (item: Record<string, any>, index: number) => {
    const isLastItem = index === section.attributes.length - 1;
    const borderBottom = isLastItem ? 'none' : '1px solid #EAF1FF';
    return (
      <DzBox style={{ padding: '1rem', borderBottom }} key={index}>
        <Flex gap={'1rem'}>
          <Switch
            onChange={(isChecked) => {
              handleSwitchChange(item.name, isChecked);
            }}
            checked={selected[item.name] || false}
            disabled={isDisabled}
          />
          <Flex vertical gap={'0.5rem'}>
            <DzBox>
              <Text style={{ marginLeft: '0.5rem', color: '#333' }}>
                {item.label}
              </Text>
            </DzBox>
            <DzBox>
              <FieldAdditionalContent config={item.config} />
            </DzBox>
          </Flex>
        </Flex>
      </DzBox>
    );
  };
  return <MapFunction items={section.attributes} renderItem={renderSwitches} />;
};
