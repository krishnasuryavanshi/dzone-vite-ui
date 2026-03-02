import { DzBox } from '@/components/layout/v1';
import { MapFunction } from '@/components/shared';
import { CLR_WHITE } from '@/lib/constants';
import { DzRecord } from '@/lib/types';
import { DZENT_BTN_PRIMARY } from '@/lib/constants/color-constants';
import { RadioChangeEvent } from '@/lib/types/uicomponents';
import { FormInstance } from '@/uicomponents/form';
import { Radio, RadioGroup } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Text } from '@/uicomponents/text';

type RadioButtonGroupProps = {
  options: DzRecord[];
  name: string;
  form: FormInstance;
};

export const RadioButtonGroup = ({
  options,
  name,
  form,
}: RadioButtonGroupProps) => {
  const handleRadioChange = (e: RadioChangeEvent) => {
    form.setFieldValue(name, e.target.value);
  };
  const renderRadio = (item: DzRecord, index: number) => {
    const selectedValue = form.getFieldValue(name);
    const boxShadowColor =
      selectedValue === item ? DZENT_BTN_PRIMARY : 'rgba(0, 0, 0, 0.16)';

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
        <Radio value={item}>
          <Flex vertical gap={'1rem'}>
            <DzBox>
              <Text style={{ marginLeft: '0.5rem' }}>{item.label}</Text>
            </DzBox>
          </Flex>
        </Radio>
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
      <RadioGroup
        onChange={handleRadioChange}
        style={{ display: 'flex', flexDirection: 'column' }}>
        <MapFunction items={options} renderItem={renderRadio} />
      </RadioGroup>
    </DzBox>
  );
};
