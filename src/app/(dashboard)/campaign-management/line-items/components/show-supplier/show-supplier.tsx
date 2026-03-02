import { fetchOrganizationsByType } from '@/app/(dashboard)/(system-admin)/organizations/services';
import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { LoadingOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useState } from 'react';
import { ILineItem } from '../../lib/types';
import { NoSupplier } from './no-supplier';
import { UpdateSupplier } from './update-supplier';
import { ViewSupplier } from './view-supplier';

interface IShowSupplierProps {
  lineItem: ILineItem;
}

export const ShowSupplier: FC<IShowSupplierProps> = ({ lineItem }) => {
  const [supplierName, setSupplierName] = useState<string | undefined>();
  const [mode, setMode] = useState<'no-data' | 'view' | 'edit' | 'loading'>(
    'loading',
  );
  const [suppliers, setSuppliers] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    if (lineItem?.supplier) {
      setSupplierName(lineItem.supplier);
    } else {
      setSupplierName(undefined);
    }
  }, [lineItem?.supplier]);

  useEffect(() => {
    if (supplierName) {
      setMode('view');
    } else {
      setMode('no-data');
    }
  }, [supplierName]);

  const startEditing = async () => {
    setMode('loading');
    try {
      const { data } = await fetchOrganizationsByType('Supplier');
      setSuppliers(
        data.map((supplier: Record<string, string>) => ({
          label: supplier.name,
          value: supplier.code,
        })),
      );
      setMode('edit');
    } catch (e) {
      setMode('no-data');
    }
  };

  const afterUpdateSupplierName = (name: string) => {
    setSupplierName(name);
  };

  const cancelUpdateSupplierName = () => {
    setMode('no-data');
  };

  return (
    <DzBox onClick={(e) => e.stopPropagation()} style={{ width: '100%' }}>
      <Hideable show={mode === 'loading'}>
        <Flex justify='center' align='center' style={{ width: '100%' }}>
          <LoadingOutlined />
        </Flex>
      </Hideable>
      <Hideable show={mode === 'no-data'}>
        <NoSupplier handleEditing={startEditing} />
      </Hideable>
      <Hideable show={mode === 'view' && !!supplierName}>
        <ViewSupplier supplierName={supplierName as string} />
      </Hideable>
      <Hideable show={mode === 'edit' && !supplierName}>
        <UpdateSupplier
          lineItemId={lineItem.id}
          options={suppliers}
          afterUpdateSupplierName={afterUpdateSupplierName}
          cancelUpdateSupplierName={cancelUpdateSupplierName}
        />
      </Hideable>
    </DzBox>
  );
};
