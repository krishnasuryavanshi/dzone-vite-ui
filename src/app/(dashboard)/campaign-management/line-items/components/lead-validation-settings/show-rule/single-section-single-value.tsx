import { useValidationSettingStore } from '@/app/(dashboard)/lead-validation-settings/store';
import { DzRecord } from '@/lib/types';
import { useEffect, useState } from 'react';
import { RuleContainer } from './rule-container';

type SingleSectionSingleValueProps = {
  ruleName: string;
  isEditing?: boolean;
};

export const SingleSectionSingleValue = ({
  ruleName,
  isEditing,
}: SingleSectionSingleValueProps) => {
  const [header, setHeader] = useState<string>('');
  const [extra, setExtra] = useState<string[]>([]);
  const { leadValidationSettingConfig } = useValidationSettingStore();

  useEffect(() => {
    if (ruleName && leadValidationSettingConfig) {
      const res = leadValidationSettingConfig?.[ruleName];
      setHeader(res?.label || '');
      const extras = res?.sections?.[0]?.attributes
        ?.filter((attr: DzRecord) => attr.value)
        ?.map((attr: DzRecord) => attr.label || '');
      setExtra(extras || []);
    }
  }, [ruleName, leadValidationSettingConfig]);
  return (
    <RuleContainer header={header} extra={extra} ruleName={ruleName} showEditButton={isEditing}>
      {/* <DzBox>
        <Text strong>Fields : </Text>
        <Text>Email, Phone Number</Text>
      </DzBox> */}
    </RuleContainer>
  );
};
