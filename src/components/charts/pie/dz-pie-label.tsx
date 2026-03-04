import { FC } from 'react';

interface IPieLabelProps {
  data: any;
  prependDollarInLabel?: boolean;
}

const RADIAN = Math.PI / 180;

export const DzPieLabel: FC<IPieLabelProps> = ({ data, prependDollarInLabel = false }) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, name, value } = data;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const style = {
    fontSize: '0.75rem',
    fontWeight: '500',
  };

  return (
    <text x={x} y={y} fill='white' textAnchor='middle' dominantBaseline='central' style={style}>
      {prependDollarInLabel ? `$${value}` : value}
    </text>
  );
};
