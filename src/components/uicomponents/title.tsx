import React, { FC, PropsWithChildren } from 'react';
import { Typography } from 'antd';
import { TitleProps } from 'antd/lib/typography/Title';

interface ITitleProps extends TitleProps, PropsWithChildren {}

export const Title: FC<ITitleProps> = ({ children, ...rest }) => {
  return <Typography.Title {...rest}>{children}</Typography.Title>;
};
