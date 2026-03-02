import { DzBox } from '@/components/layout/v1';
import React, { FC } from 'react';
import styles from './no-supplier.module.css';

interface INoSupplierProps {
  handleEditing: () => void;
}

export const NoSupplier: FC<INoSupplierProps> = ({ handleEditing }) => {
  return (
    <DzBox
      onClick={(e) => {
        e.stopPropagation();
        handleEditing();
      }}
      className={styles.assignSupplier}>
      <em>Assign Supplier</em>
    </DzBox>
  );
};
