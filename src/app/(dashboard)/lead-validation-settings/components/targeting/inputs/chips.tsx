import { DzBox } from '@/components/layout/v1';
import { Input } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React, { useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../../store';
import { ChipsInput } from './chips-input';
import { DzRecord } from '@/lib/types';

type ChipsProps = {
  attribute: DzRecord;
  sectionName: string;
};

export const Chips = ({ attribute, sectionName }: ChipsProps) => {
  const { selectedValues, setSelectedValues, isReadOnly } = useValidationSettingStore();

  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (selectedValues?.[sectionName]?.[attribute.name]?.data?.length > 0) {
      setOptions(selectedValues[sectionName][attribute.name].data);
    } else {
      setOptions([]);
    }
  }, [selectedValues]);

  const handleAddOption = (values: string[]) => {
    const sectionSelection = selectedValues?.[sectionName];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: {
        type: 'OPTIONS',
        data: values,
      },
    });
  };

  const handleRemoveOption = (value: string) => {
    const sectionSelection = selectedValues?.[sectionName];
    const attributeSelectionValues =
      sectionSelection?.[attribute.name]?.data?.filter((val: string) => val !== value) || [];

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: {
        type: 'OPTIONS',
        data: attributeSelectionValues,
      },
    });
  };

  const handlePastedText = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const values = pastedText.split(/[\s,]+/).filter(Boolean);
    const setOfValues = new Set(values);
    const uniqueValues = Array.from(setOfValues);

    const sectionSelection = selectedValues?.[sectionName];
    const attributeSelection = sectionSelection?.[attribute.name] || {
      type: 'OPTIONS',
      data: uniqueValues,
    };

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: attributeSelection,
    });
  };

  return (
    <DzBox
      style={{
        borderRadius: '5px',
        border: '1px solid #E9EEF4',
        padding: '1rem 1.25rem',
      }}
    >
      <Flex align='center' vertical gap={'0.75rem'} style={{ width: '100%' }}>
        <ChipsInput
          handleOptionChange={handleAddOption}
          handleRemoveOption={handleRemoveOption}
          options={options}
          cssClassName='chips-input-textbox'
        />
        {options.length > 0 ? null : (
          <>
            <DzBox>
              <Text style={{ fontSize: '1.25rem', color: '#707070' }} strong>
                Or
              </Text>
            </DzBox>
            <DzBox style={{ width: '100%' }}>
              <Input
                disabled={isReadOnly}
                className='chips-input-textbox'
                onPaste={handlePastedText}
                style={{
                  height: '3rem',
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  background: '#fff',
                }}
                placeholder='Copy paste here'
              />
            </DzBox>
          </>
        )}
      </Flex>
    </DzBox>
  );
};
