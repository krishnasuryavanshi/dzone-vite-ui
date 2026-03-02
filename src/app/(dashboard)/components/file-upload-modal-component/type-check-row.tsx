import { Translate } from '@/components/i18n';
import {
  ViewLeadPermissions,
  LeadActionsEnum,
  UpdateLeadPermissions,
} from '@/lib/enums/permissions';
import { usePermissionCheck } from '@/lib/hooks';
import { RadioChangeEvent } from '@/lib/types/uicomponents';
import { Radio, RadioGroup } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { FC } from 'react';

interface ITypeCheckRowProps {
  onTypeChange: (value: string) => void;
}

export const TypeCheckRow: FC<ITypeCheckRowProps> = ({ onTypeChange }) => {
  const hasUploadViewPermission = usePermissionCheck(
    [LeadActionsEnum.View, LeadActionsEnum.Upload],
    true,
  );
  const hasUpdateViewPermission = usePermissionCheck(
    [LeadActionsEnum.View, LeadActionsEnum.Update],
    true,
  );

  const onChange = (e: RadioChangeEvent) => {
    onTypeChange(e.target.value);
  };
  return (
    <Flex justify='center'>
      <RadioGroup onChange={onChange}>
        <Radio value={true} disabled={!hasUploadViewPermission}>
          <Translate i18nKey='Upload New Lead' />
        </Radio>
        <Radio value={false} disabled={!hasUpdateViewPermission}>
          <Translate i18nKey='Update Existing Lead' />
        </Radio>
      </RadioGroup>
    </Flex>
  );
};
