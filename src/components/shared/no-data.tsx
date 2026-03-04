import React, { FC } from 'react';
import { Result, Button } from '@/uicomponents';
import './no-data.scss';

export interface INoDataProps {
  title?: string;
  subTitle?: string;
  handleRefresh?: () => void;
}
export const NoData: FC<INoDataProps> = ({
  title = 'No Data Available',
  subTitle = 'There is currently no data available.',
  handleRefresh,
}) => {
  return (
    <Result
      status='info'
      className='result-status'
      title={title}
      subTitle={subTitle}
      extra={
        handleRefresh ? (
          <Button type='primary' onClick={handleRefresh} data-testid='refresh-button'>
            Refresh
          </Button>
        ) : null
      }
    />
  );
};
