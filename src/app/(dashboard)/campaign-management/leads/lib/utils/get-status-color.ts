import { LeadValidationStatus } from '../enums';

export const getStatusColor = (status: string) => {
  switch (status) {
    case LeadValidationStatus.InProgress:
      return '#17a2b8'; // Info Blue
    case LeadValidationStatus.Scheduled:
      return '#6c757d'; // Gray
    case LeadValidationStatus.Valid:
      return '#28a745'; // Green
    case LeadValidationStatus.Invalid:
      return '#dc3545'; // Red
    case LeadValidationStatus.InValidation:
      return '#ffc107'; // Yellow
    case LeadValidationStatus.SystemError:
      return '#ff00ff'; // Magenta
    case LeadValidationStatus.PendingEmailValidation:
      return '#235AED'; // Blue
    default:
      return '#d3d3d3'; // Default gray
  }
};
