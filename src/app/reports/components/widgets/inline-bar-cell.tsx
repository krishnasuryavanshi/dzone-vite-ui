import React from 'react';

interface InlineBarCellProps {
  value: number;
  max: number;
  color?: string;
}

export const InlineBarCell: React.FC<InlineBarCellProps> = ({
  value,
  max,
  color = '#6687f8',
}) => {
  const pct = max > 0 ? (value / max) * 100 : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ minWidth: 60, textAlign: 'right' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
      <div
        style={{
          flex: 1,
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 4,
            backgroundColor: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};
