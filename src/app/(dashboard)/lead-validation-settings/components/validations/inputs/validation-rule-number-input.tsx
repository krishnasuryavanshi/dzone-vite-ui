import { DzBox } from '@/components/layout/v1';
import { InputNumber } from '@/uicomponents/form/input';
import { useEffect, useState } from 'react';
import { ValidationSettingRuleSectionProps } from '../../../lib/types';
import { useValidationSettingStore } from '../../../store';

export const ValidationRuleNumberInput = ({
  section,
  isDisabled,
}: ValidationSettingRuleSectionProps) => {
  const [selected, setSelected] = useState<number>(1);
  const { selectedValues, setSelectedValues } = useValidationSettingStore();

  const key = section.attributes[0]?.name;

  useEffect(() => {
    if (key) {
      setSelected(selectedValues[section.name]?.[key] || 1);
    }
  }, [selectedValues, section, key]);

  const handleInputNumberChange = (value: number | string | null) => {
    if (key) {
      setSelectedValues(section.name, { [key]: value });
    }
  };

  return (
    <DzBox style={{ width: '100%' }}>
      <InputNumber
        placeholder={`Enter ${section.label}`}
        onChange={handleInputNumberChange}
        value={selected}
        disabled={isDisabled}
        min={1}
        max={36}
        style={{ width: '100%', maxWidth: '20rem', backgroundColor: '#fff' }}
      />
    </DzBox>
  );
};
