import { LineItemStatus } from '../../enums';

const EDITABLE_STATUSES = [
  LineItemStatus.DRAFT,
  LineItemStatus.WAITING_TO_GO_LIVE,
  LineItemStatus.READY_FOR_LIVE,
];

export const canEditCustomFieldDefinition = (
  status: string | undefined,
): boolean => {
  if (!status) return true;
  return EDITABLE_STATUSES.includes(status as LineItemStatus);
};
