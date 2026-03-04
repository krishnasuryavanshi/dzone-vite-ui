import { FilterDropdownProps } from '@/lib/types/uicomponents';
import { FilterOutlined } from '@/uicomponents/icons';
import { FilterDropdown } from './filter-dropdown';
import { DZONE_CLR_BLACK, DZONE_CLR_GRAY_2 } from '@/lib/constants';

export interface IFilterMetadata {
  filters: string[] | { text: string; value: string }[];
  isDynamicOptions?: boolean;
  isDisabled?: boolean;
}

export function getFilterableColumn(options: IFilterMetadata) {
  let filterOptions = options?.isDynamicOptions
    ? options?.filters
    : options?.filters?.map((filter) => ({ text: filter, value: filter }));

  const filterableColumnObj = {
    filters: filterOptions,
    filterIcon: (filtered: boolean) => (
      <FilterOutlined
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
    filterDropdown: (props: FilterDropdownProps) => (
      <FilterDropdown options={filterOptions as any} {...props} disabled={options?.isDisabled} />
    ),
  };

  return filterableColumnObj;
}
