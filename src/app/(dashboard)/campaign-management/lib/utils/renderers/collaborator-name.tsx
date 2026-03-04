import { DzBox } from '@/components/layout/v1';
import { AssignedToCell, CollaboratorName } from '../../../components';
import { ICollaborator } from '../../types';
import './collaborator-name.scss';
import { ICampaign } from '../../../campaigns/lib/types';
import { ILineItem } from '../../../line-items/lib/types';

export const collaboratorNameRenderer = (value: ICollaborator) => {
  return (
    <DzBox className='collaborator-name-render'>
      <CollaboratorName collaborator={value} />
    </DzBox>
  );
};

export const assignedToNamesRenderer = (value: ICollaborator[], record: ICampaign | ILineItem) => {
  return <AssignedToCell value={value} record={record} />;
};
