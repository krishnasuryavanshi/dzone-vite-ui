import { SwitchProps } from 'antd/lib/switch';
import { Switch as AntdSwitch } from 'antd';
import React, { FC } from 'react';

export const Switch: FC<SwitchProps> = (props: SwitchProps) => {
  return <AntdSwitch {...props} />;
};
