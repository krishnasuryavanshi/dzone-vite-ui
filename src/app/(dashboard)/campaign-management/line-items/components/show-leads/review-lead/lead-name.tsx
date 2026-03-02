import React, { FC } from 'react';
import { LeadMetaRow } from './lead-meta-row';
import { Text } from '@/uicomponents/text';
import { DzBox } from '@/components/layout/v1';
import { Link } from '@/uicomponents/link';

interface ILeadNameProps {
  name: string;
  email: string;
  linkedinLink: string;
}

export const LeadName: FC<ILeadNameProps> = ({ name, email, linkedinLink }) => {
  return (
    <DzBox style={{ flex: 1 }}>
      <LeadMetaRow className='lead-name' label={name}>
        <Text
          style={{ fontSize: '0.875rem', width: '15rem' }}
          underline
          ellipsis>
          {email}
        </Text>
        <Link
          style={{ fontSize: '0.875rem', width: '15rem' }}
          href={linkedinLink}
          target='_blank'
          ellipsis>
          {linkedinLink}
        </Link>
      </LeadMetaRow>
    </DzBox>
  );
};
