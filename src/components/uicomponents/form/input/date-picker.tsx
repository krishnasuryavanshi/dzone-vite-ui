import { DatePickerProps } from 'antd/lib/date-picker';
import { DatePicker as AntdDatePicker } from 'antd';
import React, { FC } from 'react';

interface IDatePickerProps extends DatePickerProps {}

export const DatePicker: FC<IDatePickerProps> = ({ children, ...rest }) => {
  return <AntdDatePicker {...rest}>{children}</AntdDatePicker>;
};

export const { RangePicker } = AntdDatePicker;
