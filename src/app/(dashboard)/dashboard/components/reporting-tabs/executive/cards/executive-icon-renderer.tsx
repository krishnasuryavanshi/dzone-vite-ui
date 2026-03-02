import {
  PositiveReportIcon,
  NegativeReportIcon,
  NeutralReportIcon,
} from '@/uicomponents/icons/svgs';
import { FC } from 'react';

interface IExecutiveIconRendererProps {
  isPositive: boolean | null;
}

const ExecutiveIconRenderer: FC<IExecutiveIconRendererProps> = ({
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

export default ExecutiveIconRenderer;
