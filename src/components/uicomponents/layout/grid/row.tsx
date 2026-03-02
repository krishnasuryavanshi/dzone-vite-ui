import { RowProps } from "antd/lib/grid/row";
import { Row as AntdRow } from "antd";
import React, { FC } from "react";

export const Row: FC<RowProps> = ({ children, ...rest }) => {
  return <AntdRow {...rest}>{children}</AntdRow>;
};
