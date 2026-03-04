import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { OptionsKeys } from '@/lib/enums/options-keys.enum';
import { Row } from '@/uicomponents/layout/grid';
import { FC, useState } from 'react';
import { CreateFormSectionHeading } from './create-form-section-heading';
import { FormControlItemContent } from './form-control-item-content';

interface ICreateFormSection {
  section: any;
  transKey: string;
  lists: Record<OptionsKeys, any[]>;
  entityId?: string;
}

export const CreateFormSection: FC<ICreateFormSection> = ({
  section,
  transKey,
  lists,
  entityId,
}) => {
  const [colLayout] = useState({
    xs: 24,
    sm: 24,
    md: 12,
    lg: 8,
    xl: 8,
    xxl: 6,
  });

  const renderSectionContents = (item: any) => {
    return <FormControlItemContent {...{ item, colLayout, lists, transKey, entityId }} />;
  };

  return (
    <DzBox className='section-wrapper' style={{ marginBottom: '1rem' }}>
      {section.fields.length > 0 && (
        <>
          <CreateFormSectionHeading section={section} transKey={transKey} />
          <DzBox className='section-content'>
            <Row gutter={[16, 16]}>
              <MapFunction items={section.fields} renderItem={renderSectionContents} />
            </Row>
          </DzBox>
        </>
      )}
    </DzBox>
  );
};
