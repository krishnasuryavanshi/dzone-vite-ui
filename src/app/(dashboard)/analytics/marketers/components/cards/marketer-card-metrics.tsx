import React, { FC } from 'react';
import { Text } from '@/uicomponents/text';

interface IRecord {
  name: string;
  value: string;
}

interface MarketerCardMetricsProps {
  data: IRecord;
  record?: IRecord;
  isPrevious?: boolean;
  isCurrency?: boolean | null;
}

export const MarketerCardMetrics: FC<MarketerCardMetricsProps> = ({
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
        }}
      >
        {/* {data?.value || record?.value} */}
        {data?.name === 'Current'
          ? `${data?.value ? (isCurrency ? '$' : '') + data.value : '-'}`
          : record?.value}
      </Text>
    </>
  );
};
