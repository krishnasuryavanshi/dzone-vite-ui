
import { DzBox, DzScrollContainer } from '@/components/layout/v1';
import { FC, useEffect, useState } from 'react';
import { SupplierFilterDropdowns } from './filter-manager/supplier-filter-dropdowns';
import { SupplierCard } from './cards/supplier-card';
import { Col, Row } from '@/uicomponents/layout/grid';
import { ChartsContainer } from './supplier-charts-container';
import { SupplierCardSparkline } from './cards/supplier-card-sparkline';
import './suppliers-container.scss';
import { SupplierGrids } from './supplier-grid/supplier-grid';
import { showNotification } from '@/services/notification';
import { supplierDashboardDataResponse } from '../types/supplier-dashboard';
import { fetchSupplierDashboardData } from '../services/fetch-supplier-dashboard-data';
import { fetchSupplierMasterFilterList } from '../services/fetch-supplier-master-filter';
import OutlineBlueButton from '@/app/(dashboard)/components/outline-button/outline-button';
import {
  buildMarketerData,
  buildCampaignData,
  buildLineItemData,
} from '../utils/supplier-filter';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';
import { Skeleton } from '@/uicomponents/layout/skeleton';
import { Button } from '@/uicomponents/button';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<any>();
  const [filteredData, setFilteredData] = useState<any>(null);
  const [riskCount, setRiskCount] = useState<{
    atRiskToReason: number;
  }>({ atRiskToReason: 0 });
  const filterValues = useFilterDashboardStore(
    (state: FilterState) => state.filterValues,
  );
  const compareFactor = useFilterDashboardStore(
    (state: FilterState) => state.compareFactor,
  );
  const setSupplierBarData = useFilterDashboardStore(
    (state: FilterState) => state.setSupplierBarData,
  );
  const setSupplierPieData = useFilterDashboardStore(
    (state: FilterState) => state.setSupplierPieData,
  );
  const setTopReason = useFilterDashboardStore(
    (state: FilterState) => state.setTopReason,
  );
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
  // Use riskLineItemList as the initial data for the table
  const [lineItemList, setLineItemList] = useState<any>([]);
  const [marketerList, setMarketerList] = useState<any>([]);
  const [campaignList, setCompaignList] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
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

  // Get the master supplier filter list
  const getMasterSupplierFilterList = async () => {
    try {
      const data: supplierMasterFilterList[] =
        await fetchSupplierMasterFilterList();
      if (data?.length > 0) {
        setLineItemFilterData(data);
        setMarketerFilterData(data);
        setCampaignFilterData(data);
      } else {
        setLineItemFilterData([]);
        setMarketerFilterData([]);
        setCampaignFilterData([]);
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

  // Get Supplier dashboard data
  const getSupplierData = async ({ ...props }) => {
    // Simulate an API call to fetch marketer data
    setLoading(true);
    try {
      const data = await fetchSupplierDashboardData({ ...props });
      const dashboardData: supplierDashboardDataResponse = data;
      if (dashboardData) {
        setDashboardData(dashboardData);
        setTableData(dashboardData.at_risk);
        setFilteredData(dashboardData.at_risk);
        setPieData(dashboardData.validation_breakdown.validation_data);
        setTopReasonData(
          dashboardData.validation_breakdown.top_invalid_reasons,
        );
        setBarData(dashboardData.return_reasons_breakdown);
      } else {
        setDashboardData(null);
        setFilteredData(null);
        setPieData(null);
        setTopReasonData(null);
        setBarData(null);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      showNotification({
        message: err.message || 'Failed to fetch data',
        type: 'error',
      });
      setDashboardData(null);
      setFilteredData(null);
      setPieData(null);
      setTopReasonData(null);
      setBarData(null);
    }
  };

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
  const filterTableDataByAtRisk = () => {
    const atRiskFilteredData = tableData?.filter((item: any) => {
      return item?.at_risk_reason;
    });
    setFilteredData(atRiskFilteredData);
  };
  const handleReset = () => {
    setFilteredData(tableData);
  };

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

  // Date range filter
  useEffect(() => {
    getSupplierData({
      startDate: filterValues?.dateRange?.startDate,
      endDate: filterValues?.dateRange?.endDate,
      listItemList: filterValues?.selectedLineItems,
      marketerList: filterValues?.selectedMarketers,
      campaignList: filterValues?.selectedCompaigns,
    });
  }, [
    filterValues?.dateRange,
    filterValues?.selectedMarketers,
    filterValues?.selectedLineItems,
    filterValues?.selectedCompaigns,
    filterValues?.reset,
  ]);

  useEffect(() => {
    getAtRiskCounts();
  }, [tableData]);

  useEffect(() => {
    getMasterSupplierFilterList();
  }, []);
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
              getSupplierData({
                startDate: filters?.dateRange?.startDate,
                endDate: filters?.dateRange?.endDate,
                listItemList: filters?.selectedLineItems,
                marketerList: filters?.selectedMarketers,
                campaignList: filters?.selectedCompaigns,
              });
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
                  percent={
                    dashboardData?.[
                      `lead_goal_assigned_pct_change_${compareFactor}`
                    ]
                  }
                  isPositive={
                    dashboardData?.[
                      `lead_goal_assigned_pct_change_${compareFactor}`
                    ] > 0
                  }
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
                  percent={
                    dashboardData?.[
                      `leads_uploaded_pct_change_${compareFactor}`
                    ]
                  }
                  isPositive={
                    dashboardData?.[
                      `leads_uploaded_pct_change_${compareFactor}`
                    ] > 0
                  }
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
                  percent={
                    dashboardData?.[
                      `leads_published_pct_change_${compareFactor}`
                    ]
                  }
                  isPositive={
                    dashboardData?.[
                      `leads_published_pct_change_${compareFactor}`
                    ] > 0
                  }
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
                  percent={
                    dashboardData?.[
                      `estimated_earnings_pct_change_${compareFactor}`
                    ]
                  }
                  isPositive={
                    dashboardData?.[
                      `estimated_earnings_pct_change_${compareFactor}`
                    ] > 0
                  }
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
                  percent={
                    dashboardData?.[`return_rate_pct_change_${compareFactor}`]
                  }
                  isPositive={
                    dashboardData?.[`return_rate_pct_change_${compareFactor}`] >
                    0
                  }
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
                  onClick={filterTableDataByAtRisk}>
                  <span style={{ fontSize: '10px', fontWeight: 600 }}>
                    At Risk Reason
                  </span>
                  <p
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      paddingLeft: '10px',
                      marginBottom: 0,
                      marginTop: '-8px',
                    }}>
                    {riskCount.atRiskToReason}
                  </p>
                </Button>
                <OutlineBlueButton onClick={handleReset}>
                  Reset
                </OutlineBlueButton>
              </div>
              <SupplierGrids supplierDashboardData={filteredData ?? []} />
            </Skeleton>
          </DzBox>
        </DzScrollContainer.Scroll>
      </DzScrollContainer>
    </DzBox>
  );
};
