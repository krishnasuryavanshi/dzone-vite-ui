import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { FC, useEffect, useMemo, useState } from 'react';
import { SupplierFilterDropdowns } from './filter-manager/supplier-filter-dropdowns';
import { SupplierCard } from './cards/supplier-card';
import { Col, Row } from '@/uicomponents/layout/grid';
import { ChartsContainer } from './supplier-charts-container';
import { SupplierCardSparkline } from './cards/supplier-card-sparkline';
import './suppliers-container.scss';
import { SupplierGrids } from './supplier-grid/supplier-grid';
import { supplierDashboardDataResponse } from '../types/supplier-dashboard';
import OutlineBlueButton from '@/app/(dashboard)/components/outline-button/outline-button';
import { buildMarketerData, buildCampaignData, buildLineItemData } from '../utils/supplier-filter';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';
import { Skeleton } from '@/uicomponents/layout/skeleton';
import { Button } from '@/uicomponents/button';
import { useSupplierMasterFilterQuery, useSupplierDashboardQuery } from '../hooks';

interface ISupplierProps {
  data?: string;
}
type filterList = {
  key: string;
  label: string;
  id?: string;
};

type supplierMasterFilterList = {
  marketer_code: string;
  marketer_name: string;
  campaign_external_id: string;
  campaign_name: string;
  line_item_external_id: string;
  line_item_name: string;
};

export const SuppliersContainer: FC<ISupplierProps> = ({ data }) => {
  const reset = 0;
  const submit = 0;
  const [filteredData, setFilteredData] = useState<any>(null);
  const [riskCount, setRiskCount] = useState<{
    atRiskToReason: number;
  }>({ atRiskToReason: 0 });
  const filterValues = useFilterDashboardStore((state: FilterState) => state.filterValues);
  const compareFactor = useFilterDashboardStore((state: FilterState) => state.compareFactor);
  const setSupplierBarData = useFilterDashboardStore(
    (state: FilterState) => state.setSupplierBarData,
  );
  const setSupplierPieData = useFilterDashboardStore(
    (state: FilterState) => state.setSupplierPieData,
  );
  const setTopReason = useFilterDashboardStore((state: FilterState) => state.setTopReason);
  const activeTab = 'Supplier';
  const allComparison = [
    { key: 'week', label: 'Week to Week' },
    { key: 'month', label: 'Month to Month' },
    { key: 'quarter', label: 'Quarter to Quarter' },
    { key: 'year', label: 'Year to Year' },
  ];
  const handleSelection = (data: any) => {
    // Removed console.log to fix lint error
  };

  // Master filter query
  const { data: masterFilterData } = useSupplierMasterFilterQuery();

  const lineItemList = useMemo(() => {
    if (!masterFilterData?.length) return [];
    const items = buildLineItemData(masterFilterData);
    items.sort((a, b) => a.label.localeCompare(b.label));
    return items;
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

  // Dashboard data query
  const dashboardParams = useMemo(
    () => ({
      startDate: filterValues?.dateRange?.startDate,
      endDate: filterValues?.dateRange?.endDate,
      listItemList: filterValues?.selectedLineItems,
      marketerList: filterValues?.selectedMarketers,
      campaignList: filterValues?.selectedCompaigns,
    }),
    [
      filterValues?.dateRange,
      filterValues?.selectedMarketers,
      filterValues?.selectedLineItems,
      filterValues?.selectedCompaigns,
      filterValues?.reset,
    ],
  );

  const { data: dashboardData, isLoading: loading } = useSupplierDashboardQuery(dashboardParams);

  const tableData = useMemo(
    () => (dashboardData as supplierDashboardDataResponse)?.at_risk ?? [],
    [dashboardData],
  );

  // set Pie chart data
  const setPieData = (filtered: any) => {
    let returnReason = [];
    if (filtered) {
      returnReason = filtered.map((item: any) => {
        return {
          leadState: item.lead_state,
          value: item.count,
        };
      });
    }
    setSupplierPieData(returnReason);
  };
  // set top reason data
  const setTopReasonData = (filtered: any) => {
    let topReason = [];
    if (filtered) {
      topReason = filtered.map((item: any) => {
        return item.invalid_reason;
      });
    }
    setTopReason(topReason);
  };
  // set the bar chart data
  const setBarData = (filtered: any) => {
    let validationReason = [];
    if (filtered) {
      validationReason = filtered?.map((item: any) => {
        return {
          returnReason: item.normalized_return_reason,
          value: item.returned_count,
        };
      });
    }
    setSupplierBarData(validationReason);
  };

  // Sync chart data when dashboard data arrives
  useEffect(() => {
    if (dashboardData) {
      const typedData = dashboardData as supplierDashboardDataResponse;
      setFilteredData(typedData.at_risk);
      setPieData(typedData.validation_breakdown?.validation_data);
      setTopReasonData(typedData.validation_breakdown?.top_invalid_reasons);
      setBarData(typedData.return_reasons_breakdown);
    } else if (dashboardData === null) {
      setFilteredData(null);
      setPieData(null);
      setTopReasonData(null);
      setBarData(null);
    }
  }, [dashboardData]);

  useEffect(() => {
    if (
      !filterValues?.dateRange?.startDate &&
      !filterValues?.dateRange?.endDate &&
      filterValues?.selectedLineItems?.length === 0 &&
      filterValues?.selectedMarketers?.length === 0 &&
      filterValues?.selectedCompaigns?.length === 0
    ) {
      setPieData(filteredData?.validation_breakdown?.validation_data);
      setTopReasonData(filteredData?.validation_breakdown?.top_invalid_reasons);
      setBarData(filteredData?.return_reasons_breakdown);
      setFilteredData(tableData);
      return;
    }
  }, [filterValues]);

  const getAtRiskCounts = () => {
    let atRiskToReasonCount = 0;
    tableData?.forEach((item: any) => {
      if (item?.at_risk_reason) {
        atRiskToReasonCount += 1;
      }
    });
    setRiskCount({
      atRiskToReason: atRiskToReasonCount,
    });
  };

  useEffect(() => {
    getAtRiskCounts();
  }, [tableData]);

  const filterTableDataByAtRisk = () => {
    const atRiskFilteredData = tableData?.filter((item: any) => {
      return item?.at_risk_reason;
    });
    setFilteredData(atRiskFilteredData);
  };
  const handleReset = () => {
    setFilteredData(tableData);
  };

  return (
    <DzBox className='dz-page-content dashboard-container'>
      <DzScrollContainer vertical>
        <DzScrollContainer.Sticky>
          <SupplierFilterDropdowns
            reset={reset}
            submit={submit}
            handleSelection={handleSelection}
            allLineItem={lineItemList}
            allMarketers={marketerList}
            allCampaign={campaignList}
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
            <Row gutter={[12, 12]} align='bottom' style={{ marginTop: 12 }}>
              <Col flex='1'>
                <SupplierCard
                  title='Lead Goal Assigned'
                  subTitle=' '
                  current={{
                    name: 'Current',
                    value: `${dashboardData?.lead_goal_assigned?.toLocaleString() || ''}`,
                  }}
                  percent={dashboardData?.[`lead_goal_assigned_pct_change_${compareFactor}`]}
                  isPositive={dashboardData?.[`lead_goal_assigned_pct_change_${compareFactor}`] > 0}
                  waitingToGoLiveData={{
                    name: 'Waiting to Go Live',
                    value: 'N/A',
                  }}
                />
              </Col>
              <Col flex='1'>
                <SupplierCard
                  title='Leads Uploaded'
                  subTitle=' '
                  current={{
                    name: 'Current',
                    value: `${dashboardData?.leads_uploaded?.toLocaleString() || ''}`,
                  }}
                  percent={dashboardData?.[`leads_uploaded_pct_change_${compareFactor}`]}
                  isPositive={dashboardData?.[`leads_uploaded_pct_change_${compareFactor}`] > 0}
                  waitingToGoLiveData={{
                    name: 'Waiting to Go Live',
                    value: '5',
                  }}
                />
              </Col>
              <Col flex='1'>
                <SupplierCard
                  title='Leads Published'
                  subTitle=' '
                  current={{
                    name: 'Current',
                    value: `${dashboardData?.leads_published?.toLocaleString() || ''}`,
                  }}
                  percent={dashboardData?.[`leads_published_pct_change_${compareFactor}`]}
                  isPositive={dashboardData?.[`leads_published_pct_change_${compareFactor}`] > 0}
                  waitingToGoLiveData={{
                    name: 'Waiting to Go Live',
                    value: '5',
                  }}
                />
              </Col>

              <Col flex='1'>
                <SupplierCard
                  title='Leads Returned'
                  subTitle=' '
                  current={{
                    name: 'Current',
                    value: `${dashboardData?.leads_returned?.toLocaleString() || ''}`,
                  }}
                  percent={dashboardData?.[`leads_returned_pct_change_${compareFactor}`]}
                  isPositive={dashboardData?.[`leads_returned_pct_change_${compareFactor}`] > 0}
                  waitingToGoLiveData={{
                    name: 'Waiting to Go Live',
                    value: '3',
                  }}
                />
              </Col>
            </Row>
            <Row gutter={[12, 12]} align='bottom' style={{ marginTop: 12 }}>
              <Col span={8}>
                <SupplierCard
                  title='Leads Pending'
                  subTitle=' '
                  current={{
                    name: 'Current',
                    value: `${dashboardData?.leads_pending?.toLocaleString() || ''}`,
                  }}
                  percent=''
                  isPositive={false}
                  waitingToGoLiveData={{
                    name: 'Waiting to Go Live',
                    value: 'N/A',
                  }}
                />
              </Col>
              <Col span={8}>
                <SupplierCardSparkline
                  id='estimatedEarnings'
                  title='Estimated Earnings'
                  subTitle=' '
                  current={{
                    name: 'Current',
                    value: `${dashboardData?.estimated_earnings?.toLocaleString() || ''}`,
                  }}
                  percent={dashboardData?.[`estimated_earnings_pct_change_${compareFactor}`]}
                  isPositive={dashboardData?.[`estimated_earnings_pct_change_${compareFactor}`] > 0}
                  waitingToGoLiveData={{
                    name: 'Waiting to Go Live',
                    value: 'N/A',
                  }}
                  isCurrencyMetric={true}
                />
              </Col>

              <Col span={8}>
                <SupplierCardSparkline
                  id='returnRate'
                  title='Return Rate %'
                  subTitle=' '
                  current={{
                    name: 'Current',
                    value: `${dashboardData?.return_rate_pct ? dashboardData?.return_rate_pct + '%' : ''}`,
                  }}
                  percent={dashboardData?.[`return_rate_pct_change_${compareFactor}`]}
                  isPositive={dashboardData?.[`return_rate_pct_change_${compareFactor}`] > 0}
                  waitingToGoLiveData={{
                    name: 'Waiting to Go Live',
                    value: '5',
                  }}
                />
              </Col>
            </Row>
          </Skeleton>
          <DzBox style={{ marginTop: '1rem' }}>
            <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
              <ChartsContainer />
            </Skeleton>
          </DzBox>
          <DzBox style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <Skeleton loading={loading} active paragraph={{ rows: 6 }}>
              <div className='button-container'>
                <Button
                  danger
                  style={{
                    backgroundColor: '#FF080C',
                    color: '#fff',
                    textAlign: 'left',
                    height: '46px',
                  }}
                  onClick={filterTableDataByAtRisk}
                >
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>At Risk Reason</span>
                  <p
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      paddingLeft: '10px',
                      marginBottom: 0,
                      marginTop: '-8px',
                    }}
                  >
                    {riskCount.atRiskToReason}
                  </p>
                </Button>
                <OutlineBlueButton onClick={handleReset}>Reset</OutlineBlueButton>
              </div>
              <SupplierGrids supplierDashboardData={filteredData ?? []} />
            </Skeleton>
          </DzBox>
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
    </DzBox>
  );
};
