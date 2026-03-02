import { ILead } from '@/app/(dashboard)/campaign-management/leads/lib/types';
import { LoadingOutlined } from '@/uicomponents/icons';
import { FC, useEffect, useState } from 'react';
import { LeadValidationForm } from './lead-validation-form';
import { LeadValidationFormField } from '../../../lib/enums/lead-validation-form-field.enum';
import { pick } from 'lodash';
import { LeadError } from './lead-review-container';
import { DzRecord } from '@/lib/types/dz-record';

interface ILeadInfoBodyProps {
  leadDetails: ILead | null;
  updateInitialFormValue: (formValue: Record<string, any>) => void;
  handleFormValueChange: (formValue: Record<string, any>) => void;
  leadErrorMessages: LeadError[];
  leadValidationStatus: string;
  handleRevalidateDisability: (status: boolean) => void;
  leadReviewFormConfig: DzRecord[];
}

export const LeadInfoBody: FC<ILeadInfoBodyProps> = ({
  leadDetails,
  updateInitialFormValue,
  handleFormValueChange,
  leadErrorMessages,
  leadValidationStatus,
  handleRevalidateDisability,
  leadReviewFormConfig,
}) => {
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (leadDetails && leadReviewFormConfig.length > 0) {
      const fieldList = leadReviewFormConfig.map((field) => field.name);
      const mergedLeadDetails = {
        ...leadDetails,
        ...(leadDetails || {}), // Merge properties from nested lead object if it exists
      };
      const formValue = pick(mergedLeadDetails, fieldList);
      setInitialValues(formValue);
      updateInitialFormValue(formValue);
    }
  }, [leadDetails, leadReviewFormConfig]);

  if (!leadDetails || !leadReviewFormConfig?.length) {
    return <LoadingOutlined />;
  }

  return (
    <LeadValidationForm
      initialValues={initialValues}
      handleFormValueChange={handleFormValueChange}
      leadErrorMessages={leadErrorMessages}
      leadValidationStatus={leadValidationStatus}
      handleRevalidateDisability={handleRevalidateDisability}
      leadReviewFormConfig={leadReviewFormConfig}
    />
  );
};
