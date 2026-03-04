import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { logError } from '@/services/logger';
import { FC, useEffect, useState } from 'react';
import { ICampaign } from '../campaigns/lib/types';
import { updateCampaignCollaborators } from '../campaigns/services';
import { ICollaborator } from '../lib/types';
import { ILineItem } from '../line-items/lib/types';
import { updateLineItemCollaborators } from '../line-items/services';
import { AssignedToEditCell } from './assigned-to-edit-cell';
import { AssignedToViewCell } from './assigned-to-view-cell';

interface IAssignedToCellProps {
  value: ICollaborator[];
  record: ICampaign | ILineItem;
}

const CampaignLastStep = 4;

export const AssignedToCell: FC<IAssignedToCellProps> = ({ value, record }) => {
  const [assignedTo, setAssignedTo] = useState<ICollaborator[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (value?.length > 0) {
      setAssignedTo(value);
    } else {
      setAssignedTo([]);
    }
  }, [value]);

  useEffect(() => {
    if (record?.id) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    setIsEditing(false);
  }, [record?.id]);

  const getTenantCode = () => {
    // Current user is Supplier type (Line Item)- tenantCode = Supplier Code
    // Campaign - tenantCode = Marketer Code
    // Current user is Marketer type (Line Item) - tenantCode = Marketer Code
    return (record as ICampaign).tenantCode as string;
  };

  const handleEditModeChange = (isEditing: boolean) => {
    setIsEditing(isEditing);
  };

  const updateAssignedTo = async (collaboratorsIds: string[]) => {
    try {
      const requestData = {
        assignedTo: collaboratorsIds,
      };
      let result;
      if ((record as ILineItem).lineItemId) {
        result = await updateLineItemCollaborators(requestData, record.id);
      } else {
        result = await updateCampaignCollaborators(requestData, record.id);
      }
      setAssignedTo(result?.data?.collaborators?.assignedTo);
      return true; // close loader on returning true and change mode
    } catch (error) {
      logError(error);
    }
    return false;
  };

  return (
    <Hideable show={isVisible}>
      <DzBox className='collaboratorNameRender' onClick={(e) => e.stopPropagation()}>
        <Hideable show={!isEditing}>
          <AssignedToViewCell
            value={assignedTo}
            enableEditMode={() => handleEditModeChange(true)}
          />
        </Hideable>
        <Hideable show={isEditing}>
          <AssignedToEditCell
            value={assignedTo}
            enableViewMode={() => handleEditModeChange(false)}
            onUpdate={updateAssignedTo}
            isLineItem={!!(record as ILineItem).lineItemId}
            tenantCode={getTenantCode()}
          />
        </Hideable>
      </DzBox>
    </Hideable>
  );
};
