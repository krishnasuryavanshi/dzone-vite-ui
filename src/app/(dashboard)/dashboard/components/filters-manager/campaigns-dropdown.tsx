import { DzDropdown } from '@/components/shared/custom';
import React, { FC, useEffect, useState } from 'react';
import { IFilterCampaign } from '../../lib/types';
import { getSelectedItems } from '../../lib/utils';
import { debounce } from 'lodash';

interface ICampaignsDropdownProps {
  availableCampaigns: IFilterCampaign[];
  selectedCampaigns?: string[];
  handleSelectionChange: (data: {
    type: string;
    selectedItems: string[];
  }) => void;
}

export const CampaignsDropdown: FC<ICampaignsDropdownProps> = ({
  availableCampaigns,
  selectedCampaigns,
  handleSelectionChange,
}) => {
  const [campaigns, setCampaigns] = useState<IFilterCampaign[]>();

  useEffect(() => {
    setCampaigns(availableCampaigns);
    if (!selectedCampaigns?.includes('all')) {
      const campaigns = availableCampaigns.map((campaign) => campaign.key);
      const selectedItems = selectedCampaigns?.filter((id) =>
        campaigns.includes(id),
      );
      handleSelectionChange &&
        handleSelectionChange({
          type: 'selectedCampaigns',
          selectedItems: selectedItems as string[],
        });
    }
  }, [availableCampaigns]);

  const handleCampaignSelection = (data: any) => {
    const selectedItems = getSelectedItems(
      selectedCampaigns as string[],
      data.selectedKeys,
    );
    handleSelectionChange &&
      handleSelectionChange({ type: 'selectedCampaigns', selectedItems });
  };

  const handleSeach = (value: string) => {
    setCampaigns(
      availableCampaigns?.filter(
        (campaign) =>
          campaign.key === 'all' ||
          campaign?.name?.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  const debouncedSearch = debounce(handleSeach, 500);

  return (
    <DzDropdown
      className='dz-dropdown filter-dropdown filter-dropdown-Campaigns'
      items={campaigns}
      label='pages.campaigns.title'
      selectedItems={selectedCampaigns}
      onSelect={handleCampaignSelection}
      handleSearch={debouncedSearch}>
      {(selectedCampaigns?.includes('all') && 'All Campaigns') ||
        (selectedCampaigns?.length === 0 && 'No Campaign') ||
        (selectedCampaigns?.length === 1 && '1 Campaign') ||
        (selectedCampaigns?.length && `${selectedCampaigns.length} Campaigns`)}
    </DzDropdown>
  );
};
