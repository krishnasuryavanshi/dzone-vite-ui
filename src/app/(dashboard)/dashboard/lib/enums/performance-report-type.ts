export enum PerformanceReportType {
  InternalRejectRate = 'internalRejectRate',
  MarketerReturnRate = 'marketerReturnRate',
  InternalRejectionReasons = 'internalRejectionReasons',
  ClientRejectionReasons = 'clientRejectionReasons',
  DetailsOfInaccurateData = 'detailsOfInaccurateData',
  LeadStatus = 'leadStatus',
}

export enum PerformanceCountsType {
  NumberOfContactsGenerated = 'numberOfContactsGenerated',
  NumberOfLeadsDelivered = 'numberOfLeadsDelivered',
  PercentageOfContactsThatBecomeDeliverableLeads = 'percentageOfContactsThatBecomeDeliverableLeads',
  AverageTimeFromCampaignCreationToFirstLeadDelivery = 'averageTimeFromCampaignCreationToFirstLeadDelivery',
  AverageTimeFromContactResearchToQualityAudit = 'averageTimeFromContactResearchToQualityAudit',
  AverageTimeFromQaReadyToLeadDelivery = 'averageTimeFromQaReadyToLeadDelivery',
  AverageTimeInPacingReserved = 'averageTimeInPacingReserved',
}
