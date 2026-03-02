import React, { useEffect, useState } from 'react';
import { ValidationSettingRuleSectionProps } from '../../../lib/types';
import { useValidationSettingStore } from '../../../store';
import { Select } from '@/uicomponents/form/input';
import { DzBox } from '@/components/layout/v1';

export const ValidationRuleDropdown = ({
  section,
  isDisabled,
}: ValidationSettingRuleSectionProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [selected, setSelected] = useState<string>('');
  const { selectedValues, setSelectedValues } = useValidationSettingStore();

  useEffect(() => {
    setSelected(Object.keys(selectedValues[section.name] || {})?.[0] || '');
  }, [selectedValues, section]);

  useEffect(() => {
    const newOptions = (section?.attributes?.[0]?.options || []).map(
      (item: Record<string, any>) => ({
        label: item.label,
        value: item.value,
      }),
    );
    setOptions(newOptions);
  }, [section]);

  const handleDropdownChange = (value: string) => {
    const selectedValuesOfSection = { [value]: true };
    setSelectedValues(section.name, selectedValuesOfSection);
  };

  return (
    <DzBox style={{ width: '100%' }}>
      <Select
        showSearch
        optionFilterProp='label'
        placeholder={`Select ${section.label}`}
        onChange={handleDropdownChange}
        options={options}
        value={selected}
        disabled={isDisabled}
        style={{ width: '100%', maxWidth: '20rem', backgroundColor: '#fff' }}
      />
    </DzBox>
  );
};
