import { useValidationSettingStore } from '@/app/(dashboard)/lead-validation-settings/store';
import { DzRecord } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { RuleContainer } from './rule-container';
import { Hideable } from '@/components/shared';
import { TruncatedTagList } from './components/truncated-tag-list';
import { DrawerShowList } from '@/components/shared/text';

type MandatoryValidationsProps = {
  ruleName: string;
  isEditing?: boolean;
};

export const MandatoryValidations = ({
  ruleName,
  isEditing,
}: MandatoryValidationsProps) => {
  const [header, setHeader] = useState<string>('');
  const [extra, setExtra] = useState<string[]>([]);
  const [fields, setFields] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { leadValidationSettingConfig } = useValidationSettingStore();

  useEffect(() => {
    if (ruleName && leadValidationSettingConfig) {
      const res = leadValidationSettingConfig?.[ruleName];
      setHeader(res?.label || '');
      const allFields =
        res?.sections?.[0]?.attributes
          ?.filter((attr: DzRecord) => attr.value)
          ?.map((attr: DzRecord) => attr.label || '') || [];
      setFields(allFields);
      setExtra([`${allFields?.length || 0} Fields`]);
    }
  }, [ruleName, leadValidationSettingConfig]);

  return (
    <>
      <RuleContainer
        header={header}
        extra={extra}
        ruleName={ruleName}
        showEditButton={isEditing}>
        <Hideable show={fields.length > 0}>
          <TruncatedTagList
            items={fields}
            onViewAll={() => setIsDrawerOpen(true)}
          />
        </Hideable>
      </RuleContainer>
      <DrawerShowList
        label={header}
        show={isDrawerOpen}
        list={fields}
        hasChildren={false}
        handleClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
