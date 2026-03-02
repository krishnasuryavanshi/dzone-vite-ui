import { FC } from 'react';
import { ICollaborator } from '../lib/types';
import { isArray } from 'lodash';
import { DrawerListView } from '@/components/shared/text';

interface ICollaboratorNameProps {
  collaborator: ICollaborator | ICollaborator[];
  label?: string;
}

export const CollaboratorName: FC<ICollaboratorNameProps> = ({
  collaborator,
  label,
}) => {
  if (!isArray(collaborator)) {
    return (
      <>{`${collaborator?.firstName || ''} ${collaborator?.lastName || ''}`}</>
    );
  } else {
    const collaboratorNames = collaborator.map((collaborator) => {
      return `${collaborator?.firstName || ''} ${collaborator?.lastName || ''}`;
    });
    return (
      <DrawerListView
        value={collaboratorNames}
        label={label as string}
        lines={1}
      />
    );
  }
};
