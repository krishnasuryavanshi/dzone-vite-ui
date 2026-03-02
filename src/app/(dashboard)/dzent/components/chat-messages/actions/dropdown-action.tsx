import { DropdownCustomAddOptions } from '@/app/(dashboard)/lead-validation-settings/components/targeting/inputs/dropdown-custom-add-options';
import { DzBox } from '@/components/layout/v1';
import { Hideable, MapFunction } from '@/components/shared';
import { CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { FormInstance } from '@/uicomponents/form';
import { Input } from '@/uicomponents/form/input';
import { CheckOutlined, SearchOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { useEffect, useState } from 'react';

type DropdownActionProps = {
  options: DzRecord[];
  name: string;
  form: FormInstance;
  multiple?: boolean;
  searchable?: boolean;
  customRangeOptions?: boolean;
};

export const DropdownAction = ({
  options,
  name,
  form,
  multiple,
  searchable,
  customRangeOptions,
}: DropdownActionProps) => {
  const [allOptions, setAllOptions] = useState<DzRecord[]>([...options]);
  const [filteredOptions, setFilteredOptions] = useState<DzRecord[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<DzRecord[]>([]);
  const [isCustomOptionFormOpened, setIsCustomOptionFormOpened] =
    useState(false);

  useEffect(() => {
    const filteredOptions = allOptions.filter(
      ({ label }: DzRecord) =>
        !searchText.trim() ||
        (searchText.trim() &&
          label.toLowerCase().includes(searchText.trim().toLowerCase())),
    );
    setFilteredOptions(filteredOptions);
  }, [searchText]);

  const handleAddOption = (newOption: DzRecord) => {
    setAllOptions((prev) => [...prev, newOption]);
    setFilteredOptions((prev) => [...prev, newOption]);
    setSearchText('');
    handleOptionSelect(newOption);
    setIsCustomOptionFormOpened(false);
  };

  const cancelAddOption = () => {
    setIsCustomOptionFormOpened(false);
  };

  const handleSelectAll = () => {
    if (selectedOptions.length === allOptions.length) {
      setSelectedOptions([]);
      form.setFieldValue(name, []);
      return;
    }

    setSelectedOptions(allOptions);
    form.setFieldValue(name, allOptions);
    setSearchText('');
  };

  const handleOptionSelect = (item: DzRecord) => {
    if (!multiple) {
      form.setFieldValue(name, item);
      setSelectedOptions([item]);
      return;
    }

    let selectedItems: DzRecord[] = [...(selectedOptions || [])];

    if (selectedItems.includes(item)) {
      selectedItems = selectedItems.filter(
        (option: DzRecord) => option !== item,
      );
    } else {
      selectedItems.push(item);
    }

    setSelectedOptions(selectedItems);
    form.setFieldValue(name, selectedItems);
  };

  const renderOption = (item: DzRecord, index: number) => {
    return (
      <DropDownOption
        key={index}
        item={item}
        selectedOptions={selectedOptions}
        onSelect={handleOptionSelect}
      />
    );
  };

  return (
    <DzBox
      style={{
        backgroundColor: CLR_WHITE,
        borderRadius: '4px',
      }}
      className={`dropdown-action ${customRangeOptions ? 'custom-range-options' : ''}`}>
      <Hideable show={isCustomOptionFormOpened}>
        <DzBox style={{ padding: '0.5rem' }}>
          <DropdownCustomAddOptions
            options={allOptions as any}
            onAddOption={handleAddOption}
            onCancel={cancelAddOption}
            variant='small'
          />
        </DzBox>
      </Hideable>
      <Hideable show={!isCustomOptionFormOpened}>
        <Flex vertical>
          <Hideable show={!!searchable}>
            <DzBox>
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                autoFocus
                style={{ height: '2rem', backgroundColor: '#fff' }}
                suffix={<SearchOutlined />}
                placeholder='Search '
              />
            </DzBox>
          </Hideable>
          <Hideable show={filteredOptions.length > 0}>
            <Hideable show={!!multiple}>
              <SelectAllOption onSelectAll={handleSelectAll} />
            </Hideable>
          </Hideable>
          <DzBox
            style={{
              maxHeight: '10rem',
              overflowY: 'auto',
            }}>
            <Hideable show={filteredOptions.length > 0}>
              <MapFunction items={filteredOptions} renderItem={renderOption} />
            </Hideable>
          </DzBox>
          <Hideable show={!!customRangeOptions}>
            <DzBox
              style={{
                marginTop: '0.25rem',
                padding: '0.5rem 1rem',
                background: '#F4F4F4',
                cursor: 'pointer',
              }}
              onClick={() => setIsCustomOptionFormOpened(true)}>
              <Flex justify='space-between'>
                <DzBox>
                  <Text style={{ fontSize: '0.875rem' }}>
                    + Add a custom range
                  </Text>
                </DzBox>
              </Flex>
            </DzBox>
          </Hideable>
        </Flex>
      </Hideable>
    </DzBox>
  );
};

type DropDownOptionProps = {
  item: DzRecord;
  selectedOptions?: DzRecord[];
  onSelect: (item: DzRecord) => void;
};

const DropDownOption = ({
  item,
  selectedOptions,
  onSelect,
}: DropDownOptionProps) => {
  return (
    <DzBox
      className={`dropdown-option ${selectedOptions?.includes(item) ? 'selected' : ''}`}
      style={{ padding: '0.5rem', cursor: 'pointer' }}
      onClick={() => onSelect(item)}>
      <Flex justify='space-between'>
        <DzBox>
          <Text
            title={item.label}
            style={{ fontSize: '0.875rem', width: '16rem' }}
            ellipsis>
            {item.label}
          </Text>
        </DzBox>
        <Hideable show={!!selectedOptions?.includes(item)}>
          <DzBox>
            <CheckOutlined style={{ color: '#2563EB' }} />
          </DzBox>
        </Hideable>
      </Flex>
    </DzBox>
  );
};

const SelectAllOption = ({ onSelectAll }: { onSelectAll: () => void }) => {
  return (
    <DzBox
      className={`dropdown-option select-all`}
      style={{ padding: '0.5rem', cursor: 'pointer' }}
      onClick={onSelectAll}>
      <Flex justify='space-between'>
        <DzBox>
          <Text style={{ fontSize: '0.875rem', width: '10rem' }} strong>
            Select All
          </Text>
        </DzBox>
      </Flex>
    </DzBox>
  );
};
