import { useValidationSettingStore } from '@/app/(dashboard)/lead-validation-settings/store';
import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { DzRecord } from '@/lib/types';
import { Text } from '@/uicomponents/text';
import { useEffect, useState } from 'react';
import { RuleContainer } from './rule-container';

type SyntaxValidationProps = {
  ruleName: string;
  isEditing?: boolean;
};

export const SyntaxValidation = ({ ruleName, isEditing = false }: SyntaxValidationProps) => {
  const [header, setHeader] = useState<string>('');
  const [fields, setFields] = useState<string[]>([]);

  const { leadValidationSettingConfig } = useValidationSettingStore();

  useEffect(() => {
    if (ruleName && leadValidationSettingConfig) {
      const res = leadValidationSettingConfig?.[ruleName];
      setHeader(res?.label || '');
      const fields =
        res?.sections?.[0]?.attributes
          ?.filter((attr: DzRecord) => attr.value)
          ?.map((attr: DzRecord) => attr.label || '') || [];
      setFields(fields);
    }
  }, [ruleName, leadValidationSettingConfig]);
  return (
    <RuleContainer header={header} ruleName={ruleName} showEditButton={isEditing}>
      <Hideable show={fields.length > 0}>
        <DzBox>
          <Text style={{ fontSize: '0.875rem' }} strong>
            Fields :{' '}
          </Text>
          <Text style={{ fontSize: '0.875rem' }}>{fields.join(', ')}</Text>
        </DzBox>
      </Hideable>
    </RuleContainer>
  );
};
