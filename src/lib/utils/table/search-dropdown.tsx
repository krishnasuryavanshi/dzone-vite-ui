import { DzBox } from '@/components/layout/v1';
import { FilterDropdownProps } from '@/lib/types/uicomponents';
// Using AntdInput directly from 'antd' to support ref without requiring forwardRef in our wrapper component
import { Input as AntdInput } from 'antd';
import { CloseOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { t } from 'i18next';
import { debounce } from 'lodash';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { DZONE_CLR_BLACK } from '@/lib/constants';

interface ISearchDropdownProps extends FilterDropdownProps {
  columnName: string;
  isMinLengthRequiredForSearch: boolean;
  searchCharacterMinLength: number;
}

export const SearchDropdown: FC<ISearchDropdownProps> = ({
  columnName,
  selectedKeys,
  setSelectedKeys,
  confirm,
  close,
}) => {
  const [searchValue, setSearchValue] = useState(selectedKeys[0] || '');
  const inputRef = useRef<any>(null);

  // Create a stable debounced search function using useMemo
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        // No minimum length requirement - search with any number of characters
        const updatedSelectedKeys = value ? [value] : [];
        setSelectedKeys(updatedSelectedKeys);
        // Call confirm with closeDropdown false to trigger search without closing
        confirm?.({ closeDropdown: false });
      }, 500), // 500ms delay to reduce API calls while user is typing
    [setSelectedKeys, confirm],
  );

  useEffect(() => {
    setSearchValue(selectedKeys[0] || '');
  }, [selectedKeys]);

  // Auto-focus on input when dropdown opens
  useEffect(() => {
    // Use requestAnimationFrame for better focus timing
    const focusInput = () => {
      if (inputRef.current && inputRef.current.input) {
        // For Ant Design Input, we need to access the actual input element
        inputRef.current.input.focus();
        // Select all text if there's existing value
        if (searchValue) {
          inputRef.current.input.select();
        }
      } else if (inputRef.current) {
        // Fallback for direct input reference
        inputRef.current.focus();
        if (searchValue) {
          inputRef.current.select();
        }
      }
    };

    // Try multiple strategies to ensure focus
    requestAnimationFrame(() => {
      focusInput();
      // Double-check with a small timeout as fallback
      setTimeout(focusInput, 50);
    });

    return () => {};
  }, []); // Run only on mount

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Apply button logic removed - no longer needed for live search

  const onChange = (value: string) => {
    setSearchValue(value);
    // Trigger live search with debounce for any input
    debouncedSearch(value);
  };

  return (
    <Flex
      style={{ padding: 8, width: '18.75rem' }}
      onKeyDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      vertical
      gap={'1rem'}
    >
      <DzBox>
        <AntdInput
          ref={inputRef}
          placeholder={`Search ${t(columnName)}`}
          value={searchValue}
          onChange={(e) => onChange(e.target.value)}
          onPressEnter={() => {
            // Apply search and close dropdown on Enter
            if (searchValue) {
              setSelectedKeys([searchValue]);
              confirm?.();
            }
            close?.();
          }}
          style={{
            height: '2.5rem',
            boxShadow: `${DZONE_CLR_BLACK}52 0px 0px 6px 0px inset`,
            borderColor: DZONE_CLR_BLACK,
          }}
          suffix={
            <CloseOutlined
              style={{ cursor: 'pointer', color: DZONE_CLR_BLACK }}
              onClick={() => {
                debouncedSearch.cancel(); // Cancel any pending search first
                setSearchValue('');
                // Clear the search immediately when X is clicked
                setSelectedKeys([]);
                // Trigger search with empty value without closing dropdown
                confirm?.({ closeDropdown: false });
              }}
            />
          }
        />
      </DzBox>
    </Flex>
  );
};
