import { useViewControl } from '@/lib/hooks';
import { FC, useState } from 'react';
import { Col } from '@/uicomponents/layout/grid';
import { isArray } from 'lodash';
import { FieldPreview } from '../field-preview';
import { LineItemFields } from '../../line-items/lib/enums';

interface IFieldColumnProps {
  data: Record<string, any>;
  handleDownload: () => Promise<void>;
}

const rangeFields = [
  LineItemFields.IsCompanySizeEmployeeCountCustom,
  LineItemFields.IsCompanySizeRevenueCustom,
];

export const FieldColumn: FC<IFieldColumnProps> = ({
  data,
  handleDownload,
}) => {
  const ViewControl = useViewControl(data, handleDownload);
  const [colSpan] = useState({
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 6,
    xxl: 4,
  });

  if (
    (!data?.value || (isArray(data?.value) && !data?.value?.length)) &&
    !rangeFields.includes(data.field)
  )
    return null;

  return (
    <Col {...colSpan}>
      <FieldPreview label={data?.label}>
        {ViewControl || 'Loading'}
      </FieldPreview>
    </Col>
  );
};
