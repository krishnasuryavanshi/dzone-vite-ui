import { MapFunction } from '@/components/shared';
import { OptionsKeys } from '@/lib/enums/options-keys.enum';
import React, { FC, useEffect, useState } from 'react';
import { CreateFormSection } from './create-form-section';
import { FormInstance } from '@/uicomponents/form';

interface ICreateFormContentProps {
  stepFields: any;
  lists: Record<OptionsKeys, any[]>;
  form: FormInstance<any>;
  entityId: string | undefined;
}

export const CreateFormContent: FC<ICreateFormContentProps> = ({
  stepFields,
  lists,
  form,
  entityId,
}) => {
  const [sections, setSections] = useState<any>([]);
  const [transKey, setTransKey] = useState('');

  useEffect(() => {
    setSections(stepFields?.step ? stepFields.step : []);
    setTransKey(stepFields?.translation ? stepFields.translation : '');
  }, [stepFields]);

  const renderSections = (item: any) => {
    return (
      <CreateFormSection
        section={item}
        transKey={transKey}
        lists={lists}
        entityId={entityId}
      />
    );
  };

  if (!sections?.length) return null;

  return <MapFunction items={sections} renderItem={renderSections} />;
};
