import React, { FC } from 'react'
import { AutoComplete as AntdAutocomplete } from 'antd'
import { AutoCompleteProps } from 'antd/lib'

export const AutoComplete: FC<AutoCompleteProps> = ({ children, ...rest }) => {
  return (
    <AntdAutocomplete {...rest}>{children}</AntdAutocomplete>
  )
}