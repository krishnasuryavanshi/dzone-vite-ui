import { DeliveryType, DeliveryTypeLabel } from '../enums';

export const DeliveryTypeOptions = [
  {
    label: DeliveryTypeLabel.FLAT_FILE,
    value: DeliveryType.FLAT_FILE,
  },
  {
    label: DeliveryTypeLabel.HUBSPOT,
    value: DeliveryType.HUBSPOT,
  },
  {
    label: DeliveryTypeLabel.WEBFORM,
    value: DeliveryType.WEBFORM,
  },
  {
    label: DeliveryTypeLabel.ZAPIER,
    value: DeliveryType.ZAPIER,
  },
  {
    label: DeliveryTypeLabel.FTP,
    value: DeliveryType.FTP,
  },
];
