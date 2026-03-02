import { DzBox } from '@/components/layout/v1';
import { FilterDropdownProps } from '@/lib/types/uicomponents';
import { DatePicker } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useState, useMemo } from 'react';
import { dateObject, formatDate } from '../date-util';
import { debounce } from 'lodash';

interface IDatepickerDropdownProps extends FilterDropdownProps {}

export const DatepickerDropdown: FC<IDatepickerDropdownProps> = ({
  selectedKeys,
  setSelectedKeys,
  confirm,
}) => {
  const [date, setDate] = useState(selectedKeys[0] || '');

  useEffect(() => {
    setDate(getValidDate(selectedKeys as string[]));
  }, [selectedKeys]);

  // Create a debounced function to trigger API calls
  const debouncedConfirm = useMemo(
    () =>
      debounce((dateValue: string) => {
        const validDate = dateObject(dateValue);
        const dt = formatDate(validDate);
        setSelectedKeys(dt ? [dt] : []);
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

  const onChange = (value: any) => {
    const formattedDate = formatDate(value);
    setDate(formattedDate);
    // Trigger API call immediately when date changes
    if (formattedDate) {
      debouncedConfirm(formattedDate);
    } else {
      // If date is cleared, immediately clear the filter
      setSelectedKeys([]);
      confirm?.({ closeDropdown: false });
    }
  };

  return (
    <Flex
      style={{ padding: 8 }}
      onKeyDown={(e) => e.stopPropagation()}
      vertical
      gap={'1rem'}>
      <DzBox>
        <DatePicker
          format={{
            format: 'DD MMM YYYY',
            type: 'mask',
          }}
          value={dateObject(date as string)}
          onChange={onChange}
          style={{ width: '100%', height: '2.5rem' }}
        />
      </DzBox>
    </Flex>
  );
};

const getValidDate = (date?: string[]) => {
  if (!date?.length) {
    return formatDate(dateObject(''));
  } else {
    return date[0];
  }
};
