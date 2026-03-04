import React, { FC, ReactNode, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { IUseFilterDropdowns, useFilterDropdowns } from '@/app/(dashboard)/dashboard/lib/hooks';
import { SyncOutlined } from '@/uicomponents/icons';
import { DateRangeDropdown } from './dateRange-dropdown';
import { LineItemsDropdown } from './lineItems-dropdown';
import { MarketersItemsDropdown } from './marketer-dropdown-supplier';
import { ComparisonDropdown } from '../../../marketers/components/filter-manager/comparison-dropdown';
import OutlineBlueButton from '@/app/(dashboard)/components/outline-button/outline-button';
import { CampaignItemsDropdown } from '../../../marketers/components/filter-manager/campaign-dropdown';
import { CampaignFilter, LineItemFilter, MarketerFilter } from '../../utils/supplier-filter';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';
import { TimeRangePickerProps } from '@/lib/types/uicomponents';
import { Col, Row } from '@/uicomponents/layout/grid';
import { Tooltip } from '@/uicomponents/tooltip';

interface ISupplierFilterDropdown extends IUseFilterDropdowns {
  submit: number;
  reset: number;
  allLineItem?: LineItemFilter[];
  allTimeFrame?: { key: string; label: ReactNode }[];
  allMarketers?: MarketerFilter[];
  allComparison?: { key: string; label: ReactNode }[];
  allCampaign?: CampaignFilter[];
  onRefresh?: (filters: any) => void;
}

export const SupplierFilterDropdowns: FC<ISupplierFilterDropdown> = ({
  submit,
  reset,
  allLineItem,
  allTimeFrame,
  allMarketers,
  allCampaign,
  allComparison,
  activeTab,
  handleSelection,
  onRefresh,
}) => {
  const { selectedUnit, handleSelectionChange } = useFilterDropdowns({
    submit,
    reset,
    handleSelection,
    activeTab,
  });
  const [filteredMarketers, setFilteredMarketers] = useState<MarketerFilter[]>([]);
  const [filteredLineItems, setFilteredLineItems] = useState<LineItemFilter[]>([]);
  const [filteredCampaign, setFilteredCampaign] = useState<CampaignFilter[]>([]);

  // Update filtered values when props change
  useEffect(() => {
    setFilteredMarketers(allMarketers || []);
  }, [allMarketers]);

  useEffect(() => {
    setFilteredLineItems(allLineItem || []);
  }, [allLineItem]);

  useEffect(() => {
    setFilteredCampaign(allCampaign || []);
  }, [allCampaign]);

  const filterValues = useFilterDashboardStore((state: FilterState) => state.filterValues);
  const setFilterValues = useFilterDashboardStore((state: FilterState) => state.setFilterValues);
  const setCompareFactor = useFilterDashboardStore((state: FilterState) => state.setCompareFactor);
  const ranges: TimeRangePickerProps['presets'] = [
    { label: 'Today', value: [dayjs(), dayjs()] },
    { label: 'Last 7 Days', value: [dayjs().subtract(6, 'day'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().subtract(29, 'day'), dayjs()] },
  ];

  const handleDateChange = (data: any) => {
    if (data.selectedItems.length === 0) {
      setFilterValues({
        ...filterValues,
        dateRange: { startDate: '', endDate: '' },
      });
      return;
    }
    setFilterValues({
      ...filterValues,
      dateRange: {
        startDate: data.selectedItems[0],
        endDate: data.selectedItems[1],
      },
      reset: false,
    });
  };

  const handleCampaignChange = (data: any) => {
    let compaignsArray: any = [];
    data.selectedItems.forEach((element: any) => {
      compaignsArray.push(element);
    });
    let marketerFilter: any = [];
    let lineItemFilter: any = [];
    // Filter suppliers based on selected campaign items
    if (compaignsArray.length > 0 && allLineItem) {
      compaignsArray.forEach((item: any) => {
        allCampaign?.forEach((campaign) => {
          if (item === campaign.key) {
            campaign.line_items.forEach((c) => {
              allLineItem?.forEach((cam) => {
                if (c.line_item_external_id === cam.key) {
                  lineItemFilter.push(cam);
                }
              });
            });
            campaign.marketers.forEach((c) => {
              allMarketers?.forEach((cam) => {
                if (c.marketer_code === cam.key) {
                  marketerFilter.push(cam);
                }
              });
            });
          }
        });
      });
      setFilteredLineItems(lineItemFilter);
      setFilteredMarketers(marketerFilter);
    } else {
      setFilteredLineItems(allLineItem || []);
      setFilteredMarketers(allMarketers || []);
    }

    setFilterValues({
      ...filterValues,
      selectedCompaigns: compaignsArray,
      reset: false,
    });
  };

  const handleLineItem = (data: any) => {
    let lineItemsArray: any = [];
    data?.selectedItems.forEach((element: any) => {
      lineItemsArray.push(element);
    });
    let campaignFilter: any = [];
    let marketerFilter: any = [];
    // Filter marketers based on selected line items
    if (lineItemsArray.length > 0) {
      lineItemsArray.forEach((item: any) => {
        allLineItem?.forEach((lineItem) => {
          if (item === lineItem.key) {
            lineItem.campaigns.forEach((c) => {
              allCampaign?.forEach((cam) => {
                if (c.campaign_external_id === cam.key) {
                  campaignFilter.push(cam);
                }
              });
            });
            lineItem.marketers.forEach((c) => {
              allMarketers?.forEach((cam) => {
                if (c.marketer_code === cam.key) {
                  marketerFilter.push(cam);
                }
              });
            });
          }
        });
      });
      setFilteredMarketers(marketerFilter);
      setFilteredCampaign(campaignFilter);
    } else {
      // If no line items selected, show all marketers
      setFilteredMarketers(allMarketers || []);
      setFilteredCampaign(allCampaign || []);
    }

    setFilterValues({
      ...filterValues,
      selectedLineItems: lineItemsArray,
      reset: false,
    });
  };

  const handleMarketerChange = (data: any) => {
    let marketerArray: any = [];
    data?.selectedItems.forEach((element: any) => {
      marketerArray.push(element);
    });
    let campaignFilter: any = [];
    let lineItemFilter: any = [];
    // Filter marketers based on selected line items
    if (marketerArray.length > 0) {
      marketerArray.forEach((item: any) => {
        allMarketers?.forEach((marketer) => {
          if (item === marketer.label) {
            marketer.campaigns.forEach((c) => {
              allCampaign?.forEach((cam) => {
                if (c.campaign_external_id === cam.key) {
                  campaignFilter.push(cam);
                }
              });
            });
            marketer.line_items.forEach((c) => {
              allLineItem?.forEach((cam) => {
                if (c.line_item_external_id === cam.key) {
                  lineItemFilter.push(cam);
                }
              });
            });
          }
        });
      });
      setFilteredLineItems(lineItemFilter);
      setFilteredCampaign(campaignFilter);
    } else {
      // If no marketer items selected, show all line items
      setFilteredLineItems(allLineItem ?? []);
      setFilteredCampaign(allCampaign ?? []);
    }

    setFilterValues({
      ...filterValues,
      selectedMarketers: marketerArray,
      reset: false,
    });
  };

  const handleComparisonChange = (data: any) => {
    setCompareFactor(data?.selectedItems);
    setFilterValues({
      ...filterValues,
      selectedComparison: data?.selectedItems,
      reset: false,
    });
  };
  const handleClick = () => {
    const dateRange: any = ranges[2].value;
    // Reset filtered arrays to their original values
    setFilteredMarketers(allMarketers || []);
    setFilteredLineItems(allLineItem || []);

    setFilterValues({
      dateRange: {
        startDate: dateRange[0].format('YYYY-MM-DD'),
        endDate: dateRange[1].format('YYYY-MM-DD'),
      },
      selectedCompaigns: [],
      selectedLineItems: [],
      selectedMarketers: [],
      reset: true,
    });
  };

  const handleRefresh = () => {
    setFilterValues({
      ...filterValues,
      reset: false,
    });
    if (onRefresh) {
      onRefresh(filterValues);
    }
  };

  return (
    <Row gutter={[12, 12]} align={'bottom'} className='filter-container'>
      <Col span={5}>
        <DateRangeDropdown
          allDateRange={allTimeFrame}
          selectedDateRange={selectedUnit}
          handleSelectionChange={handleDateChange}
        />
      </Col>
      <Col span={4}>
        <MarketersItemsDropdown
          allLineItems={filteredMarketers}
          selectedLineItem={selectedUnit}
          handleSelectionChange={handleMarketerChange}
        />
      </Col>
      <Col span={4}>
        <CampaignItemsDropdown
          allLineItems={filteredCampaign}
          selectedLineItem={selectedUnit}
          handleSelectionChange={handleCampaignChange}
        />
      </Col>
      <Col span={4}>
        <LineItemsDropdown
          allLineItems={filteredLineItems}
          selectedLineItem={selectedUnit}
          handleSelectionChange={handleLineItem}
        />
      </Col>
      <Col span={4}>
        <ComparisonDropdown
          allLineItems={allComparison}
          selectedLineItem={selectedUnit}
          handleSelectionChange={handleComparisonChange}
        />
      </Col>
      <Col span={3} style={{ textAlign: 'right' }}>
        <OutlineBlueButton onClick={handleClick}>Reset</OutlineBlueButton>
        <OutlineBlueButton onClick={handleRefresh} style={{ marginLeft: '8px' }}>
          <Tooltip title='Refresh'>
            <SyncOutlined />
          </Tooltip>
        </OutlineBlueButton>
      </Col>
    </Row>
  );
};
