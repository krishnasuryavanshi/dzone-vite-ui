import { DzBox } from '@/components/layout/v1';
import { Input } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Tag } from '@/uicomponents/tag';
import React, { useState } from 'react';
import { useValidationSettingStore } from '../../../store';
import {
  processChipInput,
  shouldCreateChip,
  processPastedText,
} from '@/lib/utils/chip-utils';

type ChipsInputProps = {
  cssClassName?: string;
  options: string[];
  handleOptionChange: (value: string[]) => void;
  handleRemoveOption: (value: string) => void;
};

export const ChipsInput = ({
  cssClassName,
  options,
  handleOptionChange,
  handleRemoveOption,
}: ChipsInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const { isReadOnly } = useValidationSettingStore();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (shouldCreateChip(e.key)) {
      e.preventDefault();
      const value = inputValue.trim();
      if (value && !options.includes(value)) {
        handleOptionChange([...options, value]);
        setInputValue('');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const { newValues, remainingInput } = processChipInput(value, options);

    if (newValues.length > 0) {
      handleOptionChange([...options, ...newValues]);
    }

    setInputValue(remainingInput);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const { newValues } = processPastedText(pastedText, options);

    if (newValues.length > 0) {
      handleOptionChange([...options, ...newValues]);
    }

    setInputValue('');
  };

  return (
    <>
      <DzBox style={{ width: '100%' }}>
        <Input
          disabled={isReadOnly}
          className={cssClassName}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          style={{
            height: '3rem',
            width: '100%',
            border: 'none',
            outline: 'none',
            background: '#fff',
          }}
          placeholder='Type the value and use comma (,), Enter, or Tab to separate each value into a chip'
        />
      </DzBox>
      <Flex wrap='wrap' style={{ width: '100%' }}>
        {options.map((option, index) => (
          <Tag
            bordered={false}
            style={{
              margin: '0.5rem 0.5rem 0 0',
              padding: '0.5rem',
              color: '#707070',
            }}
            closable
            onClose={() => !isReadOnly && handleRemoveOption(option)}
            key={`${option}-${index}`}>
            {option}
          </Tag>
        ))}
      </Flex>
    </>
  );
};
