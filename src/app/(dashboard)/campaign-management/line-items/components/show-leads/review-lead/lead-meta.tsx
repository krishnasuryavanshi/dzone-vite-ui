import { HasPermission } from '@/components/auth';
import { LeadActionsEnum } from '@/lib/enums/permissions';
import { Button, Text, Alert } from '@/uicomponents';
import { Flex } from '@/uicomponents/layout';
import { FC, PropsWithChildren } from 'react';
import { LeadMetaRow } from './lead-meta-row';
import { ValidationStatus } from './validation-status';
import { Hideable } from '@/components/shared';
import { WarningOutlined } from '@ant-design/icons';
import { LeadValidationStatus } from '@/app/(dashboard)/campaign-management/leads/lib/enums';

interface ILeadMetaProps extends PropsWithChildren {
  validationStatus: string;
  trackingId: string;
  handleSaveAndRevalidate: () => void;
  revalidationAllowed?: boolean;
  disableRevalidate: boolean;
  leadStatus?: string;
}

export const LeadMeta: FC<ILeadMetaProps> = ({
  children,
  trackingId,
  validationStatus,
  handleSaveAndRevalidate,
  revalidationAllowed,
  disableRevalidate,
  leadStatus,
}) => {
  return (
    <Flex vertical gap={'0.5rem'}>
      {children}
      <LeadMetaRow label='Tracking ID' className='tracking-id'>
        <Text style={{ fontSize: '0.875rem', width: '15rem' }}>
          {trackingId}
        </Text>
      </LeadMetaRow>
      <LeadMetaRow label='Validation Status' className='validation-status'>
        <ValidationStatus validationStatus={validationStatus} />
      </LeadMetaRow>
      <HasPermission permissions={LeadActionsEnum.ValidateLead}>
        <Hideable show={leadStatus?.toLowerCase() === 'duplicate'}>
          <Alert
            message={
              <Text
                style={{
                  color: 'var(--dzone-color-error)',
                  fontSize: '0.875rem',
                }}>
                This record is identified as a duplicate and can not be edited
                or Published
              </Text>
            }
            type='warning'
            icon={
              <Flex style={{ alignSelf: 'baseline', marginTop: '0.5rem' }}>
                <WarningOutlined
                  style={{ color: 'var(--dzone-color-warning)' }}
                />
              </Flex>
            }
            showIcon
            style={{
              padding: '0.375rem 0.75rem',
              backgroundColor: '#fff7e6',
              border: '1px solid #ffd591',
              borderRadius: 'var(--dzone-radius-sm)',
              width: '13.5rem',
            }}
          />
        </Hideable>
        <Hideable
          show={
            !!revalidationAllowed &&
            validationStatus !== LeadValidationStatus.PendingEmailValidation
          }>
          <LeadMetaRow label='Actions' className='actions'>
            <Hideable show={leadStatus?.toLowerCase() !== 'duplicate'}>
              <Button
                type='primary'
                onClick={handleSaveAndRevalidate}
                disabled={disableRevalidate}
                style={{ width: 'fit-content' }}>
                Save & Revalidate
              </Button>
            </Hideable>
          </LeadMetaRow>
        </Hideable>
      </HasPermission>
    </Flex>
  );
};
