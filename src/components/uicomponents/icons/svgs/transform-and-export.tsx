import { DzIcon } from '@/components/shared';
import { FC } from 'react';
import './transform-and-export.scss';

interface ITransformAndExportProps {
  style?: React.CSSProperties;
  disabled?: boolean;
}

export const TransformAndExport: FC<ITransformAndExportProps> = ({ style, disabled }) => {
  const src = '/icons/transform-and-export.svg';
  return (
    <DzIcon
      src={src}
      style={style}
      customIconClassName={`custom-icon ${disabled ? 'disabled-btn' : ''}`}
    />
  );
};
