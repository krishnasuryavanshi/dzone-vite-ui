export interface IOrganization {
  id?: string;
  name: string;
  status?: { name: string; value: string };
  businessDomain?: string;
  organizationType?: Record<string, string>;
  managedByDigitalzone?: boolean;
  crmId?: string;
  financeId?: string;
  createdAt?: string;
}
