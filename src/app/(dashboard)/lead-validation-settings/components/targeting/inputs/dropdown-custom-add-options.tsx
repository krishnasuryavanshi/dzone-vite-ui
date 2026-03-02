import { DzBox } from '@/components/layout/v1';
import { Button } from '@/uicomponents/button';
import { InputNumber } from '@/uicomponents/form/input';
import { Flex } from '@/uicomponents/layout';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Text } from '@/uicomponents/text';
import { InputNumberProps } from 'antd/es/input-number';
import React, { CSSProperties, useState } from 'react';

type DropdownCustomAddOptionsProps = {
  options: { label: string; value: string }[];
  onAddOption: (option: { label: string; value: string }) => void;
  onCancel: () => void;
  variant?: 'default' | 'small';
};
export const DropdownCustomAddOptions = ({
  options,
  onCancel,
  onAddOption,
  variant = 'default',
}: DropdownCustomAddOptionsProps) => {
  const [values, setValues] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000,
  });
  const [errors, setErrors] = useState<{
    min: null | string;
    max: null | string;
  }>({
    min: null,
    max: null,
  });

  const validateNumbers = (
    field: 'min' | 'max',
    val: { min: number; max: number },
  ) => {
    const newErrors = { ...errors };
    if (field === 'min') {
      newErrors.max = null;
      if (val.min < 0) {
        newErrors.min = 'Min count cannot be less than 0';
      } else if (val.min >= val.max) {
        newErrors.min = 'Min count must be less than Max count';
      } else {
        newErrors.min = null;
      }
    } else if (field === 'max') {
      newErrors.min = null;
      if (val.max <= val.min) {
        newErrors.max = 'Max count must be greater than Min count';
      } else {
        newErrors.max = null;
      }
    }
    setErrors(newErrors);
  };

  const onMinChange: InputNumberProps['onChange'] = (value) => {
    const val = { ...values, min: value as number };
    setValues(val);
    validateNumbers('min', val);
  };

  const onMaxChange: InputNumberProps['onChange'] = (value) => {
    const val = { ...values, max: value as number };
    setValues(val);
    validateNumbers('max', val);
  };

  const handleAddOption = () => {
    const existingOption = options.find(
      (option) => option.value === `${values.min}-${values.max}`,
    );
    if (existingOption) {
      onCancel();
      return true;
    }
    const newOption = {
      label: `${values.min}-${values.max}`,
      value: `${values.min}-${values.max}`,
    };
    onAddOption(newOption);
  };

  const TextStyles: CSSProperties = {
    fontSize: variant === 'small' ? '0.875rem' : '1rem',
  };

  return (
    <DzBox>
      <Flex vertical gap={'0.5rem'}>
        <DzBox>
          <Text strong style={TextStyles}>
            Add a custom count range
          </Text>
        </DzBox>
        <Row gutter={16} style={{ marginBlock: '0.5rem' }}>
          <Col span={12}>
            <Flex vertical gap={'0.25rem'} style={{ width: '100%' }}>
              <Text style={TextStyles}>Min Count</Text>
              <InputNumber
                status={!!errors.min ? 'error' : undefined}
                style={{ width: '100%' }}
                min={0}
                onChange={onMinChange}
                value={values.min}
                size={variant === 'small' ? 'small' : undefined}
              />
              {errors.min ? (
                <Text type='danger' style={{ fontSize: '0.75rem' }}>
                  {errors.min}
                </Text>
              ) : null}
            </Flex>
          </Col>
          <Col span={12}>
            <Flex vertical gap={'0.25rem'} style={{ width: '100%' }}>
              <Text style={TextStyles}>Max Count</Text>
              <InputNumber
                status={!!errors.max ? 'error' : undefined}
                style={{ width: '100%' }}
                min={1}
                onChange={onMaxChange}
                value={values.max}
                size={variant === 'small' ? 'small' : undefined}
              />
              {errors.max ? (
                <Text type='danger' style={{ fontSize: '0.75rem' }}>
                  {errors.max}
                </Text>
              ) : null}
            </Flex>
          </Col>
        </Row>
        <Flex justify='flex-end' gap={'0.25rem'}>
          <Button type='text' size='small' onClick={onCancel}>
            <Text>Cancel</Text>
          </Button>
          <Button
            type='text'
            size='small'
            onClick={handleAddOption}
            disabled={
              !!(!(values.min >= 0) || !values.max || errors.min || errors.max)
            }>
            <Text strong style={{ color: '#235AED' }}>
              Save
            </Text>
          </Button>
        </Flex>
      </Flex>
    </DzBox>
  );
};
