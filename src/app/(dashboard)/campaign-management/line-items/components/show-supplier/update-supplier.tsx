import { DzBox } from '@/components/layout/v1';
import { showNotification } from '@/services';
import { Button } from '@/uicomponents/button';
import { Select } from '@/uicomponents/form/input';
import { CheckOutlined, CloseOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import React, { FC } from 'react';
import { updateLineItem } from '../../services/update-line-item';

interface IUpdateSupplierProps {
  options: { label: string; value: string }[];
  afterUpdateSupplierName?: (name: string) => void;
  cancelUpdateSupplierName?: () => void;
  lineItemId: string;
}

export const UpdateSupplier: FC<IUpdateSupplierProps> = ({
  options,
  afterUpdateSupplierName,
  cancelUpdateSupplierName,
  lineItemId,
}) => {
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(undefined);
  const handleChange = (value: string) => {
    setSelectedValue(value);
  };
  const updateSupplier = async () => {
    try {
      const { data } = await updateLineItem(
        {
          supplierCode: selectedValue,
          supplier: options.find((option) => option.value === selectedValue)?.label,
        },
        lineItemId,
      );
      showNotification({
        type: 'success',
        message: 'Supplier updated successfully',
      });
      afterUpdateSupplierName && afterUpdateSupplierName(data.supplier);
      setSelectedValue(undefined);
    } catch (error) {}
  };
  return (
    <Flex gap={12} style={{ marginTop: '-0.25rem' }}>
      <DzBox>
        <Select
          options={options}
          onChange={handleChange}
          placeholder='Select Supplier'
          value={selectedValue}
          style={{ height: '2rem', width: '10rem' }}
        />
      </DzBox>
      <Flex gap={4}>
        <Button
          type='primary'
          size='small'
          disabled={!selectedValue}
          onClick={() => {
            selectedValue && updateSupplier();
          }}
        >
          <CheckOutlined />
        </Button>
        <Button
          size='small'
          onClick={() => {
            setSelectedValue(undefined);
            cancelUpdateSupplierName && cancelUpdateSupplierName();
          }}
        >
          <CloseOutlined />
        </Button>
      </Flex>
    </Flex>
  );
};
