import { DzScrollContainer } from '@/components/layout/v1';
import { ReactNode, CSSProperties } from 'react';

interface TableWithPaginationLayoutProps {
  header?: ReactNode;
  table: ReactNode;
  pagination?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  headerClassName?: string;
  headerStyle?: CSSProperties;
  scrollClassName?: string;
  scrollStyle?: CSSProperties;
  paginationClassName?: string;
  paginationStyle?: CSSProperties;
}

export const TableWithPaginationLayout = ({
  header,
  table,
  pagination,
  children,
}: TableWithPaginationLayoutProps) => {
  return (
    <DzScrollContainer vertical>
      {header && <DzScrollContainer.Sticky>{header}</DzScrollContainer.Sticky>}
      <DzScrollContainer.Scroll>
        {table}
        {children}
      </DzScrollContainer.Scroll>
      {pagination && <DzScrollContainer.StickyBottom>{pagination}</DzScrollContainer.StickyBottom>}
    </DzScrollContainer>
  );
};
