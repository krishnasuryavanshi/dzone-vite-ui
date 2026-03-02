import React, { FC } from 'react';
import { AutoComplete } from 'antd';
import { AutoCompleteProps } from 'antd/lib';

interface IAutocompleteProps extends AutoCompleteProps {}

export const Autocomplete: FC<IAutocompleteProps> = ({ children, ...rest }) => {
  return <AutoComplete {...rest}>{children}</AutoComplete>;
};
