import React, { FC, useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import './dateRange-dropdown.scss';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';
import { TimeRangePickerProps } from '@/lib/types/uicomponents';
import { Space } from '@/uicomponents/layout';
import { RangePicker } from '@/uicomponents/form/input/date-picker';
import { DzBox } from '@/components/layout/v1';

interface IDateRangeDropdownProps {
  allDateRange?: { key: string; label: React.ReactNode }[];
  selectedDateRange?: string[];
  handleSelectionChange?: (data: any) => void;
}

export const DateRangeDropdown: FC<IDateRangeDropdownProps> = ({
  selectedDateRange,
  allDateRange,
  handleSelectionChange,
}) => {
  const ranges: TimeRangePickerProps['presets'] = [
    { label: 'Today', value: [dayjs(), dayjs()] },
    { label: 'Last 7 Days', value: [dayjs().subtract(6, 'day'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().subtract(29, 'day'), dayjs()] },
  ];
  const [range, setRange] = useState<any>(ranges[2].value);
  const filterValues = useFilterDashboardStore(
    (state: FilterState) => state.filterValues,
  );
  const setFilterValues = useFilterDashboardStore(
    (state: FilterState) => state.setFilterValues,
  );

  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[],
  ) => {
    if (dates) {
      const fromDate = dateStrings[0];
      const toDate = dateStrings[1];
      // Removed console.log to fix lint error
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedLineItems',
          selectedItems: [fromDate, toDate],
        });
      setRange(dates);
    } else {
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedLineItems',
          selectedItems: [],
        });
      setRange(null);
    }
  };

  useEffect(() => {
    if (filterValues?.reset) {
      setRange(ranges[2].value);
    }
  }, [filterValues]);
  useEffect(() => {
    const sd = range[0].format('YYYY-MM-DD');
    const ed = range[1].format('YYYY-MM-DD');
    setFilterValues({
      ...filterValues,
      dateRange: { startDate: sd, endDate: ed },
    });
  }, []);

  return (
    <DzBox className='placeholder-pink-500 datepicker-container'>
      <p className='text-sm' style={{ color: '#4F4F4F' }}>
        Date Range
      </p>
      <Space direction='vertical' size={12}>
        <RangePicker
          presets={ranges}
          onChange={onRangeChange}
          value={range}
          allowClear={false}
          className='custom-range-picker-icon'
        />
      </Space>
    </DzBox>
  );
};
