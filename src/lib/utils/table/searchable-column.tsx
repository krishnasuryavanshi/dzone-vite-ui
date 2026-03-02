import { FilterDropdownProps } from '@/lib/types/uicomponents';
import { SearchOutlined } from '@ant-design/icons';
import { SearchDropdown } from './search-dropdown';
import { DZONE_CLR_BLACK, DZONE_CLR_GRAY_2 } from '@/lib/constants';

export function getSearchableColumn(
  columnName: string,
  isMinLengthRequiredForSearch: boolean,
  searchCharacterMinLength: number,
) {
  return {
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
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
      <SearchDropdown
        columnName={columnName}
        isMinLengthRequiredForSearch={isMinLengthRequiredForSearch}
        searchCharacterMinLength={searchCharacterMinLength}
        {...props}
      />
    ),
  };
}
