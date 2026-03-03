
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { FC, useEffect, useMemo, useState } from 'react';
import { MarketerFilterDropdowns } from './filter-manager/marketer-filter-dropdowns';
import { Col, Row } from '@/uicomponents/layout/grid';
import { MarketerCard } from './cards/marketer-card';
import { ChartsContainer } from './marketer-charts-container';
import './marketer-container.scss';
import { MarketersGrids } from './marketers-grid/marketers-grid';
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
import { useMarketerMasterFilterQuery, useMarketerDashboardQuery } from '../hooks';

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
  const [filteredData, setFilteredData] = useState<any>(null);
  const [riskCount, setRiskCount] = useState<{
    atRiskToLaunch: number;
    atRiskToDeliver: number;
  }>({ atRiskToLaunch: 0, atRiskToDeliver: 0 });

  const handleSelection = (data: any) => {
    // Removed console.log to fix lint error
  };

  // Master filter query
  const { data: masterFilterData } = useMarketerMasterFilterQuery();

  const marketerCode = useMemo(() => {
    if (!masterFilterData?.length) return [];
    const codes: string[] = [];
    masterFilterData.forEach((item: marketerMasterFilterList) => {
      if (!codes.includes(item.marketer_code)) {
        codes.push(item.marketer_code);
      }
    });
    return codes;
  }, [masterFilterData]);

  const marketerList = useMemo(() => {
    if (!masterFilterData?.length) return [];
    const items = buildMarketerData(masterFilterData);
    items.sort((a, b) => a.label.localeCompare(b.label));
    return items;
  }, [masterFilterData]);

  const campaignList = useMemo(() => {
    if (!masterFilterData?.length) return [];
    const items = buildCampaignData(masterFilterData);
    items.sort((a, b) => a.label.localeCompare(b.label));
    return items;
  }, [masterFilterData]);

  const lineItemList = useMemo(() => {
    if (!masterFilterData?.length) return [];
    const items = buildLineItemData(masterFilterData);
    items.sort((a, b) => a.label.localeCompare(b.label));
    return items;
  }, [masterFilterData]);

  const supplierList = useMemo(() => {
    if (!masterFilterData?.length) return [];
    const items = buildSupplierData(masterFilterData);
    items.sort((a, b) => a.label.localeCompare(b.label));
    return items;
  }, [masterFilterData]);

  // Dashboard data query
  const dashboardParams = useMemo(
    () => ({
      startDate: filterValues?.dateRange?.startDate,
      endDate: filterValues?.dateRange?.endDate,
      campaignList: filterValues?.selectedCompaigns,
      supplierList: filterValues?.selectedSuppliers,
      lineItemList: filterValues?.selectedLineItems,
      tenantCodes: filterValues?.selectedMarketers?.length
        ? filterValues?.selectedMarketers
        : marketerCode,
    }),
    [
      filterValues?.dateRange,
      filterValues?.selectedSuppliers,
      filterValues?.selectedCompaigns,
      filterValues?.selectedMarketers,
      filterValues?.selectedLineItems,
      marketerCode,
    ],
  );

  const hasMarketerCodes = marketerCode.length > 0;
  const { data: dashboardData, isLoading: loading } =
    useMarketerDashboardQuery(dashboardParams, hasMarketerCodes);

  const tableData = useMemo(() => {
    if (!dashboardData?.at_risk) return [];
    return dashboardData.at_risk.map((item: any) => {
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
  }, [dashboardData]);

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

  // Sync chart data when dashboard data arrives
  useEffect(() => {
    if (dashboardData) {
      setFilteredData(tableData);
      setPieData(dashboardData.return_reason_breakdown);
    } else if (dashboardData === null) {
      setFilteredData(null);
      setPieData(null);
    }
  }, [dashboardData, tableData]);

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
      setPieData(dashboardData?.return_reason_breakdown);
      setFilteredData(tableData);
    }
  }, [filterValues]);

  useEffect(() => {
    if (topReason) {
      setPieData(filteredData);
    }
  }, [topReason]);

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

  useEffect(() => {
    getAtRiskCounts();
  }, [tableData]);

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
              // Query will auto-refetch when filter values in the store change
              // This callback is kept for compatibility with the filter dropdown component
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
