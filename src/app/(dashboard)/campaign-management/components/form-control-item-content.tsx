import { FormControlItem } from '@/components/form';
import { OptionsKeys } from '@/lib/enums';
import { Col } from '@/uicomponents/layout/grid';
import { FC } from 'react';
import { prepareField } from '../campaigns/lib/utils';
import { useFieldPermissions } from '../campaigns/lib/hooks';

interface IFormControlItemContentProps {
  transKey: string;
  lists: Record<OptionsKeys, any[]>;
  item: any;
  colLayout?: Record<string, any>;
  entityId?: string;
}

export const FormControlItemContent: FC<IFormControlItemContentProps> = ({
  item,
  transKey,
  lists,
  colLayout,
  entityId,
}) => {
  const { createPermissionKey, editPermissionKey, viewPermissionKey } = useFieldPermissions(
    item.permissions,
  );

  const field = prepareField(
    item,
    lists ?? {},
    transKey,
    createPermissionKey,
    editPermissionKey,
    viewPermissionKey,
    entityId,
  );

  if (!field) {
    return null;
  }

  const colSpan = field.item?.columnSpan || colLayout;

  return (
    <Col {...colSpan} style={{ display: field.item.hidden ? 'none' : 'block' }}>
      <FormControlItem
        field={field}
        styleForCheckBox={item?.className}
        isDisabled={field?.input?.disabled}
      />
    </Col>
  );
};
