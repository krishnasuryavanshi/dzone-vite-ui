import { Translate } from '@/components/i18n';
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { MenuProps } from '@/lib/types/uicomponents';
import { Button, Dropdown, Text } from '@/uicomponents';
import { DownOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { theme } from 'antd';
import React, { FC, PropsWithChildren, ReactNode, useState } from 'react';
import { DzSerachDropdown } from './dz-serach-dropdown';

export interface IDzDropdownProps extends PropsWithChildren {
  className?: string;
  items: MenuProps['items'];
  selectedItems?: string[];
  label?: string;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  handleSearch?: (value: string) => void;
  onSelect?: (data: any) => void;
}

const { useToken } = theme;
const ItemsToShow = 5;

export const DzDropdown: FC<IDzDropdownProps> = ({
  className,
  items,
  selectedItems,
  label,
  onSelect,
  multiple = true,
  searchable = true,
  searchPlaceholder = 'Search',
  handleSearch,
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  };
  const menuStyle: React.CSSProperties = {
    boxShadow: 'none',
  };

  const renderDropdown = (menus: ReactNode, itemsCount: number) => {
    let height =
      (itemsCount > ItemsToShow && 20) ||
      (itemsCount <= ItemsToShow && itemsCount * 2.5 + 4.25) ||
      3.5;
    if (!searchable) {
      height = height - 3;
    }
    return (
      <DzBox
        className='dz-dropdown-menu-wrapper'
        style={{
          ...contentStyle,
          height: `${height + 'rem'}`,
        }}>
        <DzScrollContainer vertical scoll='inside'>
          <DzScrollContainer.Sticky>
            <DzSerachDropdown
              placeholder={searchPlaceholder}
              show={searchable}
              handleSearch={(val) => {
                setSearchTerm(val);
                handleSearch && handleSearch(val);
              }}
              value={searchTerm}
            />
          </DzScrollContainer.Sticky>
          <DzScrollContainer.Scroll>
            {React.cloneElement(menus as React.ReactElement, {
              style: menuStyle,
            })}
          </DzScrollContainer.Scroll>
        </DzScrollContainer>
      </DzBox>
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setSearchTerm('');
      handleSearch && handleSearch('');
    }
  };
  return (
    <Dropdown
      overlayClassName={className}
      menu={{
        items,
        selectable: true,
        selectedKeys: selectedItems,
        multiple,
        onSelect,
        onDeselect: onSelect,
      }}
      trigger={['click']}
      dropdownRender={(menus) => renderDropdown(menus, items?.length as number)}
      onOpenChange={handleOpenChange}
      arrow>
      <Flex vertical gap='0.125rem'>
        <Text style={{ color: '#4F4F4F' }}>
          <Translate i18nKey={label as string} />
        </Text>
        <Button type='default' className='dz-dropdown-trigger dz-btn-action-1'>
          {children}
          <DownOutlined style={{ marginLeft: '0.5rem' }} />
        </Button>
      </Flex>
    </Dropdown>
  );
};
