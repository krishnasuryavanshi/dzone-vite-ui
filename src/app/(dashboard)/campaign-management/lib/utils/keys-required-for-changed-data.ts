import { CampaignField } from '../../campaigns/lib/enums';
import { LineItemFields } from '../../line-items/lib/enums';

export const FILE_KEYS: (CampaignField | LineItemFields)[] = [
  CampaignField.UploadIoFile,
];
export const UNCHANGING_KEYS: (CampaignField | LineItemFields)[] = [
  CampaignField.Status,
  CampaignField.Id,
  CampaignField.CampaignId,
  CampaignField.MarketerCode,
  CampaignField.TenantCode,
  LineItemFields.LineItemId,
  LineItemFields.LineItemIdNumber,
  LineItemFields.CampaignIdNumber,
  LineItemFields.CampaignName,
  LineItemFields.CampaignId,
  LineItemFields.MarketerCode,
  LineItemFields.Marketer,
  LineItemFields.TenantCode,
  LineItemFields.CreatedBy,
  LineItemFields.CreatedOn,
  LineItemFields.UpdatedBy,
  LineItemFields.UpdatedOn,
  LineItemFields.ActualStartDate,
  LineItemFields.ActualEndDate,
  LineItemFields.LeadsDeliveryPercentage,
  LineItemFields.AssignedTo,
  LineItemFields.Status,
]; // Keys that do not change and should be ignored in comparisons

// Define the type for date keys
export const dateKeys: (CampaignField | LineItemFields)[] = [
  CampaignField.OpportunityCloseDate,
  CampaignField.TargetEndDate,
  CampaignField.TargetStartDate,
  LineItemFields.LineItemTargetEndDate,
  LineItemFields.LineItemTargetStartDate,
  LineItemFields.TargetDeliveryStartDate,
];
