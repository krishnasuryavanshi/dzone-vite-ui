import { FC, useEffect, useState } from 'react';
import {
  IFilterCampaign,
  IFilterClient,
  IFilterLineItem,
  ISelectedIds,
} from '../../lib/types';
import { fetchFilterData } from '../../services';
import { Actions } from './actions';
import { Translate } from '@/components/i18n';
import { Col, Row } from '@/uicomponents/layout/grid';
import {
  IExecutiveFilterDataPayload,
  IFilterDataPayload,
  calculateDateRanges,
  transformFilterDataPayload,
} from '../../lib/utils';
import { FilterActions } from './filter-actions';
import './reporting-filters-manager.scss';
import { TabBasedFilterManager } from './tab-based-filter-manager';
import { executiveUnitType, ReportType, timeFrameType } from '../../lib/enums';

interface IReportingFiltersManagerProps {
  onSubmit: (
    filterData: IFilterDataPayload | IExecutiveFilterDataPayload,
  ) => void;
  activeTab: string;
}

export const ReportingFiltersManager: FC<IReportingFiltersManagerProps> = ({
  onSubmit,
  activeTab,
}) => {
  const [allLineItems, setAllLineItems] = useState<IFilterLineItem[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<IFilterCampaign[]>([]);

  const [reset, setReset] = useState<number>(0);
  const [submit, setSubmit] = useState<number>(0);

  const [isDownloadDisabled, setIsDownloadDisabled] = useState<boolean>(false);

  const [containerSize] = useState({
    xxl: 12,
    lg: 24,
    md: 24,
    sm: 24,
    xs: 24,
  });

  const [allUnits] = useState([
    {
      key: executiveUnitType.Revenue,
      label: 'Revenue',
    },
    {
      key: executiveUnitType.Leads,
      label: <Translate i18nKey='Leads' />,
    },
    {
      key: executiveUnitType.LineItems,
      label: <Translate i18nKey='Line Items' />,
    },
    {
      key: executiveUnitType.Campaigns,
      label: <Translate i18nKey='Campaigns' />,
    },
  ]);

  const [allTimeFrame] = useState([
    {
      key: timeFrameType.MTD,
      label: <Translate i18nKey='MTD vs MTD' />,
    },
    {
      key: timeFrameType.LM,
      label: <Translate i18nKey='Last Month vs Same Month' />,
    },
    {
      key: timeFrameType.QTD,
      label: <Translate i18nKey='QTD vs QTD' />,
    },
    {
      key: timeFrameType.LQ,
      label: <Translate i18nKey='Last Quarter vs Same Quarter' />,
    },
    {
      key: timeFrameType.YTD,
      label: <Translate i18nKey='YTD vs YTD' />,
    },
  ]);

  const [allDurations] = useState([
    {
      key: 'week',
      label: <Translate i18nKey='This Week' />,
    },
    {
      key: 'month',
      label: <Translate i18nKey='This Month' />,
    },
    {
      key: 'quarter',
      label: <Translate i18nKey='This Quarter' />,
    },
    {
      key: 'year',
      label: <Translate i18nKey='This Year' />,
    },
  ]);

  useEffect(() => {
    if (activeTab !== ReportType.Executive) {
      fetchReportingFilterData();
    }
    setIsDownloadDisabled(true);
  }, []);

  const fetchReportingFilterData = async () => {
    const { lineItems, campaigns } = await fetchFilterData();

    setAllLineItems(lineItems);
    setAllCampaigns(campaigns);
  };

  const handleSelection = (data: ISelectedIds) => {
    if (
      data.selectedCampaigns &&
      data.selectedLineItems &&
      data.selectedDuration &&
      data.selectedUnit &&
      data.selectedTimeFrame
    ) {
      const selectedCampaigns = allCampaigns
        .filter((campaign) => data?.selectedCampaigns?.includes(campaign.key))
        .map((campaign) => ({
          campaignId: campaign.key,
        }));
      const selectedLineItems = allLineItems
        .filter((lineItem) => data?.selectedLineItems?.includes(lineItem.key))
        .map((lineItem) => ({
          lineItemId: lineItem.key,
          campaignId: lineItem.campaignId,
        }));

      const range =
        data?.selectedDuration && calculateDateRanges(data.selectedDuration[0]);
      const filterData = transformFilterDataPayload({
        selectedCampaigns,
        selectedLineItems,
      });

      onSubmit({
        campaigns: filterData,
        range,
        unit: data.selectedUnit[0],
        timeframe: data.selectedTimeFrame[0],
      });
    }
  };

  return (
    <Row gutter={[12, 12]} align={'bottom'}>
      <Col {...containerSize} xl={activeTab === ReportType.Executive ? 10 : 16}>
        <TabBasedFilterManager
          activeTab={activeTab}
          allLineItems={allLineItems}
          allCampaigns={allCampaigns}
          allDurations={allDurations}
          allUnits={allUnits}
          allTimeFrame={allTimeFrame}
          handleSelection={handleSelection}
          reset={reset}
          submit={submit}
        />
      </Col>
      <Col {...containerSize} xl={activeTab === ReportType.Executive ? 14 : 8}>
        <Row justify={'space-between'}>
          <Col span={12}>
            <FilterActions
              activeTab={activeTab}
              reset={() => setReset(reset + 1)}
              submit={() => setSubmit(submit + 1)}
            />
          </Col>
          <Col span={12}>
            <Actions
              activeTab={activeTab}
              refresh={() => setSubmit(submit + 1)}
              isDownloadDisabled={isDownloadDisabled}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
