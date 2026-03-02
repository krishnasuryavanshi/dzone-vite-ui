import { ColProps } from "antd/lib/grid/col";
import { Col as AntdCol } from "antd";
import React, { FC } from "react";

export const Col: FC<ColProps> = ({ children, ...rest }) => {
  return <AntdCol {...rest}>{children}</AntdCol>;
};
