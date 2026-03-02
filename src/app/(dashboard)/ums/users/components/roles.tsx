import Link from 'next/link';
import { FC } from 'react';
import { IUser } from '../lib/types';
import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents/text';

interface IRolesProps {
  record: IUser;
}

export const Roles: FC<IRolesProps> = ({ record }) => {
  if (!record?.roles?.length) {
    return null;
  }
  return (
    <DzBox style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
      {record?.roles?.length
        ? record.roles.map((role, index) => (
            <Text key={role.id}>
              <Link
                key={role.id}
                href={`/ums/roles/${role.id}`}
                onClick={(e) => e.stopPropagation()}>
                {role.name}
              </Link>
              {index < record.roles.length - 1 ? ', ' : ''}
            </Text>
          ))
        : null}
    </DzBox>
  );
};
