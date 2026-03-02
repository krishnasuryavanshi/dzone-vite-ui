import { DzBox } from '@/components/layout/v1';
import { CheckOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React, { useEffect, useState } from 'react';
import { DropdownCustomAddOptions } from './dropdown-custom-add-options';
import { useValidationSettingStore } from '../../../store';

type DropdownCustomProps = {
  attribute: Record<string, any>;
  sectionName: string;
};

export const DropdownCustom = ({
  attribute,
  sectionName,
}: DropdownCustomProps) => {
  const [isCustomOptionFormOpened, setIsCustomOptionFormOpened] =
    useState(false);
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const { selectedValues, setSelectedValues, isReadOnly } =
    useValidationSettingStore();

  useEffect(() => {
    if (selectedValues?.[sectionName]?.[attribute.name]?.data?.length > 0) {
      setSelectedOptions(selectedValues[sectionName][attribute.name].data);
    } else {
      setSelectedOptions([]);
    }
  }, [selectedValues]);

  useEffect(() => {
    if (attribute.options.length > 0) {
      const formattedOptions = attribute.options.map(
        ({ label, value }: { label: string; value: string }) => ({
          label,
          value,
        }),
      );
      setOptions(formattedOptions);
    } else {
      setOptions([]);
    }
  }, [attribute]);

  useEffect(() => {
    if (selectedValues?.[sectionName]?.[attribute.name]?.data?.length > 0) {
      const selectedOptions =
        selectedValues[sectionName][attribute.name].data || [];

      if (selectedOptions?.length) {
        setOptions((prev) => {
          const existingValues = prev.map((option) => option.value);
          const newOptions = selectedOptions
            .filter((option: string) => !existingValues.includes(option))
            .map((option: string) => ({
              label: option,
              value: option,
            }));
          return [...prev, ...newOptions];
        });
      }
    }
  }, [selectedValues]);

  const handleOptionSelect = (value: string) => {
    const sectionSelection = selectedValues?.[sectionName];
    const attributeSelection = sectionSelection?.[attribute.name] || {
      type: 'OPTIONS',
      data: [],
    };

    if (attributeSelection.data.includes(value)) {
      attributeSelection.data = attributeSelection.data.filter(
        (option: string) => option !== value,
      );
    } else {
      attributeSelection.data.push(value);
    }

    setSelectedValues(sectionName, {
      ...sectionSelection,
      [attribute.name]: attributeSelection,
    });
  };

  const handleAddOption = (newOption: { label: string; value: string }) => {
    setOptions((prev) => [...prev, newOption]);
    handleOptionSelect(newOption.value);
    setIsCustomOptionFormOpened(false);
  };

  const cancelAddOption = () => {
    setIsCustomOptionFormOpened(false);
  };

  if (isCustomOptionFormOpened) {
    return (
      <DropdownCustomAddOptions
        options={options}
        onAddOption={handleAddOption}
        onCancel={cancelAddOption}
      />
    );
  }

  return (
    <DzBox className='dropdown-custom'>
      <Flex vertical>
        {options.length > 1 ? (
          <DzBox
            className='dropdown-option'
            style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            <Flex justify='space-between'>
              <DzBox
                onClick={() =>
                  !isReadOnly && setSelectedOptions(options.map((o) => o.value))
                }>
                <Text strong>Select All</Text>
              </DzBox>
            </Flex>
          </DzBox>
        ) : null}
        <DzBox
          style={{
            maxHeight: '15rem',
            overflowY: 'auto',
            marginRight: '-6px',
          }}>
          {options.length > 0
            ? options.map(
                ({ label, value }: { label: string; value: string }) => (
                  <DzBox
                    className={`dropdown-option ${selectedOptions.includes(value) ? 'selected' : ''}`}
                    style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                    key={value}
                    onClick={() => !isReadOnly && handleOptionSelect(value)}>
                    <Flex justify='space-between'>
                      <DzBox>
                        <Text>{label}</Text>
                      </DzBox>
                      {selectedOptions.includes(value) ? (
                        <DzBox>
                          <CheckOutlined style={{ color: '#2563EB' }} />
                        </DzBox>
                      ) : null}
                    </Flex>
                  </DzBox>
                ),
              )
            : null}
        </DzBox>
        <DzBox
          style={{
            marginTop: '0.25rem',
            padding: '0.5rem 1rem',
            background: '#F4F4F4',
            cursor: 'pointer',
          }}
          onClick={() => !isReadOnly && setIsCustomOptionFormOpened(true)}>
          <Flex justify='space-between'>
            <DzBox>
              <Text style={{ fontSize: '0.875rem' }}>+ Add a custom range</Text>
            </DzBox>
          </Flex>
        </DzBox>
      </Flex>
    </DzBox>
  );
};
