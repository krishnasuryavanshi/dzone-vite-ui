import React, { FC } from 'react';
import { Image as AntdImage, ImageProps } from 'antd';

export const Image: FC<ImageProps> = (props) => {
  return <AntdImage {...props} />;
};
