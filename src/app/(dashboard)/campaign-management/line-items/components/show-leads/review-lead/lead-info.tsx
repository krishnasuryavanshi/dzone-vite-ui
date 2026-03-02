import { ILead } from '@/app/(dashboard)/campaign-management/leads/lib/types';
import { DzScrollContainer } from '@/components/layout/v1';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';
import { LeadInfoBody } from './lead-info-body';
import { LeadError } from './lead-review-container';
import { DzRecord } from '@/lib/types';

interface ILeadInfoProps {
  leadDetails: ILead | null;
  updateInitialFormValue: (formValue: Record<string, any>) => void;
  handleFormValueChange: (formValue: Record<string, any>) => void;
  leadErrorMessages: LeadError[];
  leadValidationStatus: string;
  handleRevalidateDisability: (status: boolean) => void;
  leadReviewFormConfig: DzRecord[];
}

export const LeadInfo: FC<ILeadInfoProps> = ({
  leadDetails,
  updateInitialFormValue,
  handleFormValueChange,
  leadErrorMessages,
  leadValidationStatus,
  handleRevalidateDisability,
  leadReviewFormConfig,
}) => {
  return (
    <Flex vertical gap={'0.5rem'} style={{ flex: 1, height: '100%' }}>
      <DzScrollContainer vertical scoll='outside'>
        <DzScrollContainer.Scroll>
          <LeadInfoBody
            leadDetails={leadDetails}
            updateInitialFormValue={updateInitialFormValue}
            handleFormValueChange={handleFormValueChange}
            leadErrorMessages={leadErrorMessages}
            leadValidationStatus={leadValidationStatus}
            handleRevalidateDisability={handleRevalidateDisability}
            leadReviewFormConfig={leadReviewFormConfig}
          />
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
    </Flex>
  );
};
