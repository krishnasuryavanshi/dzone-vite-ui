import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { DownOutlined, UpOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Switch } from '@/uicomponents/switch';
import { Text } from '@/uicomponents/text';
import React, { useEffect, useState } from 'react';
import { SuppressionInclusion } from './suppression-inclusion';
import { ChipsInclusion } from './chips-inclusion';
import { Chips } from './chips';
import { DropdownCustom } from './dropdown-custom';
import { DropdownSearch } from './dropdown-search';
import { useValidationSettingStore } from '../../../store';
import { DzRecord } from '@/lib/types';

type TargetingSwitchProps = {
  sectionName: string;
  attribute: DzRecord;
};

export const TargetingSwitch = ({
  sectionName,
  attribute,
}: TargetingSwitchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { targetingSwitchFields, updateTargetingSwitchFields, isReadOnly } =
    useValidationSettingStore();

  const renderInputContents = () => {
    switch (attribute.type) {
      case 'switch_suppression_inclusion':
        return (
          <SuppressionInclusion
            attribute={attribute}
            sectionName={sectionName}
          />
        );
      case 'switch_chips_inclusion':
        return (
          <ChipsInclusion attribute={attribute} sectionName={sectionName} />
        );
      case 'switch_chips':
        return <Chips attribute={attribute} sectionName={sectionName} />;
      case 'switch_dropdown_custom':
        return (
          <DropdownCustom attribute={attribute} sectionName={sectionName} />
        );
      case 'switch_dropdown_searchable':
        return (
          <DropdownSearch attribute={attribute} sectionName={sectionName} />
        );
      default:
        return null;
    }
  };

  const handleOpening = () => {
    if (targetingSwitchFields[attribute.name]) {
      setIsOpen(!isOpen);
    }
  };

  const handleSwitchChange = (isChecked: boolean) => {
    updateTargetingSwitchFields(attribute.name, isChecked);
    setIsOpen(isChecked);
  };

  useEffect(() => {
    const isChecked = targetingSwitchFields[attribute.name] || false;
    setIsOpen(isChecked);
  }, [targetingSwitchFields, attribute.name]);

  return (
    <Flex vertical gap={'0.5rem'}>
      <Flex
        justify='space-between'
        align='center'
        style={{
          padding: '1.25rem 1.5rem',
        }}>
        <Flex gap={'0.75rem'} align='center'>
          <Switch
            onChange={handleSwitchChange}
            checked={targetingSwitchFields[attribute.name] || false}
            disabled={isReadOnly}
          />
          <Text>{attribute.label}</Text>
        </Flex>
        <DzBox
          onClick={handleOpening}
          style={{
            cursor: targetingSwitchFields[attribute.name]
              ? 'pointer'
              : 'not-allowed',
            opacity: targetingSwitchFields[attribute.name] ? 1 : 0.5,
          }}>
          {isOpen ? <UpOutlined /> : <DownOutlined />}
        </DzBox>
      </Flex>
      <Hideable show={isOpen}>
        <DzBox
          style={{ padding: '0.5rem 0.75rem', borderTop: '1px solid #E5EBF1' }}>
          {renderInputContents()}
        </DzBox>
      </Hideable>
    </Flex>
  );
};
