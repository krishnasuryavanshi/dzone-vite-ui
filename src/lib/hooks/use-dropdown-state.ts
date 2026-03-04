import { CheckboxChangeEvent, CheckboxProps } from 'antd/es/checkbox/Checkbox';
import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

interface Option {
  label: string;
  value: string;
}

export const useDropdownState = (
  selected: string[],
  options: { text: string; value: string }[],
  onApply: (data: string[]) => void,
  onReset: (data: string[]) => void,
  closeOpenedDropdown: () => void,
  instantFilter?: boolean,
) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [allOptions, setAllOptions] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Create debounced apply function for instant filtering
  const debouncedApply = useRef(
    debounce((values: string[]) => {
      onApply(values);
      // Reset loading state after applying
      setTimeout(() => setIsLoading(false), 100);
    }, 300),
  ).current;

  useEffect(() => {
    setSelectedOptions(selected?.length ? selected : []);
  }, [selected]);

  useEffect(() => {
    const all = options?.map(({ text: label, value }) => ({
      label,
      value,
    }));
    setAllOptions(all);
    setFilteredOptions(all);
  }, [options]);

  const onChange = (list: string[]) => {
    setSelectedOptions(list);

    // Apply changes instantly with debouncing when instant filter is enabled
    if (instantFilter) {
      setIsLoading(true);
      debouncedApply(list);
    }
  };

  const handleReset = () => {
    closeOpenedDropdown();
    setSelectedOptions([]);
    onReset([]);
  };

  const handleApply = () => {
    closeOpenedDropdown();
    onApply(selectedOptions);
  };

  const onChangeAll: CheckboxProps['onChange'] = (e) => {
    const newSelection = e.target.checked ? options.map(({ value }) => value) : [];
    setSelectedOptions(newSelection);

    // Apply changes instantly with debouncing when instant filter is enabled
    if (instantFilter) {
      setIsLoading(true);
      debouncedApply(newSelection);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value?.trim()) {
      setFilteredOptions(allOptions);
    } else {
      setFilteredOptions(
        allOptions.filter(({ label }) => label.toLowerCase().includes(value.toLowerCase())),
      );
    }
  };

  return {
    selectedOptions,
    filteredOptions,
    handleSearch,
    onChangeAll,
    setSelectedOptions,
    setFilteredOptions,
    handleApply,
    handleReset,
    onChange,
    isLoading,
  };
};
