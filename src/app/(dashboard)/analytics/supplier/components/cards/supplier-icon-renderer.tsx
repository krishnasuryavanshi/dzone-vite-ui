import {
  PositiveReportIcon,
  NegativeReportIcon,
  NeutralReportIcon,
} from '@/uicomponents/icons/svgs';
import { FC } from 'react';

interface ISupplierIconRendererProps {
  isPositive: boolean | null;
}

const SupplierIconRenderer: FC<ISupplierIconRendererProps> = ({
  isPositive,
}) => {
  if (isPositive === true) {
    return <PositiveReportIcon />;
  } else if (isPositive === false) {
    return <NegativeReportIcon />;
  } else {
    return <NeutralReportIcon />;
  }
};

export default SupplierIconRenderer;
