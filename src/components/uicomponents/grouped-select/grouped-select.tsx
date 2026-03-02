import React, { FC } from 'react';
import { Select as AntdSelect, SelectProps } from 'antd';

interface ISelectProps extends SelectProps {
  options: {
    label: string;
    value: string;
    options?: { label: string; value: string }[];
    className?: string;
    title?: string;
  }[];
}

export const GroupedSelect: FC<ISelectProps> = ({
  options,
  children,
  ...rest
}) => {
  return (
    <AntdSelect {...rest}>
      {options.map((group) => (
        <AntdSelect.OptGroup
          key={group.value}
          label={group.label}
          className={group.className}
          title={group.title}
        >
          {group?.options?.map((option) => (
            <AntdSelect.Option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </AntdSelect.Option>
          ))}
        </AntdSelect.OptGroup>
      ))}
    </AntdSelect>
  );
};
