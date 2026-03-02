import { Translate } from '@/components/i18n';
import { Button } from '@/uicomponents';
import { DownOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React from 'react';

export const LeadsFilters = () => {
  return (
    <Flex>
      <Button type='default' className='dz-btn-action-1'>
        <Translate i18nKey='pages.leads.allLeads' />
        <DownOutlined style={{ marginLeft: '0.5rem' }} />
      </Button>
    </Flex>
  );
};
