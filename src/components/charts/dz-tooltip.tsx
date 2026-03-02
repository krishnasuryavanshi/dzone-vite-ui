import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';

interface IDzTooltipProps {
  active?: boolean;
  payload: any;
  chartType?: 'pie' | 'bar' | 'funnel';
  prependDollarInLabel?: boolean;
}

export const DzTooltip: FC<IDzTooltipProps> = ({
  active,
  payload,
  chartType = 'pie',
  prependDollarInLabel = false,
}) => {
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
    backgroundColor: `${chartType === 'bar' ? payload[0].fill : payload[0].payload.fill}`,
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

  let { name, value, payload: payLoad } = payload[0];

  if (chartType === 'bar') {
    name = payLoad?.name;
  }

  if (chartType === 'funnel') {
    name = payLoad?.status;
    value = payLoad?.value;
  }

  const percent = payLoad?.payload?.percent;

  return (
    <DzBox style={wrapperStyle}>
      <Flex
        gap={'0.5rem'}
        align="center">
        <div style={indicatorStyle} />
        <Text style={labelStyle}>
          {name}:
          <Text style={countStyle}>
            {prependDollarInLabel ? `$${value}` : value}
            {percent ? <Text style={countStyle}>({percent})</Text> : null}
          </Text>
        </Text>
      </Flex>
    </DzBox>
  );
};
