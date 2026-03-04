import React, { FC, useEffect, useState } from 'react';

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
  wrapper: Wrapper = 'span',
  style,
  onClick,
}) => {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    fetch(src)
      .then((res) => (res.ok ? res.text() : ''))
      .then((text) => setSvgContent(text))
      .catch(() => setSvgContent(''));
  }, [src]);

  return (
    <Wrapper
      className={customIconClassName}
      style={style}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};
