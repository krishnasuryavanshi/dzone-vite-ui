import { DZONE_CLR_GRAY_2 } from '@/lib/constants';
import { MenuProps } from '@/lib/types/uicomponents';
import { Button, Dropdown } from '@/uicomponents';
import { FilterIcon } from '@/uicomponents/icons/svgs';
import React, { FC, useEffect, useState } from 'react';

interface IFilterDropdownAssignedUserProps {
  items: MenuProps['items'];
  assignedToFilterSelectedValue: string;
}

export const FilterDropdownAssignedUser: FC<
  IFilterDropdownAssignedUserProps
> = ({ items, assignedToFilterSelectedValue }) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (assignedToFilterSelectedValue === 'all') {
      setSelectedKeys([assignedToFilterSelectedValue]);
    } else {
      setSelectedKeys(['me']);
    }
  }, [assignedToFilterSelectedValue]);

  return (
    <Dropdown
      menu={{ items, selectable: true, selectedKeys }}
      trigger={['click']}
      overlayStyle={{
        border: `1px solid ${DZONE_CLR_GRAY_2}`,
        borderRadius: '10px',
      }}>
      <Button
        icon={<FilterIcon />}
        className='dz-btn-action-1'
        onClick={(e) => e.preventDefault()}
        style={{
          minHeight: '2.25rem',
          minWidth: '2.25rem',
          height: '2.25rem',
          width: '2.25rem',
        }}
      />
    </Dropdown>
  );
};
