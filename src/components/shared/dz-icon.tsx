'use client';
import React, { FC } from 'react';
import { ReactSVG } from 'react-svg';

export interface IDzIconProps {
  src: string;
  customIconClassName?: string;
  wrapper?: 'div' | 'span' | 'svg';
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const DzIcon: FC<IDzIconProps> = ({
  src,
  customIconClassName,
  wrapper = 'span',
  style,
  onClick,
  ...rest
}) => {
  return (
    <ReactSVG
      src={src}
      className={customIconClassName}
      wrapper={wrapper}
      style={style}
      onClick={onClick}
      {...rest}
    />
  );
};
