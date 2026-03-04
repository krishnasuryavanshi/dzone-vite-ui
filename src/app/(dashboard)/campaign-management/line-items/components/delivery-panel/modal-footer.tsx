import { Translate } from '@/components/i18n';
import { CLR_BLUE_LIGHT } from '@/lib/constants';
import { Button } from '@/uicomponents/button';
import { LoadingOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { Spin } from '@/uicomponents/spin';
import { FC } from 'react';

interface IModalFooterProps {
  isLoading: boolean;
  onCancel: () => void;
  handleProceed: () => void;
  filterLeadsCount: number;
}

export const ModalFooter: FC<IModalFooterProps> = ({
  isLoading,
  onCancel,
  handleProceed,
  filterLeadsCount,
}) => {
  return (
    <Flex gap='0.5rem' align='center' justify='flex-end'>
      <Button
        size='small'
        style={{ borderColor: isLoading ? '#d4d4d4' : `${CLR_BLUE_LIGHT}` }}
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        type='primary'
        style={{ width: '5rem' }}
        size='small'
        onClick={handleProceed}
        disabled={filterLeadsCount === 0}
      >
        {isLoading ? (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: '1.5rem', color: '#fff' }} spin />}
          />
        ) : (
          <Translate i18nKey='Proceed' />
        )}
      </Button>
    </Flex>
  );
};
