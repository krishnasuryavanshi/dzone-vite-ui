import { SpinProps } from 'antd/lib/spin';
import React, { FC } from 'react';
import { Spin as AntdSpin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface ISpinProps extends SpinProps {}

export const Spin: FC<ISpinProps> = ({ indicator, ...props }) => {
  const loadingIndicator = indicator || (
    <LoadingOutlined
      style={{ fontSize: 48 }}
      spin
    />
  );

  return (
    <AntdSpin
      indicator={loadingIndicator}
      {...props}
    />
  );
};
