import { DzBox } from '@/components/layout/v1';
import { FilterDropdownProps } from '@/lib/types/uicomponents';
import { RangePicker } from '@/uicomponents/form/input/date-picker';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useState, useMemo } from 'react';
import { debounce } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';

interface IDateRangeObjectFilterProps extends FilterDropdownProps {}

interface DateRangeValue {
  from?: string | null;
  to?: string | null;
}

export const DateRangeObjectFilter: FC<IDateRangeObjectFilterProps> = ({
  selectedKeys,
  setSelectedKeys,
  confirm,
}) => {
  const [range, setRange] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  } | null>(null);

  useEffect(() => {
    // Handle incoming filter values - could be array with object or direct object
    if (
      Array.isArray(selectedKeys) &&
      selectedKeys.length > 0 &&
      typeof selectedKeys[0] === 'object'
    ) {
      // If it's an array with an object inside
      const filterValue = selectedKeys[0] as DateRangeValue;
      if (filterValue && (filterValue.from !== undefined || filterValue.to !== undefined)) {
        setRange({
          from: filterValue.from ? dayjs(filterValue.from) : null,
          to: filterValue.to ? dayjs(filterValue.to) : null,
        });
      } else {
        setRange(null);
      }
    } else if (selectedKeys && typeof selectedKeys === 'object' && !Array.isArray(selectedKeys)) {
      // If it's a direct object
      const filterValue = selectedKeys as unknown as DateRangeValue;
      if (filterValue.from !== undefined || filterValue.to !== undefined) {
        setRange({
          from: filterValue.from ? dayjs(filterValue.from) : null,
          to: filterValue.to ? dayjs(filterValue.to) : null,
        });
      } else {
        setRange(null);
      }
    } else {
      setRange(null);
    }
  }, [selectedKeys]);

  // Debounced confirm function - same pattern as working dropdown
  const debouncedConfirm = useMemo(
    () =>
      debounce((filterValue: DateRangeValue) => {
        // Check if we have any actual values to filter
        if (filterValue.from !== null || filterValue.to !== null) {
          // Set as an array with the object inside - this might be what the table expects
          setSelectedKeys([filterValue] as any);
        } else {
          // Clear the filter
          setSelectedKeys([] as any);
        }

        // Call confirm to trigger the table's onChange
        if (confirm) {
          confirm({ closeDropdown: false });
        }
      }, 500),
    [setSelectedKeys, confirm],
  );

  useEffect(() => {
    return () => {
      debouncedConfirm.cancel();
    };
  }, [debouncedConfirm]);

  // This fires when dates are being selected (including partial selection)
  const onCalendarChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates && (dates[0] || dates[1])) {
      // Update local state
      const newRange = {
        from: dates[0] || null,
        to: dates[1] || null,
      };
      setRange(newRange);

      // Build the filter value
      const filterValue: DateRangeValue = {
        from: dates[0] ? dateStrings[0] : null,
        to: dates[1] ? dateStrings[1] : null,
      };

      // Use debounced confirm for partial selection
      debouncedConfirm(filterValue);
    }
  };

  // This fires when selection is complete or cleared
  const onChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates && (dates[0] || dates[1])) {
      // Update local state
      const newRange = {
        from: dates[0] || null,
        to: dates[1] || null,
      };
      setRange(newRange);

      // Build the filter value
      const filterValue: DateRangeValue = {
        from: dates[0] ? dateStrings[0] : null,
        to: dates[1] ? dateStrings[1] : null,
      };

      // Use debounced confirm
      debouncedConfirm(filterValue);
    } else {
      // Clear immediately without debounce
      setRange(null);
      // Clear by setting empty array
      setSelectedKeys([] as any);
      confirm?.({ closeDropdown: false });
    }
  };

  // Convert object range back to array format for RangePicker
  const rangeValue: [Dayjs | null, Dayjs | null] | null = range ? [range.from, range.to] : null;

  return (
    <Flex
      style={{ padding: 8 }}
      className='dz-calendar-dark'
      onKeyDown={(e) => e.stopPropagation()}
      vertical
      gap={'1rem'}
    >
      <DzBox>
        <RangePicker
          format='YYYY-MM-DD'
          value={rangeValue}
          onChange={onChange}
          onCalendarChange={onCalendarChange}
          style={{ width: '100%' }}
          allowClear
          allowEmpty={[true, true]}
          placeholder={['From', 'To']}
        />
      </DzBox>
    </Flex>
  );
};
