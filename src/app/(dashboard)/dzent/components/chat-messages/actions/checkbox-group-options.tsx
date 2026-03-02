import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { FormInstance } from '@/uicomponents/form';
import { Checkbox, CheckboxGroup } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';
import React from 'react';

type CheckboxGroupOptionsProps = {
  options: DzRecord[];
  name: string;
  form: FormInstance;
};

export const CheckboxGroupOptions = ({
  options,
  name,
  form,
}: CheckboxGroupOptionsProps) => {
  const handleCheckboxChange = (checkedValue: string[]) => {
    form.setFieldValue(name, checkedValue);
  };

  const renderCheckbox = (item: DzRecord, index: number) => {
    const selectedValues = form.getFieldValue(name);
    const boxShadowColor = selectedValues?.includes(item)
      ? '#3D71FB'
      : 'rgba(0, 0, 0, 0.16)';

    return (
      <DzBox
        style={{
          marginBlock: '0.25rem',
          padding: '1rem',
          borderRadius: '4px',
          background: CLR_WHITE,
          boxShadow: `0px 0px 4px 0px ${boxShadowColor} inset`,
        }}
        key={index}>
        <Checkbox value={item} onChange={() => {}}>
          <Flex vertical gap={'1rem'}>
            <DzBox>
              <Text style={{ marginLeft: '0.5rem' }}>{item.label}</Text>
            </DzBox>
          </Flex>
        </Checkbox>
      </DzBox>
    );
  };

  return (
    <DzBox
      style={{
        paddingBlock: '0.25rem',
        maxHeight: '18rem',
        overflowY: 'auto',
      }}>
      <CheckboxGroup
        onChange={handleCheckboxChange}
        style={{ display: 'flex', flexDirection: 'column' }}>
        <MapFunction items={options} renderItem={renderCheckbox} />
      </CheckboxGroup>
    </DzBox>
  );
};
