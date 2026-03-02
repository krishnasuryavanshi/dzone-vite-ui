import { useValidationSettingStore } from '@/app/(dashboard)/lead-validation-settings/store';
import { DzRecord } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { RuleContainer } from './rule-container';
import { Hideable } from '@/components/shared';
import { Flex } from '@/uicomponents/layout';
import { DzBox } from '@/components/layout/v1';
import { Text } from '@/uicomponents/text';

type DuplicationCheckProps = {
  ruleName: string;
  isEditing?: boolean;
};

// Specific configuration for the duplication editor
const duplicationEditConfig = {
  type: 'duplication',
};

export const DuplicationCheck = ({
  ruleName,
  isEditing,
}: DuplicationCheckProps) => {
  const [header, setHeader] = useState<string>('');
  const [extra, setExtra] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [lookbackPeriod, setLookbackPeriod] = useState<string>('');

  const { leadValidationSettingConfig } = useValidationSettingStore();

  useEffect(() => {
    if (ruleName && leadValidationSettingConfig) {
      const res = leadValidationSettingConfig?.[ruleName];
      setHeader(res?.label || '');
      const sectionValues: DzRecord = {};

      res?.sections?.forEach((section: DzRecord) => {
        if (section.attributes?.[0]?.type === 'number') {
          // const option = section.attributes?.[0]?.options?.find(
          //   (option: DzRecord) =>
          //     option.value === section.attributes?.[0]?.value,
          // );
          sectionValues[section.name] = section.attributes?.[0]?.value;
          return;
        }
        const values =
          section.attributes
            ?.filter((attr: DzRecord) => attr.value)
            ?.map((attr: DzRecord) => attr.label || '') || [];
        sectionValues[section.name] = values;
      });

      const extra: string[] = [];

      Object.entries(sectionValues).forEach(([key, value]) => {
        if (key === 'LOOPBACK_PERIOD') {
          setLookbackPeriod(value);
        } else if (key === 'ACCOUNT_LEVEL' || key === 'ENTITY_LEVEL') {
          extra.push(...value);
        } else if (key === 'DUPLICATE_VALIDATION_FIELDS') {
          setFields(value);
        }
      });

      setExtra(extra);
    }
  }, [ruleName, leadValidationSettingConfig]);

  return (
    <RuleContainer
      header={header}
      extra={extra}
      ruleName={ruleName}
      editConfig={duplicationEditConfig}
      showEditButton={isEditing}>
      <Hideable show={fields.length > 0 || !!lookbackPeriod}>
        <Flex gap='2rem'>
          <Hideable show={!!lookbackPeriod}>
            <DzBox>
              <Text strong style={{ fontSize: '0.875rem' }}>
                Look Back Period (in months) :{' '}
              </Text>
              <Text style={{ fontSize: '0.875rem' }}>{lookbackPeriod}</Text>
            </DzBox>
          </Hideable>
          <Hideable show={fields.length > 0}>
            <DzBox>
              <Text strong style={{ fontSize: '0.875rem' }}>
                Fields :{' '}
              </Text>
              <Text style={{ fontSize: '0.875rem' }}>{fields.join(', ')}</Text>
            </DzBox>
          </Hideable>
        </Flex>
      </Hideable>
    </RuleContainer>
  );
};
