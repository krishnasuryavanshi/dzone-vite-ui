import React, { FC } from 'react';
import { Text } from '@/uicomponents/text';

interface IRecord {
  name: string;
  value: string;
}

interface SupplierCardMetricsProps {
  data: IRecord;
  record?: IRecord;
  isPrevious?: boolean;
  isCurrency?: boolean | null;
}

export const SupplierCardMetrics: FC<SupplierCardMetricsProps> = ({
  data,
  record,
  isPrevious,
  isCurrency = false,
}) => {
  const valueFontSize = isPrevious ? '0.875rem' : '1.75rem';

  return (
    <>
      <Text
        style={{
          fontSize: valueFontSize,
          fontWeight: 700,
          color: '#000',
          lineHeight: '100%',
        }}>
        {data?.name === 'Current'
          ? `${data?.value ? (isCurrency ? '$' : '') + data.value : '0'}`
          : record?.value}
      </Text>
    </>
  );
};
