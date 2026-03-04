import { Col, Row } from '@/uicomponents/layout/grid';
import { Skeleton, SkeletonInput } from '@/uicomponents/layout/skeleton';
import { useState } from 'react';

export const FieldSkeltonRow = ({
  show,
  showTitle = true,
}: {
  show: boolean;
  showTitle?: boolean;
}) => {
  const [colSpan] = useState({
    xxl: 4,
    xl: 4,
    lg: 6,
    md: 6,
    sm: 12,
    xs: 24,
  });
  if (!show) return null;
  return (
    <>
      {showTitle ? <SkeletonInput active size='small' style={{ margin: '1rem 0' }} /> : null}
      <Row style={{ marginTop: '1rem' }} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col {...colSpan}>
          <FieldSkeleton />
        </Col>
        <Col {...colSpan}>
          <FieldSkeleton />
        </Col>
        <Col {...colSpan}>
          <FieldSkeleton />
        </Col>
        <Col {...colSpan}>
          <FieldSkeleton />
        </Col>
        <Col {...colSpan}>
          <FieldSkeleton />
        </Col>
        <Col {...colSpan}>
          <FieldSkeleton />
        </Col>
      </Row>
    </>
  );
};

export const FieldSkeleton = () => {
  return <Skeleton active paragraph={{ rows: 1, width: '100%' }} />;
};
