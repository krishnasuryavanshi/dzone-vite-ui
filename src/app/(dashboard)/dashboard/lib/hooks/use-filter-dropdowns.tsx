import { useEffect, useState } from 'react';
import { FilterMenuItemLabel } from '../../components/filters-manager/filter-menu-item-label';
import {
  IFilterCampaign,
  IFilterClient,
  IFilterLineItem,
  ISelectedIds,
} from '../types';
import { mapSelectedItems } from '../utils';

export interface IUseFilterDropdowns {
  allLineItems?: IFilterLineItem[];
  allClients?: IFilterClient[];
  allCampaigns?: IFilterCampaign[];
  submit: number;
  reset: number;
  handleSelection: (data: ISelectedIds) => void;
  activeTab: string;
}

export function useFilterDropdowns({
  allLineItems,
  allCampaigns,
  submit,
  reset,
  handleSelection,
}: IUseFilterDropdowns) {
  const [selectedLineItems, setSelectedLineItems] = useState<string[]>(['all']);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(['all']);
  const [selectedDuration, setSelectedDuration] = useState<string[]>(['week']);
  const [selectedUnit, setSelectedUnit] = useState<string[]>(['Revenue']);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string[]>(['MTD']);
  const [availableCampaigns, setAvailableCampaigns] = useState<
    IFilterCampaign[]
  >([]);
  const [availableLineItems, setAvailableLineItems] = useState<
    IFilterLineItem[]
  >([]);

  const submitAction = (iniatialState: boolean = false) => {
    handleSelection &&
      handleSelection({
        selectedLineItems: mapSelectedItems(
          (iniatialState && ['all']) || selectedLineItems,
          availableLineItems,
        ),
        selectedCampaigns: mapSelectedItems(
          (iniatialState && ['all']) || selectedCampaigns,
          availableCampaigns,
        ),
        selectedDuration: (iniatialState && ['week']) || selectedDuration,
        selectedUnit: (iniatialState && ['Revenue']) || selectedUnit,
        selectedTimeFrame: (iniatialState && ['MTD']) || selectedTimeFrame,
      });
  };

  useEffect(() => {
    setSelectedUnit(['Revenue']);
    setSelectedTimeFrame(['MTD']);
    setSelectedDuration(['week']);
    setSelectedCampaigns(['all']);
    setSelectedLineItems(['all']);
    submitAction(true);
  }, [reset]);

  useEffect(submitAction, [submit]);

  useEffect(() => {
    if (allCampaigns?.length) {
      allCampaigns[0] = {
        ...allCampaigns[0],
        label: (
          <FilterMenuItemLabel
            name={'pages.campaigns.label.allCampaigns'}
            count={allCampaigns.length - 1}
            all
          />
        ),
      };
      setAvailableCampaigns(allCampaigns);
    }
  }, [allCampaigns]);

  useEffect(() => {
    if (allLineItems?.length) {
      allLineItems[0] = {
        ...allLineItems[0],
        label: (
          <FilterMenuItemLabel
            name={'pages.lineItems.label.allLineItems'}
            count={allLineItems.length - 1}
            all
          />
        ),
      };
      setAvailableLineItems(allLineItems);
    }
  }, [allLineItems]);

  useEffect(() => {
    if (allLineItems) {
      let availableLineItemsCopy = [...allLineItems];
      if (selectedCampaigns.includes('all')) {
        availableLineItemsCopy = [...allLineItems];
      } else {
        availableLineItemsCopy = allLineItems.filter((lineItem) => {
          return (
            selectedCampaigns.includes(lineItem.campaignId) ||
            lineItem.key === 'all'
          );
        });
      }
      availableLineItemsCopy[0] = {
        ...availableLineItemsCopy[0],
        label: (
          <FilterMenuItemLabel
            name={'pages.lineItems.label.allLineItems'}
            count={availableLineItemsCopy.length - 1}
            all
          />
        ),
      };
      setAvailableLineItems(availableLineItemsCopy);
    }
  }, [selectedCampaigns]);

  const handleSelectionChange = (data: {
    type: string;
    selectedItems: string[];
  }) => {
    const setMethod =
      (data.type === 'selectedLineItems' && setSelectedLineItems) ||
      (data.type === 'selectedCampaigns' && setSelectedCampaigns) ||
      (data.type === 'selectedTimeFrame' && setSelectedTimeFrame) ||
      (data.type === 'selectedUnit' && setSelectedUnit) ||
      setSelectedDuration;

    setMethod &&
      setMethod(data?.selectedItems?.length ? data.selectedItems : ['all']);
  };

  return {
    selectedLineItems,
    selectedCampaigns,
    selectedDuration,
    availableCampaigns,
    availableLineItems,
    handleSelectionChange,
    selectedTimeFrame,
    selectedUnit,
  };
}
