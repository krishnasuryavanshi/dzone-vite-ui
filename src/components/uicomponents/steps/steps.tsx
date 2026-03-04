import { StepsProps } from 'antd';
import React, { FC } from 'react';
import { Steps as AntdSteps } from 'antd';
interface IStepsProps extends StepsProps {}
export const Steps: FC<IStepsProps> = (props) => {
  return <AntdSteps className='dz-one-steps' {...props} />;
};
