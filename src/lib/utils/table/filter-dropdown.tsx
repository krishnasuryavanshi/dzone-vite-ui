import { DzBox } from '@/components/layout/v1';
import { CheckboxProps, FilterDropdownProps } from '@/lib/types/uicomponents';
import { Checkbox, CheckboxGroup, Input } from '@/uicomponents/form/input';
import { SearchOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { debounce } from 'lodash';
import { FC, useEffect, useState, useMemo } from 'react';
import './filterable-dropdown.scss';

export interface IFilterDropdownProps extends FilterDropdownProps {
  options: { text: string; value: string }[];
  disabled?: boolean;
}

export const FilterDropdown: FC<IFilterDropdownProps> = ({
  options,
  selectedKeys,
  setSelectedKeys,
  confirm,
  disabled,
}) => {
  const [selectedFilters, setSelectedFilters] = useState(selectedKeys || []);
  const [allOptions, setAllOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [filteredOptions, setFilteredOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    const all = options.map(({ text: label, value }) => ({
      label,
      value,
    }));
    setAllOptions(all);
    setFilteredOptions(all);
  }, [options]);

  useEffect(() => {
    setSelectedFilters(selectedKeys);
  }, [selectedKeys]);

  // Create a debounced function to trigger API calls
  const debouncedConfirm = useMemo(
    () =>
      debounce((filters: string[]) => {
        setSelectedKeys(filters);
        // Call confirm with closeDropdown false to keep dropdown open
        confirm?.({ closeDropdown: false });
      }, 500), // 500ms delay to reduce API calls
    [setSelectedKeys, confirm],
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedConfirm.cancel();
    };
  }, [debouncedConfirm]);

  const onChange = (list: string[]) => {
    setSelectedFilters(list);
    // Trigger API call immediately when selection changes
    debouncedConfirm(list);
  };

  const onChangeAll: CheckboxProps['onChange'] = (e) => {
    const newFilters = e.target.checked
      ? options.map(({ value }) => value)
      : [];
    setSelectedFilters(newFilters);
    // Trigger API call immediately when "Select All" changes
    debouncedConfirm(newFilters);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value?.trim()) {
      setFilteredOptions(allOptions);
    } else {
      setFilteredOptions(
        allOptions.filter(({ label }) =>
          label.toLowerCase().includes(value.toLowerCase()),
        ),
      );
    }
  };

  return (
    <Flex
      style={{ padding: 8 }}
      className='filter-dropdown-container dz-checkbox-dark'
      vertical
      gap={'1rem'}>
      <DzBox>
        <Input
          placeholder='Search'
          suffix={<SearchOutlined />}
          onChange={handleSearch}
          disabled={disabled}
        />
      </DzBox>
      <DzBox>
        <Checkbox
          disabled={disabled}
          onChange={onChangeAll}
          checked={selectedFilters?.length === options.length}>
          Select All
        </Checkbox>
      </DzBox>
      <DzBox className='filter-options'>
        <CheckboxGroup
          disabled={disabled}
          className='filter-checkbox-group'
          options={filteredOptions}
          value={selectedFilters as string[]}
          onChange={onChange}
        />
      </DzBox>
    </Flex>
  );
};
