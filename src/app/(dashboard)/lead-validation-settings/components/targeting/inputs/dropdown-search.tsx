import { DzBox } from '@/components/layout/v1';
import { Input } from '@/uicomponents/form/input';
import { CheckOutlined, SearchOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React, { useEffect, useState } from 'react';
import { useValidationSettingStore } from '../../../store';

type DropdownSearchProps = {
  attribute: Record<string, any>;
  sectionName: string;
};

export const DropdownSearch = ({
  attribute,
  sectionName,
}: DropdownSearchProps) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>(
    [],
  );
  const [searchText, setSearchText] = useState('');
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
    const filteredOptions = attribute.options
      .filter(
        ({ label }: { label: string }) =>
          !searchText.trim() ||
          (searchText.trim() &&
            label.toLowerCase().includes(searchText.trim().toLowerCase())),
      )
      .map(({ label, value }: { label: string; value: string }) => ({
        label,
        value,
      }));
    setOptions(filteredOptions);
  }, [searchText]);

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

  return (
    <DzBox className='dropdown-search'>
      <Flex vertical>
        <DzBox style={{ marginBottom: '0.5rem' }}>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            autoFocus
            style={{ height: '2.5rem', backgroundColor: '#fff' }}
            suffix={<SearchOutlined />}
            placeholder='Search '
            disabled={isReadOnly}
          />
        </DzBox>
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
      </Flex>
    </DzBox>
  );
};
