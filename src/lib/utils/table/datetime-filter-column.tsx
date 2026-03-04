import { FilterDropdownProps } from '@/lib/types/uicomponents';
import { CalendarOutlined } from '@ant-design/icons';
import { DateTimeRangeFilter } from './datetime-range-filter';
import { DZONE_CLR_BLACK, DZONE_CLR_GRAY_2 } from '@/lib/constants';

export function getDateTimeFilterColumn() {
  return {
    filterIcon: (filtered: boolean) => (
      <CalendarOutlined
        style={{
          color: filtered ? '#fff' : DZONE_CLR_GRAY_2,
          backgroundColor: filtered ? DZONE_CLR_BLACK : 'transparent',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: 4,
        }}
      />
    ),
    filterDropdown: (props: FilterDropdownProps) => <DateTimeRangeFilter {...props} />,
  };
}
