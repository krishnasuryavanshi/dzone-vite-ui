export interface IPerformanceCounts {
  numberOfContactsGenerated: number | null;
  numberOfLeadsDelivered: number | null;
  percentageOfContactsThatBecomeDeliverableLeads: string;
  averageTimeFromCampaignCreationToFirstLeadDelivery: string;
  averageTimeFromContactResearchToQualityAudit: string;
  averageTimeFromQaReadyToLeadDelivery: string;
  averageTimeInPacingReserved: string;
}
