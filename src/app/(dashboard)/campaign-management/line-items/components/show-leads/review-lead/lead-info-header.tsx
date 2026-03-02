import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { LeadName } from './lead-name';
import { AIValidationContainer } from './ai-validation-container';

interface ILeadInfoHeaderProps {
  name: string;
  email: string;
  linkedinLink: string;
}

export const LeadInfoHeader: FC<ILeadInfoHeaderProps> = ({
  name,
  email,
  linkedinLink,
}) => {
  return (
    <Flex gap={'1rem'} justify='space-between'>
      <LeadName name={name} email={email} linkedinLink={linkedinLink} />
      {/* <AIValidationContainer /> */}
    </Flex>
  );
};
