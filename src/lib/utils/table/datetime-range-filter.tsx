import { DzBox } from '@/components/layout/v1';
import { FilterDropdownProps } from '@/lib/types/uicomponents';
import { RangePicker } from '@/uicomponents/form/input/date-picker';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useState, useMemo } from 'react';
import { debounce } from 'lodash';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

interface IDateTimeRangeFilterProps extends FilterDropdownProps {}

interface DateTimeRangeValue {
  from?: string | null;
  to?: string | null;
}

export const DateTimeRangeFilter: FC<IDateTimeRangeFilterProps> = ({
  selectedKeys,
  setSelectedKeys,
  confirm,
}) => {
  const [range, setRange] = useState<{
    from: Dayjs | null;
    to: Dayjs | null;
  } | null>(null);

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    // Handle incoming filter values - could be array with object or direct object
    if (
      Array.isArray(selectedKeys) &&
      selectedKeys.length > 0 &&
      typeof selectedKeys[0] === 'object'
    ) {
      const filterValue = selectedKeys[0] as DateTimeRangeValue;
      if (
        filterValue &&
        (filterValue.from !== undefined || filterValue.to !== undefined)
      ) {
        setRange({
          from: filterValue.from
            ? dayjs.utc(filterValue.from).tz(browserTimezone)
            : null,
          to: filterValue.to
            ? dayjs.utc(filterValue.to).tz(browserTimezone)
            : null,
        });
      } else {
        setRange(null);
      }
    } else if (
      selectedKeys &&
      typeof selectedKeys === 'object' &&
      !Array.isArray(selectedKeys)
    ) {
      const filterValue = selectedKeys as unknown as DateTimeRangeValue;
      if (filterValue.from !== undefined || filterValue.to !== undefined) {
        setRange({
          from: filterValue.from
            ? dayjs.utc(filterValue.from).tz(browserTimezone)
            : null,
          to: filterValue.to
            ? dayjs.utc(filterValue.to).tz(browserTimezone)
            : null,
        });
      } else {
        setRange(null);
      }
    } else {
      setRange(null);
    }
  }, [selectedKeys, browserTimezone]);

  // Debounced confirm function
  const debouncedConfirm = useMemo(
    () =>
      debounce((filterValue: DateTimeRangeValue) => {
        if (filterValue.from !== null || filterValue.to !== null) {
          setSelectedKeys([filterValue] as any);
        } else {
          setSelectedKeys([] as any);
        }

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

  // Convert local time to UTC for the filter value
  const toUtcString = (date: Dayjs | null): string | null => {
    if (!date) return null;
    return date.utc().format('YYYY-MM-DDTHH:mm:ss');
  };

  const onCalendarChange = (
    dates: null | (Dayjs | null)[],
    _dateStrings: string[],
  ) => {
    if (dates && (dates[0] || dates[1])) {
      const newRange = {
        from: dates[0] || null,
        to: dates[1] || null,
      };
      setRange(newRange);

      const filterValue: DateTimeRangeValue = {
        from: toUtcString(dates[0]),
        to: toUtcString(dates[1]),
      };

      debouncedConfirm(filterValue);
    }
  };

  const onChange = (dates: null | (Dayjs | null)[], _dateStrings: string[]) => {
    if (dates && (dates[0] || dates[1])) {
      const newRange = {
        from: dates[0] || null,
        to: dates[1] || null,
      };
      setRange(newRange);

      const filterValue: DateTimeRangeValue = {
        from: toUtcString(dates[0]),
        to: toUtcString(dates[1]),
      };

      debouncedConfirm(filterValue);
    } else {
      setRange(null);
      setSelectedKeys([] as any);
      confirm?.({ closeDropdown: false });
    }
  };

  const rangeValue: [Dayjs | null, Dayjs | null] | null = range
    ? [range.from, range.to]
    : null;

  return (
    <Flex
      style={{ padding: 8 }}
      className='dz-calendar-dark'
      onKeyDown={(e) => e.stopPropagation()}
      vertical
      gap={'1rem'}>
      <DzBox>
        <RangePicker
          showTime={{ format: 'hh:mm A', use12Hours: true }}
          format='DD-MMM-YYYY hh:mm A'
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
