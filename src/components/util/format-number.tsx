import React from 'react';

interface CommaSeparatedNumberProps {
  value: number;
}

export const FormatNumber: React.FC<CommaSeparatedNumberProps> = ({
  value,
}) => {
  const formattedValue = new Intl.NumberFormat('en-US').format(value);
  return <span>{formattedValue}</span>;
};
