import { DzDropdown } from '@/components/shared/custom';
import React, { FC, useEffect, useState } from 'react';
import { IFilterLineItem } from '../../lib/types';
import { getSelectedItems } from '../../lib/utils';
import { debounce } from 'lodash';

interface ILineItemsDropdownProps {
  availableLineItems: IFilterLineItem[];
  selectedLineItems?: string[];
  handleSelectionChange: (data: { type: string; selectedItems: string[] }) => void;
}

export const LineItemsDropdown: FC<ILineItemsDropdownProps> = ({
  availableLineItems,
  selectedLineItems,
  handleSelectionChange,
}) => {
  const [lineItems, setLineItems] = useState<IFilterLineItem[]>();

  useEffect(() => {
    setLineItems(availableLineItems);
    if (!selectedLineItems?.includes('all')) {
      const lineItems = availableLineItems.map((lineItem) => lineItem.key);
      const selectedItems = selectedLineItems?.filter((id) => lineItems.includes(id));
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedLineItems',
          selectedItems: selectedItems as string[],
        });
    }
  }, [availableLineItems]);

  const handleLineItemsSelection = (data: any) => {
    const selectedItems = getSelectedItems(selectedLineItems as string[], data.selectedKeys);
    handleSelectionChange && handleSelectionChange({ type: 'selectedLineItems', selectedItems });
  };

  const handleSeach = (value: string) => {
    setLineItems(
      availableLineItems?.filter((lineItem) => {
        return (
          lineItem.key === 'all' || lineItem?.name?.toLowerCase().includes(value.toLowerCase())
        );
      }),
    );
  };

  const debouncedSearch = debounce(handleSeach, 500);

  return (
    <DzDropdown
      className='dz-dropdown filter-dropdown filter-dropdown-line-items'
      items={lineItems}
      label='pages.lineItems.title'
      selectedItems={selectedLineItems}
      onSelect={handleLineItemsSelection}
      handleSearch={debouncedSearch}
    >
      {(selectedLineItems?.includes('all') && 'All Line Items') ||
        (selectedLineItems?.length === 0 && 'No Line Item') ||
        (selectedLineItems?.length === 1 && '1 Line Item') ||
        (selectedLineItems?.length && `${selectedLineItems.length} Line Items`)}
    </DzDropdown>
  );
};
