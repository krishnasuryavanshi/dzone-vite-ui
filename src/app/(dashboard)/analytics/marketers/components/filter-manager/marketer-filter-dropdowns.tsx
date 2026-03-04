import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Tooltip } from '@/uicomponents';
import { IUseFilterDropdowns, useFilterDropdowns } from '@/app/(dashboard)/dashboard/lib/hooks';
import { SyncOutlined } from '@/uicomponents/icons';
import { DateRangeDropdown } from '../../../supplier/components/filter-manager/dateRange-dropdown';
import { CampaignItemsDropdown } from './campaign-dropdown';
import { SupplierItemsDropdown } from './supplier-dropdown';
import OutlineBlueButton from '@/app/(dashboard)/components/outline-button/outline-button';
import { ComparisonDropdown } from './comparison-dropdown';
import { MarketersItemsDropdown } from '../../../supplier/components/filter-manager/marketer-dropdown';
import { LineItemsDropdown } from '../../../supplier/components/filter-manager/lineItems-dropdown';
import dayjs from 'dayjs';
import {
  CampaignFilter,
  LineItemFilter,
  MarketerFilter,
  SupplierFilter,
} from '../../utils/marketer-filter';
import {
  FilterState,
  useFilterDashboardStore,
} from '@/app/(dashboard)/analytics/store/filter-dashboard-store/use-filter-dashboard-store';
import { Col, Row } from '@/uicomponents/layout/grid';
import { TimeRangePickerProps } from '@/lib/types/uicomponents';

interface IMarketerFilterDropdown extends IUseFilterDropdowns {
  submit: number;
  reset: number;
  allSuppliers?: SupplierFilter[];
  allMarketers?: MarketerFilter[];
  allLineItem?: LineItemFilter[];
  allCampaign?: CampaignFilter[];
  allTimeFrame?: { key: string; label: ReactNode }[];
  allComparison?: { key: string; label: ReactNode }[];
  onRefresh?: (filters: any) => void;
}

export const MarketerFilterDropdowns: FC<IMarketerFilterDropdown> = ({
  submit,
  reset,
  allSuppliers,
  allMarketers,
  allLineItem,
  allCampaign,
  allTimeFrame,
  allComparison,
  activeTab,
  handleSelection,
  onRefresh,
}) => {
  const { selectedUnit } = useFilterDropdowns({
    submit,
    reset,
    handleSelection,
    activeTab,
  });
  const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierFilter[]>([]);
  const [filteredCampaign, setFilteredCampaign] = useState<CampaignFilter[]>([]);
  const [filteredMarketers, setFilteredMarketers] = useState<MarketerFilter[]>([]);
  const [filteredLineItems, setFilteredLineItems] = useState<LineItemFilter[]>([]);
  const filterValues = useFilterDashboardStore((state: FilterState) => state.filterValues);
  const setFilterValues = useFilterDashboardStore((state: FilterState) => state.setFilterValues);
  const setCompareFactor = useFilterDashboardStore((state: FilterState) => state.setCompareFactor);
  const ranges: TimeRangePickerProps['presets'] = [
    { label: 'Today', value: [dayjs(), dayjs()] },
    { label: 'Last 7 Days', value: [dayjs().subtract(6, 'day'), dayjs()] },
    { label: 'Last 30 Days', value: [dayjs().subtract(29, 'day'), dayjs()] },
  ];

  // Update filtered values when props change
  useEffect(() => {
    if (allSuppliers?.length) {
      setFilteredSuppliers(allSuppliers);
    }
  }, [allSuppliers]);

  useEffect(() => {
    setFilteredCampaign(allCampaign || []);
  }, [allCampaign]);

  useEffect(() => {
    setFilteredMarketers(allMarketers || []);
  }, [allMarketers]);

  useEffect(() => {
    setFilteredLineItems(allLineItem || []);
  }, [allLineItem]);

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
    let supplierFilter: any = [];
    // Filter suppliers based on selected campaign items
    if (compaignsArray.length > 0) {
      compaignsArray.forEach((item: any) => {
        filteredCampaign?.forEach((campaign) => {
          if (item === campaign.key) {
            campaign.line_items.forEach((c) => {
              filteredLineItems?.forEach((cam) => {
                if (c.line_item_external_id === cam.key) {
                  lineItemFilter.push(cam);
                }
              });
            });
            campaign.marketers.forEach((c) => {
              filteredMarketers?.forEach((cam) => {
                if (c.marketer_code === cam.key) {
                  marketerFilter.push(cam);
                }
              });
            });
            campaign.supplier.forEach((c) => {
              filteredSuppliers?.forEach((cam) => {
                if (c.supplier_code === cam.key) {
                  supplierFilter.push(cam);
                }
              });
            });
          }
        });
      });
      setFilteredLineItems(lineItemFilter);
      setFilteredMarketers(marketerFilter);
      setFilteredSuppliers(supplierFilter);
    } else {
      setFilteredLineItems(allLineItem ?? []);
      setFilteredMarketers(allMarketers ?? []);
      setFilteredSuppliers(allSuppliers ?? []);
    }

    setFilterValues({
      ...filterValues,
      selectedCompaigns: compaignsArray,
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
    let supplierFilter: any = [];
    // Filter Campaign based on selected marketer
    if (marketerArray.length > 0) {
      marketerArray.forEach((item: any) => {
        filteredMarketers?.forEach((marketer) => {
          if (item === marketer.key) {
            marketer.campaigns.forEach((c) => {
              filteredCampaign?.forEach((cam) => {
                if (c.campaign_external_id === cam.key) {
                  campaignFilter.push(cam);
                }
              });
            });
            marketer.line_items.forEach((c) => {
              filteredLineItems?.forEach((cam) => {
                if (c.line_item_external_id === cam.key) {
                  lineItemFilter.push(cam);
                }
              });
            });
            marketer.supplier.forEach((c) => {
              filteredSuppliers?.forEach((cam) => {
                if (c.supplier_code === cam.key) {
                  supplierFilter.push(cam);
                }
              });
            });
          }
        });
      });
      setFilteredCampaign(campaignFilter);
      setFilteredLineItems(lineItemFilter);
      setFilteredSuppliers(supplierFilter);
    } else {
      // If no marketer items selected, show all line items
      setFilteredCampaign(allCampaign ?? []);
      setFilteredLineItems(allLineItem ?? []);
      setFilteredSuppliers(allSuppliers ?? []);
    }

    setFilterValues({
      ...filterValues,
      selectedMarketers: marketerArray,
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
    let supplierFilter: any = [];
    // Filter marketers based on selected line items
    if (lineItemsArray.length > 0) {
      lineItemsArray.forEach((item: any) => {
        filteredLineItems?.forEach((lineItem) => {
          if (item === lineItem.key) {
            lineItem.campaigns.forEach((c) => {
              filteredCampaign?.forEach((cam) => {
                if (c.campaign_external_id === cam.key) {
                  campaignFilter.push(cam);
                }
              });
            });
            lineItem.marketers.forEach((c) => {
              filteredMarketers?.forEach((cam) => {
                if (c.marketer_code === cam.key) {
                  marketerFilter.push(cam);
                }
              });
            });
            lineItem.supplier.forEach((c) => {
              filteredSuppliers?.forEach((cam) => {
                if (c.supplier_code === cam.key) {
                  supplierFilter.push(cam);
                }
              });
            });
          }
        });
      });
      setFilteredSuppliers(supplierFilter);
      setFilteredMarketers(marketerFilter);
      setFilteredCampaign(campaignFilter);
    } else {
      // If no line items selected, show all marketers
      setFilteredSuppliers(allSuppliers ?? []);
      setFilteredMarketers(allMarketers ?? []);
      setFilteredCampaign(allCampaign ?? []);
    }

    setFilterValues({
      ...filterValues,
      selectedLineItems: lineItemsArray,
      reset: false,
    });
  };

  const handleSupplierChange = (data: any) => {
    let suppliersArray: any = [];
    data.selectedItems.forEach((element: any) => {
      suppliersArray.push(element);
    });
    let lineItem: any = [];
    let marketer: any = [];
    let campaign: any = [];
    if (suppliersArray.length > 0) {
      suppliersArray.forEach((item: any) => {
        filteredSuppliers?.forEach((supplier) => {
          if (item === supplier.label) {
            supplier.campaigns.forEach((c) => {
              filteredCampaign?.forEach((cam) => {
                if (c.campaign_external_id === cam.key) {
                  campaign.push(cam);
                }
              });
            });
            supplier.marketers.forEach((c) => {
              filteredMarketers?.forEach((cam) => {
                if (c.marketer_code === cam.key) {
                  marketer.push(cam);
                }
              });
            });
            supplier.line_items.forEach((c) => {
              filteredLineItems?.forEach((cam) => {
                if (c.line_item_external_id === cam.key) {
                  lineItem.push(cam);
                }
              });
            });
          }
        });
      });
      setFilteredLineItems(lineItem);
      setFilteredMarketers(marketer);
      setFilteredCampaign(campaign);
    } else {
      // If no line items selected, show all marketers
      setFilteredLineItems(allLineItem ?? []);
      setFilteredMarketers(allMarketers ?? []);
      setFilteredCampaign(allCampaign ?? []);
    }
    setFilterValues({
      ...filterValues,
      selectedSuppliers: suppliersArray,
      reset: false,
    });
  };

  const handleComparisonChange = (data: any) => {
    setCompareFactor(data.selectedItems);
    setFilterValues({
      ...filterValues,
      selectedComparison: data.selectedItems,
      reset: false,
    });
  };

  const handleClick = () => {
    const range: any = ranges[2].value;
    const sd = range[0].format('YYYY-MM-DD');
    const ed = range[1].format('YYYY-MM-DD');
    setFilterValues({
      dateRange: { startDate: sd, endDate: ed },
      selectedCompaigns: [],
      selectedSuppliers: [],
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
      <Col span={3}>
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
      <Col span={3}>
        <LineItemsDropdown
          allLineItems={filteredLineItems}
          selectedLineItem={selectedUnit}
          handleSelectionChange={handleLineItem}
        />
      </Col>
      <Col span={3}>
        <SupplierItemsDropdown
          allLineItems={filteredSuppliers}
          selectedLineItem={selectedUnit}
          handleSelectionChange={handleSupplierChange}
        />
      </Col>
      <Col span={3}>
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
