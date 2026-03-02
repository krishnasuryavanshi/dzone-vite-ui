import { DropdownActions } from '@/components/util';
import { DownOutlined } from '@/uicomponents/icons';
import { Button, Dropdown } from '@/uicomponents/index';
import React, { FC, useState } from 'react';

interface IDzCheckboxDropdownProps {
  label: React.ReactNode;
  renderButton?: ({
    onClick,
    isLoading,
  }: {
    onClick: (e: any) => void;
    isLoading?: boolean;
  }) => React.ReactNode;
  options: { text: string; value: string }[];
  selected: string[];
  onApply: (data: string[]) => void;
  onReset: (data: string[]) => void;
  instantFilter?: boolean;
}

export const DzCheckboxDropdown: FC<IDzCheckboxDropdownProps> = ({
  label,
  options,
  selected,
  onApply,
  onReset,
  renderButton,
  instantFilter = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenChange = (isOpened: boolean) => {
    setIsOpen(isOpened);
  };

  const closeOpenedDropdown = () => {
    setIsOpen(false);
  };

  return (
    <Dropdown
      open={isOpen}
      trigger={['click']}
      dropdownRender={(originNode) => (
        <DropdownActions
          label={label}
          options={options}
          selected={selected}
          onApply={onApply}
          onReset={onReset}
          closeOpenedDropdown={closeOpenedDropdown}
          instantFilter={instantFilter}
        />
      )}
      onOpenChange={handleOpenChange}>
      {renderButton ? (
        renderButton({
          onClick: (e: any) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          },
        })
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}>
          {label}
          <DownOutlined />
        </Button>
      )}
    </Dropdown>
  );
};
