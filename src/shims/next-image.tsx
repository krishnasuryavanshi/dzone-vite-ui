/**
 * Shim for `next/image`.
 * Renders a plain <img> element.
 */
import React, { forwardRef } from 'react';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'placeholder'> {
  src: string | { src: string };
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  unoptimized?: boolean;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fill,
      priority,
      quality,
      placeholder,
      blurDataURL,
      unoptimized,
      ...rest
    },
    ref,
  ) => {
    const imgSrc = typeof src === 'object' ? src.src : src;
    const fillStyle = fill
      ? ({ objectFit: 'cover', width: '100%', height: '100%' } as const)
      : {};

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        style={{ ...fillStyle, ...(rest.style || {}) }}
        {...rest}
      />
    );
  },
);

Image.displayName = 'Image';

export default Image;
export { Image };
export type { ImageProps };
