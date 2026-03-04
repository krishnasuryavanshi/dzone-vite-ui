import { DzBox } from '@/components/layout/v1';
import { SelectDrawer } from '@/components/shared';
import { Button } from '@/uicomponents/button';
import { Select } from '@/uicomponents/form/input';
import { CheckOutlined, CloseOutlined, LoadingOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React, { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { IUser } from '../../ums/users/lib/types';
import { useUsersWithModuleAccessQuery } from '../../ums/users/hooks';
import { ICollaborator } from '../lib/types';

interface IAssignedToEditCellProps {
  value: ICollaborator[];
  enableViewMode: () => void;
  onUpdate: (collaboratorsId: string[]) => Promise<boolean>;
  isLineItem?: boolean;
  tenantCode: string;
}

export const AssignedToEditCell: FC<IAssignedToEditCellProps> = ({
  value,
  enableViewMode,
  onUpdate,
  isLineItem,
  tenantCode,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);
  const [omittedValues, setOmittedValues] = useState<Record<string, any>[]>([]);

  const moduleName = isLineItem ? 'Line Item' : 'Campaign';
  const { data: usersData, isLoading } = useUsersWithModuleAccessQuery(moduleName, tenantCode);

  const options = useMemo(() => {
    if (!usersData?.data) return [];
    return usersData.data.map((user: IUser) => ({
      label: `${user.firstName} ${user.lastName}`,
      value: user.id,
    }));
  }, [usersData]);

  useEffect(() => {
    if (value?.length > 0) {
      setSelectedIds(value.map((item) => item.id));
    }
  }, [value]);

  const showDrawer = (e: SyntheticEvent, values: Record<string, any>[]) => {
    e.stopPropagation();
    setOmittedValues(values);
    setVisible(true);
  };

  const closeDrawer = (e: any) => {
    e.preventDefault();
    setVisible(false);
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    const isUpdated = await onUpdate(selectedIds);
    setIsUpdating(false);
    if (isUpdated) {
      enableViewMode();
    }
  };

  const filterOptions = (input: string, option: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  if (isLoading) {
    return (
      <Flex align='center' justify='center'>
        {' '}
        <LoadingOutlined />
      </Flex>
    );
  }

  return (
    <DzBox onClick={(e) => e.stopPropagation()} style={{ marginTop: '-0.25rem' }}>
      <Flex gap={'0.25rem'} align='center'>
        <DzBox style={{ flex: 1 }}>
          <Select
            placeholder='Select'
            value={selectedIds}
            onChange={(value) => setSelectedIds(value)}
            options={options}
            filterOption={filterOptions as any}
            maxTagCount={'responsive'}
            maxTagPlaceholder={(omittedValues: Record<string, any>[]) => (
              <span
                onMouseEnter={(e) => showDrawer(e, omittedValues)}
                style={{ display: 'inline-block', cursor: 'pointer' }}
              >
                {`+ ${omittedValues.length} more`}
              </span>
            )}
            size='small'
            style={{ width: '100%', height: '2rem' }}
            mode='multiple'
          />
        </DzBox>
        <Button onClick={handleUpdate} size='small' type='primary'>
          <CheckOutlined />
        </Button>
        <Button onClick={enableViewMode} size='small' type='default'>
          <CloseOutlined />
        </Button>
      </Flex>
      <SelectDrawer
        label={'Assigned To'}
        visible={visible}
        omittedValues={omittedValues}
        onClose={closeDrawer}
      />
    </DzBox>
  );
};
