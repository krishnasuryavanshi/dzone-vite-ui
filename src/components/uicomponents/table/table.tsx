import { TableProps } from "antd/lib/table";
import { Table as AntdTable } from "antd";
import React from "react";

export const Table = <T extends Record<string, any> = any>(props: TableProps<T>) => {
  return <AntdTable<T> {...props}></AntdTable>;
};
