'use client';
import { LineItemStatus } from '../enums';
import { Live } from '@/components/status';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  PauseOutlined,
} from '@/uicomponents/icons';
import { StatusMeta } from '../constants';

interface IStatusMeta {
  value: string;
}

interface IStatusData {
  [key: string]: {
    backgroundColor: string;
    color: string;
    icon: JSX.Element | null;
  };
}

export const StatusMetaLineItems = ({ value }: IStatusMeta) => {
  const statusData: IStatusData = { ...StatusMeta };

  const currentStatus = statusData[value]; // Access the current status data
  if (!currentStatus) {
    return null; // Handle the case where the status is not found
  }
  const { backgroundColor, color, icon } = currentStatus;
  return { backgroundColor, color, icon };
};
