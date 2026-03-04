import { DzBox } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import { FC } from 'react';

interface IDzLineTooltipProps {
  active?: boolean;
  payload: any;
}

export const DzLineTooltip: FC<IDzLineTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const fontSize = '0.75rem';

  const wrapperStyle = {
    backgroundColor: '#fff',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
  };

  const indicatorStyle = {
    height: '0.5rem',
    width: '0.375rem',
    borderRadius: '1px',
  };

  const labelStyle = {
    fontSize,
    fontWeight: 400,
  };

  const countStyle = {
    fontSize,
    fontWeight: 500,
    marginLeft: '0.125rem',
  };

  return (
    <DzBox style={wrapperStyle} className='dz-line-tooltip'>
      <Flex gap={'0.5rem'} align='flex-start' vertical>
        {payload && payload.length
          ? payload.map(({ color, name, value }: any) => (
              <Flex gap='0.5rem' align='center' key={`${name}-${value}`}>
                <div style={{ ...indicatorStyle, backgroundColor: color }} />
                <Text style={labelStyle} className='dz-line-tooltip-label'>
                  {name}:<Text style={countStyle}>{value}</Text>
                </Text>
              </Flex>
            ))
          : null}
      </Flex>
    </DzBox>
  );
};
