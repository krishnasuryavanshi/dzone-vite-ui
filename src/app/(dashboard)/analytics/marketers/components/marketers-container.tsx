
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { FC, useEffect, useState } from 'react';
import { MarketerFilterDropdowns } from './filter-manager/marketer-filter-dropdowns';
import { Col, Row } from '@/uicomponents/layout/grid';
import { MarketerCard } from './cards/marketer-card';
import { ChartsContainer } from './marketer-charts-container';
import './marketer-container.scss';
import { MarketersGrids } from './marketers-grid/marketers-grid';
import { showNotification } from '@/services/notification';
import { fetchMarketerDashboardData } from '../../supplier/services/fetch-marketer-dashboard-data';
import { fetchMarketerMasterFilterList } from '../../supplier/services/fetch-marketer-master-filter';
import {
  buildCampaignData,
  buildLineItemData,
  buildMarketerData,
  buildSupplierData,
} from '../utils/marketer-filter';
import OutlineBlueButton from '@/app/(dashboard)/components/outline-button/outline-button';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';
import { Skeleton } from '@/uicomponents/layout/skeleton';
import { Button } from '@/uicomponents/button';
interface IMarketerProps {
  data?: string;
}

type marketerMasterFilterList = {
  marketer_code: string;
  marketer_name: string;
  campaign_external_id: string;
  campaign_name: string;
  line_item_external_id: string;
  line_item_name: string;
  supplier_code: string;
  supplier_name: string;
};

export const MarketersContainer: FC<IMarketerProps> = ({ data }) => {
  const reset = 0;
  const submit = 0;
  const activeTab = 'Marketer';
  const MISSED_START_DATE = 'Missed Start date';
  const UNDER_DELIVERING = 'Under-Delivering';
  const allComparison = [
    { key: 'week', label: 'Week to Week' },
    { key: 'month', label: 'Month to Month' },
    { key: 'quarter', label: 'Quarter to Quarter' },
    { key: 'year', label: 'Year to Year' },
  ];
  const filterValues = useFilterDashboardStore(
    (state: FilterState) => state.filterValues,
  );
  const topReason = useFilterDashboardStore(
    (state: FilterState) => state.topReason,
  );
  const compareFactor = useFilterDashboardStore(
    (state: FilterState) => state.compareFactor,
  );
  const setReturnReasonData = useFilterDashboardStore(
    (state: FilterState) => state.setReturnReasonData,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [campaignList, setCompaignList] = useState<any>([]);
  const [supplierList, setSupplierList] = useState<any>([]);
  const [lineItemList, setLineItemList] = useState<any[]>([]);
  const [marketerList, setMarketerList] = useState<any[]>([]);
  const [marketerCode, setMarketerCode] = useState<string[]>([]);
  const [riskCount, setRiskCount] = useState<{
    atRiskToLaunch: number;
    atRiskToDeliver: number;
  }>({ atRiskToLaunch: 0, atRiskToDeliver: 0 });
  const [dashboardData, setDashboardData] = useState<any>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const handleSelection = (data: any) => {
    // Removed console.log to fix lint error
  };

  const setMarketerCodeData = (data: marketerMasterFilterList[]) => {
    let marketerCodes: string[] = [];
    if (data?.length > 0) {
      data.forEach((item: marketerMasterFilterList) => {
        if (!marketerCodes.includes(item.marketer_code)) {
          marketerCodes.push(item.marketer_code);
        }
      });
    }
    setMarketerCode(marketerCodes);
  };

  const getMarketerMasterFilterList = async () => {
    try {
      const data: marketerMasterFilterList[] =
        await fetchMarketerMasterFilterList();
      if (data?.length > 0) {
        setMarketerCodeData(data);
        setMarketerFilterData(data);
        setCampaignFilterData(data);
        setLineItemFilterData(data);
        setSupplierFilterData(data);
      } else {
        setMarketerFilterData([]);
        setCampaignFilterData([]);
        setLineItemFilterData([]);
        setSupplierFilterData([]);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      showNotification({
        message: err.message || 'Failed to fetch Marketer Master Filter List',
        type: 'error',
      });
    }
  };

  const setCampaignFilterData = (data: any) => {
    try {
      // Convert Map values to array
      const campaignData = buildCampaignData(data);
      if (campaignData.length > 0) {
        // Sort by label (supplier_name) for better usability
        campaignData.sort((a, b) => a.label.localeCompare(b.label));
        setCompaignList(campaignData);
      } else {
        setCompaignList([]);
      }
    } catch (error: any) {
      showNotification({
        message: error.message || 'Failed to fetch data',
        type: 'error',
      });
    }
  };

  const setLineItemFilterData = (data: any) => {
    try {
      // Convert Map values to array
      const lineItemsData = buildLineItemData(data);
      if (lineItemsData.length > 0) {
        // Sort by label (supplier_name) for better usability
        lineItemsData.sort((a, b) => a.label.localeCompare(b.label));
        setLineItemList(lineItemsData);
      } else {
        setLineItemList([]);
      }
    } catch (error: any) {
      showNotification({
        message: error.message || 'Failed to fetch data',
        type: 'error',
      });
    }
  };

  const setMarketerFilterData = (data: any) => {
    try {
      // Convert Map values to array
      const marketerData = buildMarketerData(data);
      if (marketerData.length > 0) {
        // Sort by label (marketer_name) for better usability
        marketerData.sort((a, b) => a.label.localeCompare(b.label));
        setMarketerList(marketerData);
      } else {
        setMarketerList([]);
      }
    } catch (error: any) {
      showNotification({
        message: error.message || 'Failed to fetch data',
        type: 'error',
      });
    }
  };

  const setSupplierFilterData = (data: any) => {
    try {
      // Convert Map values to array
      const supplierData = buildSupplierData(data);
      if (supplierData.length > 0) {
        // Sort by label (supplier_name) for better usability
        supplierData.sort((a, b) => a.label.localeCompare(b.label));
        setSupplierList(supplierData);
      } else {
        setSupplierList([]);
      }
    } catch (error: any) {
      showNotification({
        message: error.message || 'Failed to fetch data',
        type: 'error',
      });
    }
  };

  const setPieData = (filtered: any) => {
    let returnReason = [];
    if (filtered) {
      returnReason = filtered?.map((item: any) => {
        return {
          returnReason: item.normalized_return_reason,
          value: item.returned_count,
        };
      });
    }
    setReturnReasonData(returnReason);
  };

  const getMarketerData = async ({ ...props }) => {
    // Simulate an API call to fetch marketer data
    setLoading(true);
    try {
      const data = await fetchMarketerDashboardData({ ...props });
      const marketerDashboardData: any = data;
      if (marketerDashboardData) {
        setDashboardData(marketerDashboardData);
        const tableData = marketerDashboardData?.at_risk?.map((item: any) => {
          let atRiskReason = '';
          if (
            item?.at_risk_reason_to_launch &&
            item?.at_risk_to_deliver &&
            item?.at_risk_to_deliver !== '%'
          ) {
            atRiskReason = `${MISSED_START_DATE}/ ${UNDER_DELIVERING}`;
          } else if (item?.at_risk_reason_to_launch) {
            atRiskReason = MISSED_START_DATE;
          } else if (
            item?.at_risk_to_deliver &&
            item?.at_risk_to_deliver !== '%'
          ) {
            atRiskReason = UNDER_DELIVERING;
          }
          return { ...item, at_risk_reason: atRiskReason };
        });
        setTableData(tableData);
        setFilteredData(tableData);
        setPieData(marketerDashboardData.return_reason_breakdown);
      } else {
        setDashboardData(null);
        setFilteredData(null);
        setPieData(null);
      }
      setLoading(false);
    } catch (error: any) {
      showNotification({
        message: error.message || 'Failed to fetch data',
        type: 'error',
      });
      setLoading(false);
      setDashboardData(null);
      setFilteredData(null);
      setPieData(null);
    }
  };

  const getAtRiskCounts = () => {
    let atRiskToLaunchCount = 0;
    let atRiskToDeliverCount = 0;
    tableData?.forEach((item: any) => {
      if (item?.at_risk_reason_to_launch) {
        atRiskToLaunchCount += 1;
      } else if (item?.at_risk_to_deliver && item.at_risk_to_deliver !== '%') {
        atRiskToDeliverCount += 1;
      }
    });
    setRiskCount({
      atRiskToLaunch: atRiskToLaunchCount,
      atRiskToDeliver: atRiskToDeliverCount,
    });
  };
  const filterTableDataByAtRisk = (type: string) => {
    if (type === 'atRiskToLaunch') {
      const atRiskFilteredData = tableData?.filter((item: any) => {
        return item?.at_risk_reason_to_launch;
      });
      setFilteredData(atRiskFilteredData);
    } else if (type === 'atRiskToDeliver') {
      const atRiskFilteredData = tableData?.filter((item: any) => {
        return item?.at_risk_to_deliver && !item?.at_risk_reason_to_launch;
      });
      setFilteredData(atRiskFilteredData);
    }
  };

  const handleReset = () => {
    setFilteredData(tableData);
  };

  useEffect(() => {
    if (
      !filterValues?.dateRange?.startDate &&
      !filterValues?.dateRange?.endDate &&
      filterValues?.selectedCompaigns?.length === 0 &&
      filterValues?.selectedSuppliers?.length === 0 &&
      filterValues?.selectedMarketers?.length === 0 &&
      filterValues?.selectedLineItems?.length === 0
    ) {
      setPieData(dashboardData?.return_reason_breakdown);
      setFilteredData(tableData);
      return;
    }

    if (filterValues?.reset) {
      setPieData(dashboardData.return_reason_breakdown);
      setFilteredData(tableData);
    }
  }, [filterValues]);
  // Date range filter
  useEffect(() => {
    if (
      filterValues?.dateRange?.startDate &&
      filterValues?.dateRange?.endDate &&
      marketerCode.length > 0
    ) {
      getMarketerData({
        startDate: filterValues?.dateRange?.startDate,
        endDate: filterValues?.dateRange?.endDate,
        campaignList: filterValues?.selectedCompaigns,
        supplierList: filterValues?.selectedSuppliers,
        lineItemList: filterValues?.selectedLineItems,
        tenantCodes: filterValues?.selectedMarketers?.length
          ? filterValues?.selectedMarketers
          : marketerCode,
      });
    }
  }, [
    filterValues?.dateRange,
    filterValues?.selectedSuppliers,
    filterValues?.selectedCompaigns,
    filterValues?.selectedMarketers,
    filterValues?.selectedLineItems,
  ]);

  useEffect(() => {
    if (topReason) {
      setPieData(filteredData);
    }
  }, [topReason]);

  useEffect(() => {
    getAtRiskCounts();
  }, [tableData]);

  useEffect(() => {
    if (marketerCode?.length > 0) {
      getMarketerData({
        startDate: filterValues?.dateRange?.startDate,
        endDate: filterValues?.dateRange?.endDate,
        campaignList: filterValues?.selectedCompaigns,
        supplierList: filterValues?.selectedSuppliers,
        lineItemList: filterValues?.selectedLineItems,
        tenantCodes: filterValues?.selectedMarketers?.length
          ? filterValues?.selectedMarketers
          : marketerCode,
      });
    }
  }, [marketerCode]);

  useEffect(() => {
    getMarketerMasterFilterList();
  }, []);

  return (
    <DzBox className='dz-page-content dashboard-container'>
      <DzScrollContainer vertical>
        <DzScrollContainer.Sticky>
          <MarketerFilterDropdowns
            reset={reset}
            submit={submit}
            handleSelection={handleSelection}
            allCampaign={campaignList}
            allSuppliers={supplierList}
            allLineItem={lineItemList}
            allMarketers={marketerList}
            allTimeFrame={[]}
            allComparison={allComparison}
            activeTab={activeTab}
            onRefresh={(filters) => {
              getMarketerData({
                startDate: filters?.dateRange?.startDate,
                endDate: filters?.dateRange?.endDate,
                campaignList: filters?.selectedCompaigns,
                supplierList: filters?.selectedSuppliers,
                lineItemList: filters?.selectedLineItems,
                marketerList: filters?.selectedMarketers,
                tenantCodes:
                  filters?.selectedMarketers?.length > 0
                    ? filters?.selectedMarketers
                    : marketerList.map((item: any) => item.key),
              });
            }}
          />
        </DzScrollContainer.Sticky>
        <DzScrollContainer.Scroll>
          <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
            <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
              <Col span={12}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <MarketerCard
                      title='Lead Goal'
                      subTitle=' '
                      current={{
                        name: 'Current',
                        value: `${dashboardData?.lead_goal_total?.toLocaleString() || ''}`,
                      }}
                      percent=''
                      isPositive={true}
                      waitingToGoLiveData={{
                        name: 'Waiting to Go Live',
                        value: 'N/A',
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <MarketerCard
                      title='Leads Delivered'
                      subTitle=' '
                      current={{
                        name: 'Current',
                        value: `${dashboardData?.leads_received?.toLocaleString() || ''}`,
                      }}
                      percent={
                        dashboardData?.[
                          `leads_received_pct_change_${compareFactor}`
                        ]
                      }
                      isPositive={
                        dashboardData?.[
                          `leads_received_pct_change_${compareFactor}`
                        ] > 0
                      }
                      waitingToGoLiveData={{
                        name: 'Waiting to Go Live',
                        value: '5',
                      }}
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                  <Col span={12}>
                    <MarketerCard
                      title='Leads Returned'
                      subTitle=' '
                      current={{
                        name: 'Current',
                        value: `${dashboardData?.leads_returned?.toLocaleString() || ''}`,
                      }}
                      // previous={{ name: 'Previous', value: '$40' }}
                      percent={
                        dashboardData?.[
                          `leads_returned_pct_change_${compareFactor}`
                        ]
                      }
                      isPositive={
                        dashboardData?.[
                          `leads_returned_pct_change_${compareFactor}`
                        ] > 0
                      }
                      waitingToGoLiveData={{
                        name: 'Waiting to Go Live',
                        value: '3',
                      }}
                    />
                  </Col>
                  <Col span={12}>
                    <MarketerCard
                      title='Leads Remaining'
                      subTitle=' '
                      current={{
                        name: 'Current',
                        value: `${dashboardData?.leads_pending?.toLocaleString() || ''}`,
                      }}
                      percent={
                        dashboardData?.[
                          `leads_pending_pct_change_${compareFactor}`
                        ]
                      }
                      isPositive={
                        dashboardData?.[
                          `leads_pending_pct_change_${compareFactor}`
                        ] > 0
                      }
                      waitingToGoLiveData={{
                        name: 'Waiting to Go Live',
                        value: 'N/A',
                      }}
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
                  <Col span={12}>
                    <MarketerCard
                      title='Budget (Total)'
                      subTitle=' '
                      current={{
                        name: 'Current',
                        value: `${dashboardData?.budget_total?.toLocaleString() || ''}`,
                      }}
                      percent={
                        dashboardData?.[
                          `budget_total_pct_change_${compareFactor}`
                        ]
                      }
                      isPositive={
                        dashboardData?.[
                          `budget_total_pct_change_${compareFactor}`
                        ] > 0
                      }
                      waitingToGoLiveData={{
                        name: 'Waiting to Go Live',
                        value: 'N/A',
                      }}
                      isCurrencyMetric={true}
                    />
                  </Col>
                  <Col span={12}>
                    <MarketerCard
                      title='Spent (Actual)'
                      subTitle=' '
                      current={{
                        name: 'Current',
                        value: `${dashboardData?.spent_actual?.toLocaleString() || ''}`,
                      }}
                      percent=''
                      isPositive={true}
                      waitingToGoLiveData={{
                        name: 'Waiting to Go Live',
                        value: '5',
                      }}
                      isCurrencyMetric={true}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                {/* <DzBox> */}
                <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
                  <ChartsContainer />
                </Skeleton>
                {/* </DzBox> */}
              </Col>
            </Row>
          </Skeleton>
          <DzBox style={{ marginTop: '1rem' }}>
            <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
              <div className='button-container'>
                <Button
                  danger
                  onClick={() => filterTableDataByAtRisk('atRiskToLaunch')}
                  style={{
                    backgroundColor: '#FF080C',
                    color: '#fff',
                    textAlign: 'left',
                    height: '46px',
                  }}>
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>
                    At Risk to Launch
                  </span>
                  <p
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      paddingLeft: '10px',
                      marginBottom: 0,
                      marginTop: '-8px',
                    }}>
                    {riskCount.atRiskToLaunch}
                  </p>
                </Button>
                <Button
                  className='btn-warning'
                  style={{
                    backgroundColor: '#FF8419',
                    color: '#fff',
                    textAlign: 'left',
                    height: '46px',
                  }}
                  onClick={() => filterTableDataByAtRisk('atRiskToDeliver')}>
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>
                    At Risk to Deliver
                  </span>
                  <p
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      paddingLeft: '10px',
                      marginBottom: 0,
                      marginTop: '-8px',
                    }}>
                    {riskCount.atRiskToDeliver}
                  </p>
                </Button>
                <OutlineBlueButton onClick={handleReset}>
                  Reset
                </OutlineBlueButton>
              </div>
              <MarketersGrids data={filteredData ?? []} />
            </Skeleton>
          </DzBox>
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
    </DzBox>
  );
};
