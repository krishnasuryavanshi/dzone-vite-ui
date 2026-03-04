import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { useIsFetching } from '@tanstack/react-query';

interface IFilterActionsProps {
  reset?: () => void;
  submit?: () => void;
  activeTab: string;
}

export const FilterActions: FC<IFilterActionsProps> = ({ reset, submit, activeTab }) => {
  const fetchingCount = useIsFetching({ queryKey: ['dashboard'] });
  const loading = fetchingCount > 0;

  return (
    <Flex gap='0.75rem' justify='flex-start'>
      <Button disabled={loading} className='dz-btn-action' onClick={submit}>
        <Translate i18nKey='form.actions.submit' />
      </Button>
      <Button disabled={loading} className='dz-btn-action' onClick={reset}>
        <Translate i18nKey='form.actions.reset' />
      </Button>
    </Flex>
  );
};
