import { Button } from '@/uicomponents/index';
import { Flex } from '@/uicomponents/layout';
import { LoadingOutlined } from '@ant-design/icons';
import { FC } from 'react';

interface IOrganizationFormActionsProps {
  handleCancel: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

export const OrganizationFormActions: FC<IOrganizationFormActionsProps> = ({
  handleCancel,
  isEditing,
  isSubmitting,
}) => {
  const buttonText = isSubmitting ? (
    <LoadingOutlined />
  ) : isEditing ? (
    'Update Organization'
  ) : (
    'Create Organization'
  );

  return (
    <Flex gap={'1rem'} justify='end'>
      <Button onClick={handleCancel}>Cancel</Button>

      <Button type='primary' htmlType='submit' disabled={isSubmitting}>
        {buttonText}
      </Button>
    </Flex>
  );
};
