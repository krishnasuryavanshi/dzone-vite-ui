import { BasicTable } from '@/components/table';
import { useScrollableTableHeight } from '@/lib/hooks';
import { Filters } from '@/lib/utils/table';
import { cloneDeep } from 'lodash';
import { useRouter } from '@/lib/hooks/use-router';
import { FC } from 'react';
import { useListColumns } from '../lib/hooks';
import { useCampaignFilterOptions } from './lib/hooks';
import { ICampaign } from './lib/types';
import { generateCampaignLinks } from './lib/utils';
import CampaignDetailsSchema from './lib/schemas/campaign-form.json';

interface Props {
  campaigns: ICampaign[];
  hasFilters?: boolean;
  isDzoneUser?: boolean;
  filterInfo?: Filters<ICampaign>;
  assignedTo: string;
  handleFiltersChange?: (filters: Filters<ICampaign>) => void;
}

const StaticContentHeight = 216;

export const CampaignList: FC<Props> = ({
  campaigns,
  hasFilters,
  filterInfo,
  assignedTo,
  handleFiltersChange,
}) => {
  const router = useRouter();
  const options = useCampaignFilterOptions(hasFilters, assignedTo);

  const columns = useListColumns<ICampaign>(
    cloneDeep(CampaignDetailsSchema),
    hasFilters,
    filterInfo,
    options,
  );
  const { scrollableTableHeight } = useScrollableTableHeight(StaticContentHeight);

  const handleRowClick = (record: ICampaign) => {
    const showCampaignLink = generateCampaignLinks(record);
    router.push(showCampaignLink);
  };

  const handleChange = ({ filters }: { filters: Filters<ICampaign> }) => {
    handleFiltersChange && handleFiltersChange(filters);
  };

  return (
    <BasicTable
      className='row-hover-highlight'
      columns={columns}
      data={campaigns}
      hasPagination={false}
      scrollableHeight={scrollableTableHeight}
      onClick={(record: any) => handleRowClick(record)}
      rowHref={(record) => generateCampaignLinks(record)}
      handleChange={handleChange}
    />
  );
};
