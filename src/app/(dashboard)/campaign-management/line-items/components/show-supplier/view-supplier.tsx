import { Text } from '@/uicomponents/text';
import { FC } from 'react';

interface IViewSupplierProps {
  supplierName: string;
}

export const ViewSupplier: FC<IViewSupplierProps> = ({ supplierName }) => {
  return <Text text14>{supplierName}</Text>;
};
