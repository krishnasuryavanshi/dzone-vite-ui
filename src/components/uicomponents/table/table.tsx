import { TableProps } from "antd/lib/table";
import { Table as AntdTable } from "antd";
import React from "react";

export const Table = (props: TableProps) => {
  return <AntdTable {...props}></AntdTable>;
};
