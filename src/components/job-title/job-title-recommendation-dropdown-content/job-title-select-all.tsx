import { CheckboxProps } from '@/lib/types/uicomponents';
import { Text } from '@/uicomponents';
import { Checkbox } from '@/uicomponents/form/input';
import { FC } from 'react';

interface JobTitleSelectAllProps {
  checked: boolean;
  onSelectAllChange: () => void;
}

export const JobTitleSelectAll: FC<JobTitleSelectAllProps> = ({
  checked,
  onSelectAllChange,
}) => {
  const onSelectAll: CheckboxProps['onChange'] = () => {
    onSelectAllChange();
  };
  return (
    <Checkbox
      checked={checked}
      onChange={onSelectAll}
      style={{ marginLeft: '0.5rem' }}>
      <Text
        strong
        style={{
          fontSize: '0.875rem',
        }}>
        Select All
      </Text>
    </Checkbox>
  );
};
