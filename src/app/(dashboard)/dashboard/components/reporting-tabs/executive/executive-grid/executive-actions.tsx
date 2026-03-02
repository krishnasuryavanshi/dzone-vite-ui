import { FC, SyntheticEvent } from 'react';
import { MenuProps } from 'antd';
import { Dropdown } from '@/uicomponents/dropdown';
import { Button } from '@/uicomponents/button';
import { IExcecutiveGrids } from '../types';
import { ThreeDotsActionsIcon } from '@/uicomponents/icons/svgs';
import Link from 'next/link';

export const ExecutiveGridActions: FC<{ executive: IExcecutiveGrids }> = ({
  executive,
}) => {
  const getDropdownMenus = (executive: IExcecutiveGrids) => {
    const stopPropagation = (e: SyntheticEvent) => e.stopPropagation();
    const baseLink = `/campaign-management/campaigns/${executive.campaignUUID}`;
    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <Link href={baseLink} onClick={stopPropagation}>
            View Campaign
          </Link>
        ),
      },
    ];
    return items;
  };

  return (
    <Dropdown
      menu={{ items: getDropdownMenus(executive) }}
      placement='bottomLeft'>
      <Button
        onClick={(e) => e.stopPropagation()}
        icon={<ThreeDotsActionsIcon />}
        type='text'
        className='icon-only-button'
      />
    </Dropdown>
  );
};
