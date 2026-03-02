export interface IRow {
  name: string;
}

export interface ILineReportRow extends IRow {
  pacing: number;
  released: number;
  reserved: number;
}
export interface IBaseReportRow extends IRow {
  value: number;
}

export interface IReportRowWithColor extends IBaseReportRow {
  color: string;
}

export interface IReportRowWithPercentage extends IBaseReportRow {
  percent: string;
}

export interface IReportRow
  extends IReportRowWithColor,
    IReportRowWithPercentage {}

export interface IPerformanceChart {
  internalRejectRate: IReportRow[];
  marketerReturnRate: IReportRow[];
  internalRejectionReason: IReportRow[];
  detailsOfInaccurateData: IBaseReportRow[];
  clientRejectionReason: IBaseReportRow[];
  leadStatus: IReportRowWithPercentage[];
}
