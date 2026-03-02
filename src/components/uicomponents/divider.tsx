import React, { FC } from 'react';
import { DividerProps } from 'antd/lib/divider';
import { Divider as AntdDivider } from 'antd';

interface IDividerProps extends DividerProps {
  style?: React.CSSProperties;
}

export const Divider: FC<IDividerProps> = ({ style }) => {
  return <AntdDivider style={style} />;
};
