import { useOrganizationsByTypeQuery } from '@/app/(dashboard)/(system-admin)/organizations/hooks';
import { DzBox } from '@/components/layout/v1';
import { Hideable } from '@/components/shared';
import { LoadingOutlined } from '@/uicomponents/icons';
import { Flex } from '@/uicomponents/layout';
import { FC, useEffect, useMemo, useState } from 'react';
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
  const [fetchEnabled, setFetchEnabled] = useState(false);

  const { data: orgData, refetch, isFetching } = useOrganizationsByTypeQuery(
    'Supplier',
    undefined,
    fetchEnabled,
  );

  const suppliers = useMemo(
    () =>
      orgData?.data?.map((supplier: Record<string, string>) => ({
        label: supplier.name,
        value: supplier.code,
      })) ?? [],
    [orgData],
  );

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

  useEffect(() => {
    if (fetchEnabled && !isFetching && orgData) {
      setMode('edit');
    }
  }, [fetchEnabled, isFetching, orgData]);

  const startEditing = async () => {
    setMode('loading');
    if (orgData) {
      setMode('edit');
    } else {
      setFetchEnabled(true);
      refetch();
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
