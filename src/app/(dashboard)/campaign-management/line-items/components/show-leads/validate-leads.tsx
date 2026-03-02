'use client';
import { FC, useState } from 'react';
import { Button } from '@/uicomponents/button';
import { validateLeads } from '@/app/(dashboard)/campaign-management/leads/services/validate-leads';
import { LoadingOutlined } from '@/uicomponents/icons';
import { showNotification } from '@/services/notification';
import { Translate } from '@/components/i18n';
import { NO_LEADS_FOR_VALIDATION_ERROR_MESSAGE } from '../../../lib/constants';
import { IValidateLeads } from '../../../leads/lib/types';

interface IValidateLeadsProps {
  lineItemId: string;
  totalFilteredLeads: number;
  leadStatus: string[];
  validationStatus: string[];
}

export const ValidateLeads: FC<IValidateLeadsProps> = ({
  lineItemId,
  leadStatus,
  validationStatus,
  totalFilteredLeads,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLeadsValidation = async () => {
    if (totalFilteredLeads > 0) {
      setIsLoading(true);
      try {
        const requestPayload: IValidateLeads = {
          lineItemId,
          totalLeads: totalFilteredLeads,
          leadStatus,
          validationStatus,
          leadInfo: [], // Empty for now, to be populated when selecting leads
          isSanitationSystem: true, // This helps BE check if leads are sanitized
        };
        const data = await validateLeads(requestPayload);
        if (data.data) {
          showNotification({ message: data.message });
        }
      } catch (e) {
        // Handle error if needed (e.g., show an error message)
      } finally {
        setIsLoading(false);
      }
    } else {
      showNotification({
        message: NO_LEADS_FOR_VALIDATION_ERROR_MESSAGE,
        type: 'error',
      });
    }
  };

  return (
    <Button
      type='primary'
      size='small'
      style={{ width: '5.6rem', boxShadow: 'none' }}
      disabled={isLoading}
      onClick={handleLeadsValidation}>
      {isLoading ? (
        <LoadingOutlined style={{ marginLeft: '0.5rem' }} />
      ) : (
        <Translate i18nKey='pages.leads.validate' />
      )}
    </Button>
  );
};
