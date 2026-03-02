import { FilterDropdownProps } from '@/lib/types/uicomponents';
import { CalendarOutlined } from '@ant-design/icons';
import { DatepickerDropdown } from './datepicker-dropdown';
import { DZONE_CLR_BLACK } from '@/lib/constants';

export function getDateFilterColumn() {
  return {
    filterIcon: (filtered: boolean) => (
      <CalendarOutlined
        style={{
          color: filtered ? '#fff' : '#707070',
          backgroundColor: filtered ? `${DZONE_CLR_BLACK}` : 'transparent',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: 4,
        }}
      />
    ),
    filterDropdown: (props: FilterDropdownProps) => (
      <DatepickerDropdown {...props} />
    ),
  };
}
