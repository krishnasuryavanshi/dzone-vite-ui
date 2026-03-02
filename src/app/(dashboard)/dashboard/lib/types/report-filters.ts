import { ReactNode } from 'react';

export interface IFilterItem {
  label: ReactNode | string;
  value: string;
  key: string;
}

export interface IFilterLineItem extends IFilterItem {
  lineItemId: string;
  name: string;
  campaignId: string;
}

export interface IFilterCampaign extends IFilterItem {
  campaignId: string;
  name: string;
}

export interface IFilterClient extends IFilterItem {
  clientId: string;
  name: string;
}

interface IClient {
  id: string;
  clientId: string;
  name: string;
}

interface ICampaign {
  id: string;
  campaignId: string;
  name: string;
  client: IClient;
}

export interface ILineItem {
  id: string;
  lineItemId: string;
  name: string;
  campaign: ICampaign;
}
